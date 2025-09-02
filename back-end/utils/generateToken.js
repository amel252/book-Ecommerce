import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, proccess.env.JWT_SECRET, {
        expiredIn: "30d",
    });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "devlopement",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
    });
};

export default generateToken;
