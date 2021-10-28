module.exports = {
  friendlyName: "Add account details",

  description: "",

  inputs: {
    bankName: {
      type: "string",
      required: true,
    },
    bankAccountName: {
      type: "string",
      required: true,
    },
    bankAccountNumber: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },

  exits: {
    badRequest: {
      description: "There is a problem with input parameters",
      responseType: "badRequest",
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
      if (!this.req.me) {
        return exits.unauthorizedRequest({ message: "No Session found" });
      }
      if(!this.req.me.isCreator) {
        return exits.badRequest({
          message: "You are not a creator",
        });
      }
let user = await User.findOne({id: this.req.me.id})
      let valid = await sails.helpers.validatePassword(
        inputs.password,
        user.password
      );
      if (!valid) {
        return exits.badRequest({
          message: "The password is not valid",
        });
      }
      delete inputs.password;
  user = await User.updateOne(
        {
          id: this.req.me.id,
        },
        inputs
      );
      inputs.bankAccountNumber = inputs.bankAccountNumber.slice(0,4) + '******' 
      return exits.success(inputs)
    } catch (err) {
      return exits.serverError({ message: err.message });
    }
  },
};
