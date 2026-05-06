const crypto = require("crypto");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [80, "Name must be less than 80 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");

    return `${salt}:${hash}`;
};

userSchema.pre("save", function hashPasswordBeforeSave() {
    if (!this.isModified("password")) {
        return;
    }

    this.password = hashPassword(this.password);
});

userSchema.methods.matchPassword = function matchPassword(password) {
    const [salt, storedHash] = this.password.split(":");
    const hash = crypto.scryptSync(password, salt, 64);
    const storedHashBuffer = Buffer.from(storedHash, "hex");

    return (
        storedHashBuffer.length === hash.length &&
        crypto.timingSafeEqual(storedHashBuffer, hash)
    );
};

module.exports = mongoose.model("User", userSchema);
