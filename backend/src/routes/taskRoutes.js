const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const taskCtrl = require("../controllers/taskController");

router.use(auth);

router.post("/", taskCtrl.createTask);
router.get("/", taskCtrl.getTasks);
router.get("/:id", taskCtrl.getTask);
router.put("/:id", taskCtrl.updateTask);
router.delete("/:id", taskCtrl.deleteTask);

// category assignment
router.post("/:id/categories/:catId", taskCtrl.assignCategory);
router.delete("/:id/categories/:catId", taskCtrl.removeCategory);

module.exports = router;
