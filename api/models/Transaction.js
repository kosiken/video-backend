module.exports = {
  attributes: {
    transactionType: {
      type: "string",
      isIn: ["withdrawal", "payment"],
      required: true,
    },
    amount: {
      type: "number",
      required: true,
    },
    associatedUser: {
      model: "user",
      required: true,
    },
    txnID: {
      type: "string",
    },
    txnFee: {
      type: "number",
      defaultsTo: 0,
    },
    depositBalance: {
      type: "number",
     required: true
    }
  },
  beforeCreate: async function (valuesToSet, proceed) {
    // Hash password
    console.log("here");
    const IsDev = sails.config.environment === "development";
    if (IsDev) {
      let id = await sails.helpers.createUserId.with();
      valuesToSet.id = id;
    }
    let txnID = await sails.helpers.createUserId.with();
    valuesToSet.txnID = "TXN" + txnID;
    if (valuesToSet.type === "withdrawal") {
      valuesToSet.transactionFee = 0.015 * valuesToSet.amount;
      if (valuesToSet.transactionFee < 0.02) {
        valuesToSet.transactionFee = 0.02;
      }
    }

    return proceed();
  },
};
