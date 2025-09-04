import React from "react";
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// --------------------CRUD product-----------------------

// get all product (public visité par tout le monde)

// on ne met pas next il est déja inclu dans asyncHan
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});
// get Single Product (public)
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        return res.json(product);
    } else {
        res.status(404);
        throw new Errow("Produit non trouvé ");
    }
});

// create les produits (accée que Admin)
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        user: req.user._id,
        // avec l'id on peut acceder a tout le contenu de notre user
        name: "Sample Product",
        image: "/images/sample.png",
        category: "Produit category",
        description: "sample description  ",
        price: 0,
        rating: 0,
        numberReviews: 0,
        countInStock: 0,
    });
    const createProduct = await product.save();
    res.status(201).json(createProduct);
});
// update product (Admin private)
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, category, countInStock } =
        req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        // stocké dans des nouvelles variables
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.category = category;
        product.countInStock = countInStock;

        // le produit mis a jour est stocké dans updateProduct
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("produit non trouvé");
    }
});

// delete product (admin private)
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        // on supprime a travers son id
        await Product.deleteOne({ _id: product.id });
        res.status(200).json({ message: "Produit supprimé" });
    } else {
        throw new Error("produit non trouvé");
    }
});
// ---------------- review ---
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    // on veut récuperer les produits
    const product = await Product.findById(req.params.id);
    // si le produit est déja évalué , on vérifie la valeur déja stocké en BDD et la nouvelle valeur donné
    if (product) {
        const alreadyReviewed = product.reviews.find(
            (review) => review.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
            res.status(404);
            throw new Error("Produit déja évalué");
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        product.reviews.push(review);
        product.numberReviews = product.reviews.lengh;

        product.rating = product.reviews.reduce(
            (acc, review) => acc + review.rating,
            0
        );
        product.reviews.lenght;

        await product.save();
        res.status(201).json({ message: " L'ajout d'une évaluation réussie" });
    } else {
        res.status(404);
        throw new Error("Produit non trouvé ");
    }
});
export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
};
