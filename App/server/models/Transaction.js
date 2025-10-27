const { Schema, model } = require("mongoose");

// stores every transaction (deposit, withdraw, transfer)
const TransactionSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    
    amount: { type: Number, required: true },

    type: { type: String, enum: ["deposit", "withdrawal", "transfer"], required: true },

    description: { type: String, trim: true },
    
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = model("Transaction", TransactionSchema);
