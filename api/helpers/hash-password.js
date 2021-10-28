const bcrypt = require('bcryptjs')


function hashIt(password) {
  return new Promise((resolve, reject) => {
    let hash;
    try {
      hash = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, hash);
     return resolve(hash)
    }
    catch (err) {
      reject(err)
    }
  })
  
}


module.exports = {


  friendlyName: 'Hash password',


  description: '',


  inputs: {
password: {
  type: "string",
  example: "`INSERT ID`",
  description: "The password to hash",
  required: true,
}
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    // TODO

    return await hashIt(inputs.password)
  }


};

