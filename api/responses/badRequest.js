// todo

module.exports = function badRequest(info) {
  let req = this.req;
  let res = this.res;
  let sails = req._sails;

  const IsDev = sails.config.environment === "development";
  const Ret = {
    problems: info.message,
    message: IsDev
      ? "Couldnt complete the request for /" +
        req.method +
        " " +
        req.url +
        " there is an issue with your parameters"
      : "Couldnt complete the request at this time please check the information you supplied or contact support",
      code: info.code || 2000
  };
  sails.log.verbose("400 => " + req.url);
  return res.status(400).json(Ret);
};
