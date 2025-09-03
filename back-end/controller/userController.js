import asyncHandler from "../middleware/asyncHandler";
import User from "../model/userModel";
import generateToken from "../utils/generateToken";
import validator from "validator";

// ------------signIn User-----------
const authUser = asyncHandler(async (req, res) => {
    // les données de l'user envoyé (email , MPD)
    const { email, password } = req.body;
    // on récup l'user a travers de son email
    const user = await User.findOne({ email });
    //si l'user est récupéré et on compare le MDP
    if (user && (await user.matchPassword(password))) {
        // si c ok on génere le token
        generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            // on ne met pas le Mot de passe
        });
    } else {
        res.status(404);
        throw new Error("Email et mot de passe invalide");
    }
});
// -------------------signUp user------------------
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (
        !validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
    ) {
        res.status(404);
        throw new Error(
            "le mot de passe doit contenir au moins 8 caractéres, 1 miniscule ,1 majuscule , 1 nombre et 1 symbole "
        );
    }
    // si l'user est existant
    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(404);
        throw new Error("L'utilisateur est déja inscrit");
    }
    //si l'user n'existe pas on le crée
    const user = await user.create({
        name,
        email,
        password,
    });
    // on va lui attribué son token
    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("Utilisateur n'existe pas ");
    }
});

// ----------------logout user----------------

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Déconnexion reussi" });
});

// get user profile (private)

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("L'utilisateur non trouvé");
    }
});
// ---------------- update user profile -----------------

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    // si existe , si email est invalide
    if (user) {
        if (req.body.email && !validator.isEmail(req.body.email)) {
            res.status(400);
            throw new Error(" Email invalide");
        }
        // on verifie si existe et si invalide
        if (
            req.body.password &&
            !validator.isStrongPassword(req.body.password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
        ) {
            res.status(400);
            throw new Error(
                "Le mot de passe doit contenir au moins 8 caractères, un miniscule, un majiscule, un nombre et un symbole"
            );
        }
        // on met a jour
        // si on ne met pas a jour on remis l'ancien valeur
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }
        // on sauvegarde le user
        const updateUser = await user.save();

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("utilisateur non trouvé ");
    }
});
