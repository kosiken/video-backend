module.exports = function forbidden(info) {
    let req = this.req;
    let res = this.res;
    let sails = req._sails;
  
    const IsDev = sails.config.environment === "development";

    const Ret= {
        problems: [
            info,
            (IsDev? "Try using the proper admin secret": "contact the main admin for access")
        ]
    }
    return res.status(403).json(Ret);

}