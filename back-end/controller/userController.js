import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
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
    console.log(req.body);

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
    const user = await User.create({
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

// --------------get user profile (private)-

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

// ------------get all users private pour l'admin -----
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}); // Récupère tous les documents de la collection User
    res.status(200).json(users); // Renvoie les résultats en JSON avec le code 200
});

// ------------------l'Admin va delete user---------
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    // si n'existe pas
    if (!user) {
        res.status(400);
        throw new Error("L'utilisateur non trouvé");
    }
    // si est admin
    if (user.isAdmin) {
        res.status(400);
        throw new Error(
            "Vous ne pouvez pas supprimer un compte administrateur"
        );
    }
    // si user existe
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "Utlisateur supprimé " });
});
// ---l'admin va récuperer l'user a traver son id (private admin )--
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    // si existe
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400);
        throw new Error("L'utilisateur non trouvé");
    }
});
// ----L'admin va mettre a jour un user --

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    // si n'existe pas
    if (!user) {
        res.status(400);
        throw new Error("L'utilisateur non trouvé");
    }
    // si email existe et n'est pas valide
    if (req.body.email && !validator.isEmail(req.body.email)) {
        res.status(400);
        throw new Error("L'adresse email invalide");
    }
    // empecher l'admin a devenir user simple
    if (user.isAdmin && req.body.isAdmin === false) {
        res.status(400);
        throw new Error("vous ne pouvez pas changer le role Admin ");
    }
    // mise a jour des champs user
    // si la mise a jour est défini on l'a prend sinon on garde la valeur précédente
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;

    // mise a jour de isAdmin seuelemnt si fourni (si autorisé )
    // l'admin peut modifié  le role de l'user , si le type est défirent qu'une chaine de caractere
    if (typeof req.body.isAdmin !== "undefined") {
        user.isAdmin = Boolean(req.body.isAdmin);
    }
    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
    });
});
export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    updateUser,
    getUserById,
};
