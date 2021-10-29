module.exports = {


  friendlyName: 'Model',


  description: 'Model admin.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    const Models = {
    
      video: Video,
      channel: Channel,
     
      user: user,
      
      request: Request,

    }

    const query = this.req.query;
    if (query && query.page) {
      page = query.page;
    }

    const _model = Models[this.req.params.modelName];
    // console.log(_model);

    const objects = await _model.find();

    let ret = {
      modelName: this.req.params.modelName.toUpperCase(),
      identifiers: await sails.helpers.getIdentifiers.with({
        model: this.req.params.modelName,
      }),
      objects,
      title: "Admin - " + this.req.params.modelName,
    };

    // All done.
    return ret;

  }


};
