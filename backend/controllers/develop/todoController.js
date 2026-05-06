const Todo = require("../../models/develop/Todo");

// GET all todos
exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
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

        const updated = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// TOGGLE done
exports.toggleTodoDone = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

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
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: "Todo deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};