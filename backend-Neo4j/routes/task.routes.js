const router = require("express").Router();
const auth = require("../middleware/auth");
const { createTask, getTasks } = require("../controllers/task.controller");

router.post("/", auth, createTask);
router.get("/", auth, getTasks);

module.exports = router;
