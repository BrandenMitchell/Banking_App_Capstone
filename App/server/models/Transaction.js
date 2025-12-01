const { Schema, model } = require("mongoose");

// stores every transaction (deposit, withdraw, transfer)
const TransactionSchema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    
    amount: { type: Number, required: true },

    type: { type: String, enum: ["deposit", "withdrawal", "transfer"] },

    description: { type: String, trim: true },
    
    timestamp: { type: Date, default: Date.now },

    // Plaid-specific fields
    transactionId: { type: String, unique: true, sparse: true }, // Plaid transaction ID
    date: { type: Date },
    name: { type: String }, // Transaction name from Plaid
    merchantName: { type: String },
    category: { type: String },
    pending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("Transaction", TransactionSchema);
