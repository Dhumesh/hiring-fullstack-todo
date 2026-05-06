const express = require("express");
const router = express.Router();

const {
    getTodos,
    createTodo,
    updateTodo,
    toggleTodoDone,
    deleteTodo,
} = require("../../controllers/develop/todoController");
const { protect } = require("../../middleware/develop/authMiddleware");

// Routes
router.use(protect);

router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.patch("/:id/done", toggleTodoDone);
router.delete("/:id", deleteTodo);

module.exports = router;
