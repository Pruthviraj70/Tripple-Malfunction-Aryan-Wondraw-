import express from "express";
import { v4 as uuidv4 } from "uuid";
import { users, loans } from "../data/db.js";

const router = express.Router();

/**
 * Create Loan Request (Borrower only)
 * POST /loans
 */
router.post("/", (req, res) => {
  const { borrowerId, amount } = req.body;
  const user = users.find(u => u.id === borrowerId && u.role === "borrower");
  if (!user) {
    return res.status(400).json({ error: "Invalid borrower" });
  }

  const loan = {
    id: uuidv4(),
    borrowerId,
    amount,
    fundedBy: null,
    status: "pending" // pending | funded | repaid
  };

  loans.push(loan);
  res.status(201).json(loan);
});

/**
 * Fund Loan (Lender only)
 * POST /loans/:loanId/fund
 */
router.post("/:loanId/fund", (req, res) => {
  const { loanId } = req.params;
  const { lenderId } = req.body;

  const lender = users.find(u => u.id === lenderId && u.role === "lender");
  if (!lender) {
    return res.status(400).json({ error: "Invalid lender" });
  }

  const loan = loans.find(l => l.id === loanId);
  if (!loan || loan.status !== "pending") {
    return res.status(400).json({ error: "Loan not available for funding" });
  }

  loan.fundedBy = lenderId;
  loan.status = "funded";
  res.json(loan);
});

/**
 * Mark Loan as Repaid (Borrower only)
 * POST /loans/:loanId/repay
 */
router.post("/:loanId/repay", (req, res) => {
  const { loanId } = req.params;
  const { borrowerId } = req.body;

  const loan = loans.find(
    l => l.id === loanId && l.borrowerId === borrowerId && l.status === "funded"
  );
  if (!loan) {
    return res.status(400).json({ error: "Invalid repayment request" });
  }

  loan.status = "repaid";
  res.json(loan);
});

/**
 * List all loans (for debugging/demo)
 * GET /loans
 */
router.get("/", (req, res) => {
  res.json(loans);
});

export default router;