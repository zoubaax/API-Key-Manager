const express = require("express");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const projectRoutes = require("./routes/projectRoutes");
const { corsMiddleware } = require("./middleware/cors");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

app.use(corsMiddleware);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/", protectedRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
