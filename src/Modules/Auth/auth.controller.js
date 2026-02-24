import express from "express";
import * as authService from "./auth.service.js";
import { authMiddleware } from "./auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const result = await authService.addUser(req.body);
  return res.status(201).json({ msg: "User added successfully", result });
});

authRouter.post("/signin", async (req, res) => {
  const result = await authService.addNewUser(req.body);
  return res.status(201).json({ msg: "Login successful", result });
});

authRouter.patch("/update/:userId", authMiddleware, async (req, res) => {
  const result = await authService.editUser(req.params.userId, req.body);
  return res.status(201).json({ msg: "User updated.", result });
});

authRouter.delete("/delete/:userId", authMiddleware, async (req, res) => {
  const result = await authService.deleteUser(req.params.userId);
  return res.status(201).json({ msg: "User deleted.", result });
});

authRouter.get("/", authMiddleware, async (req, res) => {
  const result = await authService.getUserById(req.userId);

  return res.status(201).json({ msg: "done.", result });
});

export default authRouter;
