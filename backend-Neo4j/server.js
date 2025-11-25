require("dotenv").config();
const express = require("express");
const app = express();

const { ensureConstraints } = require("./utils/createConstraints");

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/ping", (req, res) => {
  res.send("Backend is working!");
});

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/tasks", require("./routes/task.routes"));
app.use("/categories", require("./routes/category.routes"));

app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL BACKEND ERROR:", err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 3000;

ensureConstraints().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
});
