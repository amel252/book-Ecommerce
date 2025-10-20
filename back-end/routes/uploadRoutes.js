import express from "express";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const router = express.Router();

// on configure notre fichier et notre cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: "e-commerce-book",
        allowed_formats: ["png", "jpg", "jpeg", "webp"],
    },
});
const upload = multer({ storage });
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Aucune image trouvé" });
        }
        // on ca l'img est trouvé :
        res.status(200).send({
            message: "Image téléchargé avec succées",
            image: req.file.path,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
export default router;
