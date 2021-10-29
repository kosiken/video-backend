module.exports = {
  friendlyName: "Pay creator",

  description: "",

  inputs: {
    requestId: {
      type: "string",
      required: true,
    },
    status: {
      type: "string",
      required: true,
      isIn: ["fulfilled", "denied"],
    },
  },

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 201,
    },
    unauthorizedRequest: {
      description: "There is a problem with input parameters",
      responseType: "unauthorizedRequest",
    },
    notFound: {
      description: "There is a problem with input parameters",
      statusCode: 404,
      responseType: "notFound",
    },
    badRequest: {
      description: "There is a problem with input parameters",
      responseType: "badRequest",
    },
    serverError: {
      description: "There is a problem with input parameters",
      responseType: "serverError",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const IsDev = sails.config.environment === "development";
      let request = await Request.findOne({
        id: inputs.requestId,
      }).populate("userAssociated");

      if (!request) {
        return exits.notFound({
          message: "cannot find withdrawal request",
        });
      }

      if (!request.userAssociated.id) {
        return exits.serverError({
          message: "cannot find withdrawal request owner",
        });
      }
      let wallet = await Wallet.findOne({
        owner: request.userAssociated.id,
      });

      if (!wallet) {
        exits.serverError({
          message: "Cannot find wallet for this profile.",
        });
      }
      request = await Request.updateOne(
        {
          id: inputs.requestId,
        },
        {
          status: inputs.status,
        }
      );
      if (request.status === "denied") {
        wallet = Wallet.updateOne(
          {
            id: wallet.id,
          },
          {
            income: wallet.income + request.amount,
          }
        );
      } else {
        let ereder = await ErederWallet.findOne({ identifier: "ErederWallet" });
        if (ereder.depositBalance < request.amount) {
          return exits.badRequest({
            message:
              "Insufficient Funds, need about " +
              (request.amount - ereder.depositBalance),
          });
        }

        let toCreate = {
          amount: request.amount,
          transactionType: "withdrawal",
          depositBalance: ereder.depositBalance - request.amount,
          associatedUser: request.userAssociated,
        };
        if (IsDev) {
          toCreate.id = "none";
        }
        let transaction = await Transaction.create(toCreate).fetch();
        ereder = await await ErederWallet.updateOne(
          { identifier: "ErederWallet" },
          {
            depositBalance: ereder.depositBalance - transaction.amount,
          }
        );
        let user = request.userAssociated;
        request.userAssociated = {
          bankName: user.bankName,
          bankAccountNumber: user.bankAccountNumber,
        };
      }
      return exits.success(request);
    } catch (error) {
      exits.serverError({
        message: error.message,
      });
    }
  },
};
