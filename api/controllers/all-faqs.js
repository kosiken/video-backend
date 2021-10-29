module.exports = {


  friendlyName: 'All faqs',


  description: '',


  inputs: {

  },


  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 200,
    },
  },


  fn: async function (inputs, exits) {

    let faqs = await Faq.find()
    // All done.
    return exits.success(faqs);

  }


};
