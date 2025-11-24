const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createCategory,
  getAllCategories,
} = require("../controllers/category.controller");

router.post("/", auth, createCategory);
router.get("/", auth, getAllCategories);

module.exports = router;
