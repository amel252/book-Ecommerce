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

// sur la meme route je récupére et je crée ,
router.route("/").get(getProducts).post(createProduct);
// d'habiture on sépare les routes ('/updateroute' , "/deleteproduct"), pour ne pas répéter plusierus lignes
router
    .route("/:id")
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);
router.route("/:id/reviews").post(createProductReview);
export default router;
