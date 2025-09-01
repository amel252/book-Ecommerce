import React from "react";
import asyncHandler from "../middleware/asyncHandler";
import Product from "../models/productModel";

// get all product (public visité par tout le monde)

// on ne met pas next il est déja inclu dans asyncHan
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});
// get Single Product (public)
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params._id);
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
    const product = await Product.findById(req.params._id);
    if (product) {
        // on supprime a travers son id
        await Product.deleteOne({ _id: product.id });
        res.status(200).json({ message: "Produit supprimé" });
    } else {
        throw new Error("produit non trouvé");
    }
});

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
