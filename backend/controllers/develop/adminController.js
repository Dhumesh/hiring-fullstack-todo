const Todo = require("../../models/develop/Todo");
const User = require("../../models/develop/User");

const publicUserFields = "name email role createdAt updatedAt";

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select(publicUserFields).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { email, name, password, role } = req.body;
        const user = await User.findById(req.params.id).select("+password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) {
            user.name = name;
        }

        if (email) {
            user.email = email;
        }

        if (role && ["user", "admin"].includes(role)) {
            user.role = role;
        }

        if (password) {
            user.password = password;
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: "Admin cannot delete the current account" });
        }

        const deleted = await User.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "User not found" });
        }

        await Todo.deleteMany({ owner: req.params.id });

        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find().populate("owner", "name email role").sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.downloadReport = async (req, res) => {
    try {
        const users = await User.find().select(publicUserFields).sort({ createdAt: -1 });
        const todos = await Todo.find().populate("owner", "name email role").sort({ createdAt: -1 });
        const completed = todos.filter((todo) => todo.done).length;
        const pending = todos.length - completed;
        const rows = [
            ["Metric", "Value"],
            ["Total Users", users.length],
            ["Total Tasks", todos.length],
            ["Completed Tasks", completed],
            ["Pending Tasks", pending],
            [],
            ["Task", "Status", "Owner", "Owner Email", "Updated"],
            ...todos.map((todo) => [
                todo.title,
                todo.done ? "Completed" : "Pending",
                todo.owner?.name || "Unassigned",
                todo.owner?.email || "",
                todo.updatedAt?.toISOString() || "",
            ]),
        ];
        const csv = rows
            .map((row) =>
                row
                    .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
                    .join(",")
            )
            .join("\n");

        res.header("Content-Type", "text/csv");
        res.attachment("taskflow-report.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
