module.exports = function notFound(info) {
    let req = this.req;
    let res = this.res;
    let sails = req._sails;
    const IsDev = sails.config.environment === "development";

    sails.log.verbose("404 => " + req.url);
return  res.status(404).json({
    message: IsDev
      ? "Couldnt complete the request for /" +
        req.method +
        " " +
        req.url +
        " there is an issue with your parameters"
      : "Couldnt complete the request at this time please check the information you supplied or contact support",

      problems: info.message
  
})
}
