import express from "express";

const router = express.Router();

import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
} from "../controller/productController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

// sur la meme route je récupére et je crée ,
// --- sur cette route on protége la route de création des produits (faite que par l'admin )
router.route("/").get(getProducts).post(protect, admin, createProduct);
// d'habiture on sépare les routes ('/updateroute' , "/deleteproduct"), pour ne pas répéter plusierus lignes
router
    .route("/:id")
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);
router.route("/:id/reviews").post(protect, createProductReview);
export default router;
