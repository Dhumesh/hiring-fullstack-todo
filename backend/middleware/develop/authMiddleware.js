const User = require("../../models/develop/User");
const { verifyToken } = require("../../utils/develop/token");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing",
            });
        }

        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, user not found",
            });
        }

        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, token invalid",
        });
    }
};

module.exports = {
    protect,
};
