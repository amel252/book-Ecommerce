import express from "express";
import {
    addOrderItems,
    getMyOrder,
    getOrderById,
    updateOrderToDelivered,
    getOrders,
    captureOrderPayment,
} from "../controller/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/mine").get(protect, getMyOrder);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, captureOrderPayment);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
