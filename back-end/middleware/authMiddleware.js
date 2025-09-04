import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// middleware qui permet de protégé  les routes Utilisateur
const protect = asyncHandler(async (req, res, next) => {
    let token;
    //assigné le token de l'user a notre variable token
    token = req.cookies.jwt;
    // si token existe :
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("L'utilisateur n'est pas connecté");
        }
    } else {
        res.status(401);
        throw new Error("Vous n'avez pas l'autorisation ");
    }
});
// middleware pour protégé l' Admin
const admin = (req, res, next) => {
    // si requete existe et si user is admin
    if (req.user && req.user.isAdmin) {
        next();
        // si pas Admin
    } else {
        res.status(401);
        throw new Error("Vous n'avez pas l'autorisation ");
    }
};

export { protect, admin };
