// todo

module.exports = function badRequest(info) {
    let req = this.req;
    let res = this.res;
    let sails = req._sails;
    const IsDev = sails.config.environment === "development";


    sails.log.verbose("500 => " + req.url);

    console.log(info)
// TODO  Do proper logging console.log(info)
return  res.status(500).json({
    message: IsDev ?"Couldnt complete the request for /" +
    req.method + ' ' + req.url +  "An error occured " + info.message :
    "We are encountering technical issues with our servers please try again another time"
})
}
