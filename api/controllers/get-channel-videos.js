module.exports = {
  friendlyName: "All videos",

  description: "",

  inputs: {},

  exits: {
    success: {
      description: "The requesting user agent has been successfully registered",
      statusCode: 200,
    },  serverError: {
      description: "There is a problem on the server",
      responseType: "serverError",
      statusCode: 500,
    },
  },

  fn: async function (inputs, exits) {
    try {
      let channelId =this.req.params.channelId
      let videos = await Video.find({channel: channelId}).populate("channel");


      return exits.success(videos.map(v=> {
        return {...v, url: ""}
      }));
    } catch (error) {
      exits.serverError({message: error.message})
    }
 
  },
};
