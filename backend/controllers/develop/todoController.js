const Todo = require("../../models/develop/Todo");

// GET all todos
exports.getTodos = async (req, res) => {
    try {
        const filter = req.user.role === "admin" ? {} : { owner: req.user._id };
        const todos = await Todo.find(filter).populate("owner", "name email role").sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE todo
exports.createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;

        const todo = new Todo({
            title,
            description,
            owner: req.user._id,
        });

        const savedTodo = await todo.save();
        res.status(201).json(savedTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// UPDATE todo
exports.updateTodo = async (req, res) => {
    try {
        const { title, description } = req.body;

        const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, owner: req.user._id };
        const updated = await Todo.findOneAndUpdate(filter, { title, description }, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// TOGGLE done
exports.toggleTodoDone = async (req, res) => {
    try {
        const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, owner: req.user._id };
        const todo = await Todo.findOne(filter);

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        todo.done = !todo.done;
        const updated = await todo.save();

        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE todo
exports.deleteTodo = async (req, res) => {
    try {
        const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, owner: req.user._id };
        const deleted = await Todo.findOneAndDelete(filter);

        if (!deleted) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json({ message: "Todo deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
