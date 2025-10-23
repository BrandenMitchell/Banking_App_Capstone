const { Schema, model } = require("mongoose");

// this model stores loan or credit info for users
const LoanSchema = new Schema(
  {

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    amount: { type: Number, required: true },

    interestRate: { type: Number, required: true },

    balanceRemaining: { type: Number, required: true },

    dueDate: { type: Date, required: true },

    status: { type: String, enum: ["active", "paid", "defaulted"], default: "active" },
  },
  { timestamps: true }
);

module.exports = model("Loan", LoanSchema);
