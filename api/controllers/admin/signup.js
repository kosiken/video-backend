module.exports = {
  friendlyName: "Signup",

  description: "Signup admin.",

  inputs: {
    emailAddress: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: "mary.sue@example.com",
    },
    password: {
      type: "string",
      required: true,
      description:
        "Securely hashed representation of the user's login password.",
      protect: true,
      example: "2$28a8eabna301089103-13948134nad",
    },

    fullName: {
      type: "string",
      required: true,
      description: "Full representation of the user's name.",
      maxLength: 120,
      example: "Mary Sue van der McHenst",
    },

    adminKey: {
      type: "string",
      required: true,
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
    const theKey = process.env.EREDER_ADMIN_KEY || "lion";
    if (inputs.adminKey !== theKey) {
      return exits.badRequest({
        message: "admin key is incorrect",
      });
    }

    try {
      delete inputs.adminKey;
      const IsDev = sails.config.environment === "development";
      if (IsDev) {
        inputs.id = "none";
      }
      inputs.password = await sails.helpers.hashPassword.with({
        password: inputs.password,
      });

      let admin = await Admin.create(inputs).fetch();
      if (admin) {
        sails.log.info("Setting cookie");
        this.req.session.userId = admin.id;
        let [token] = await sails.helpers.createWebToken.with({
          id: admin.id,
          createRefresh: true,
        });
        admin.token = token
        return exits.success(admin);
      }
      return exits.serverError({
        message: "Failed to create admin",
      });
    } catch (err) {
      console.log(err.name, err)
      if (err.code=== "E_UNIQUE") {
        return exits.badRequest({
          message: "User with email " + inputs.emailAddress + " exists already",
        });
      } else {
        return exits.serverError({
          message: "Failed to create admin" + err.message,
        });
      }
    }
  },
};
