module.exports = {
  friendlyName: "Request withdrawal",

  description: "",

  inputs: {
    amount: {
      type: "number",
      min: 100,
      required: true,
    
    },
  },
  exits: {
    badRequest: {
      description: "There is a problem with input parameters",
      responseType: "badRequest",
      code: 400
    },
    unauthorizedRequest: {
      description: "There is a problem with input parameters",
      responseType: "unauthorizedRequest",
    },
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 201,
    },
    serverError: {
      description: "There is a problem with input parameters",
      responseType: "serverError",
    },
  },

  fn: async function (inputs, exits) {
    try {
      if (!this.req.me.id) {
        return exits.unauthorizedRequest({ message: "No session found" });
      }
      if(inputs.amount > 1000000) {
        return exits.badRequest({
          message: `${inputs.amount} is above the one time withdrawal limit`
        })
      }
      let wallet = await Wallet.findOne({
        owner: this.req.me.id,
      });
      if (!wallet) {
        return exits.serverError({
          message: "Cannot find wallet for this profile.",
        });
      }
      

      if(wallet.income < inputs.amount) {
        return exits.badRequest({
          message: "Cannot request amount above your balance",
        });
      }
      const IsDev = sails.config.environment === "development";
      const toCreate = {
        amount:inputs.amount,
        userAssociated: wallet.owner,
      }
      if(IsDev) {
        toCreate.id = 'none';
      }

      const request  = await Request.create(toCreate).fetch();

      wallet = await Wallet.updateOne({
        id: wallet.id
      }, {        income:  wallet.income - request.amount
      });

      request.wallet =  wallet;



      return exits.success(request)
      
    } catch (error) {
      throw error;
      exits.serverError({
        message: error.message
      })
    }
  },
};
