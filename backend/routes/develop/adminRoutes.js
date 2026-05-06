const express = require("express");
const {
    deleteUser,
    downloadReport,
    getAllTodos,
    getUsers,
    updateUser,
} = require("../../controllers/develop/adminController");
const { adminOnly, protect } = require("../../middleware/develop/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/todos", getAllTodos);
router.get("/reports/download", downloadReport);

module.exports = router;
