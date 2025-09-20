import mongoose from "mongoose";

// model pour les avis :
const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User", // fait refernce au model user
        },
        // on aura besoin de l'Id du user + son Nom
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
// model pour le produit
const productSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User", // fait refernce au model user
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        // contenu de l'avis
        reviews: [reviewSchema],
        // note d'évaluation
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        // nombre d'avis
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);
export default Product;
