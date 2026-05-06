const User = require("../../models/develop/User");
const { generateToken } = require("../../utils/develop/token");

const ADMIN_EMAIL = "admin123@gmail.com";
const ADMIN_PASSWORD = "Admin@2026";

const ensureAdminUser = async () => {
    const admin = await User.findOne({ email: ADMIN_EMAIL }).select("+password");

    if (!admin) {
        return User.create({
            name: "TaskFlow Admin",
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: "admin",
        });
    }

    let shouldSave = false;

    if (admin.role !== "admin") {
        admin.role = "admin";
        shouldSave = true;
    }

    if (!admin.matchPassword(ADMIN_PASSWORD)) {
        admin.password = ADMIN_PASSWORD;
        shouldSave = true;
    }

    if (shouldSave) {
        await admin.save();
    }

    return admin;
};

const sendAuthResponse = (res, statusCode, user) => {
    res.status(statusCode).json({
        success: true,
        token: generateToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        const user = await User.create({ name, email, password });

        return sendAuthResponse(res, 201, user);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors)[0].message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Signup failed",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        await ensureAdminUser();

        const user = await User.findOne({ email }).select("+password");

        if (!user || !user.matchPassword(password)) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        return sendAuthResponse(res, 200, user);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

const getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        },
    });
};

module.exports = {
    signup,
    login,
    getMe,
};
