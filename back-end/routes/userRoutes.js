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
router.route("/").post(registerUser).get(getUsers);
router.post("logout", logoutUser);
router.post("/auth", authUser);
router.route("/profil").get(getUserProfile).put(updateUserProfile);
router.route("/:id").delete(deleteUser).get(getUserById).put(updateUser);

export default router;
