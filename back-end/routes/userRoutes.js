import express from "express";
const router = express.Router();

import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    updateUser,
    getUserById,
} from "../controller/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
// je ne protege la page d'inscription est visieul par l'user
router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/logout", logoutUser);
router.post("/auth", authUser);
router
    .route("/profil")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router
    .route("/:id")
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

export default router;
