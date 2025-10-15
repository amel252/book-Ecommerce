import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { calcPrice } from "../utils/calcPrice.js";
import { createPaypalOrder, capturePaypalOrder } from "../utils/paypal.js";
// import {  verifyPaypalPayment } from "../utils/paypal.js";

// effectuer une commande
const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    // Vérifier si le tableau existe et n’est pas vide
    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error("Pas de commande trouvée");
    }

    // On récupère depuis la DB les produits correspondants aux IDs envoyés par le client
    const itemsFromDB = await Product.find({
        // chaque tour de boucle on récupère l'id du produit
        _id: { $in: orderItems.map((x) => x._id) },
    });

    // On crée un tableau d'articles de commande en fusionnant infos client + prix de la DB
    const dbOrderItems = orderItems.map((itemFromClient) => {
        // on cherche le produit correspondant en DB
        const matchingItemFromDB = itemsFromDB.find(
            (dbItem) => dbItem._id.toString() === itemFromClient._id
        );

        return {
            ...itemFromClient, // on garde les infos envoyées par le client
            product: itemFromClient._id, // on garde une référence vers le produit
            price: matchingItemFromDB?.price ?? 0, // sécurité si pas trouvé
            _id: undefined, // on enlève l’_id pour que Mongo en génère un nouveau
        };
    });
    //  ---------------- nous avons arreté
    // On calcule les prix (articles, taxes, livraison, total)
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
        calcPrice(dbOrderItems);

    // On crée une nouvelle commande dans MongoDB
    const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id, // récupéré grâce au middleware d’auth
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    // On sauvegarde la commande
    const createdOrder = await order.save();

    const paypalOrder = await createPaypalOrder(totalPrice);

    // On renvoie la réponse au client
    res.status(201).json({
        _id: createdOrder._id,
        paypalId: paypalOrder.id,
    });
});

// commande par paypal

const captureOrderPayment = asyncHandler(async (req, res) => {
    const { id: orderId } = req.params; // local order ID
    const { paypalId } = req.body; // PayPal order ID

    const order = await Order.findById(orderId);
    if (!order) {
        res.status(404);
        throw new Error("Commande non trouvé");
    }

    // ✅ Capture PayPal payment
    const capture = await capturePaypalOrder(paypalId);

    // ✅ Update local order if success
    if (capture.status === "COMPLETED") {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: capture.id,
            status: capture.status,
            update_time: capture.update_time,
            email_address: capture.payer.email_address,
        };

        // reduce stock
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock -= item.qty;
                await product.save();
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(400);
        throw new Error("Echec du payement");
    }
});

// recup de toutes mes commandes

const getMyOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json(orders);
});

// recup d une commande à partir de son id
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error("Commande non trouvée");
    }
});

// mise à jour ud une commande livre

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

// recup de toutes les commandes
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
});

export {
    addOrderItems,
    getMyOrder,
    getOrderById,
    updateOrderToDelivered,
    getOrders,
    captureOrderPayment,
};
