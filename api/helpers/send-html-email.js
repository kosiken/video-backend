require("dotenv").config();
const sgMail = require("@sendgrid/mail");

module.exports = {
  friendlyName: "Send html email",

  description: "",

  inputs: {
    data: {
      required: true,
      type: "ref",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    // TODO
    return;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    let res = await sgMail.send(inputs.data);
    console.log(res);
    // 9TpqQ4Z9:y.U6Mm
  },
};
