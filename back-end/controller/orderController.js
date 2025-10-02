import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { calcPrice } from "../utils/calcPrice.js";
import { verifyPaypalPayment } from "../utils/paypal.js";

// @desc    Ajouter une nouvelle commande
// @route   POST /api/orders
// @access  Privé
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

    // On renvoie la réponse au client
    res.status(201).json(createdOrder);
});
const getMyOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if (order) {
        res.status.json(order);
    } else {
        res.status(404);
        throw new Eroor("commande non trouvée");
    }
});

export { addOrderItems, getMyOrder };
