const express = require("express");
const router = express.Router();
const categoryCtrl = require("../controllers/categoryController");

router.post("/", categoryCtrl.createCategory);
router.get("/", categoryCtrl.listCategories);

module.exports = router;
