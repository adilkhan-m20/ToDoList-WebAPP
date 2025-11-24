require("dotenv").config();
const express = require("express");
const app = express();

const { ensureConstraints } = require("./utils/createConstraints");

app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/tasks", require("./routes/task.routes"));
app.use("/categories", require("./routes/category.routes"));

const PORT = process.env.PORT || 3000;

ensureConstraints().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
