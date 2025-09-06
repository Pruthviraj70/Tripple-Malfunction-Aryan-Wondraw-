import express from "express";
import { v4 as uuidv4 } from "uuid";
import { users } from "../data/db.js";

const router = express.Router();

/**
 * Register User
 * POST /users/register
 * { name, role: "borrower" | "lender" }
 */
router.post("/register", (req, res) => {
  const { name, role } = req.body;
  if (!name || !role || !["borrower", "lender"].includes(role)) {
    return res.status(400).json({ error: "Name and valid role required" });
  }

  const user = { id: uuidv4(), name, role };
  users.push(user);
  res.status(201).json(user);
});

export default router;