/**
 * @description :: The conventional "custom" hook.  Extends this app with custom server-start-time and request-time logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineCustomHook(sails) {
  return {
    /**
     * Runs when a Sails app loads/lifts.
     */
    initialize: async function () {},

    routes: {
      /**
       * Runs before every matching route.
       *
       * @param {Ref} req
       * @param {Ref} res
       * @param {Function} next
       */
      before: {
        "/api/*": {
          skipAssets: true,
          fn: async function (req, res, next) {
            // No session? Proceed as usual.
            console.log(req.url)
            // (e.g. request for a static asset)
            if (!req.session) {
              return next();
            }

            // Not logged in? Proceed as usual.
            const IsDev = sails.config.custom.useToken;

            if ((!IsDev && !req.session.userId) || req.url === "/signup") {
              return next();
            }
            let id = 0;

            try {
              if(IsDev && !  (req.headers.authorization || req.headers.Authorization) // && !req.session.userId
              ) {
                return res.unauthorizedRequest({message: "No Session Found on req"})
              }
              if (
                IsDev &&
                (req.headers.authorization || req.headers.Authorization) //&& !req.session.userId
              ) {
                let auth =
                  req.headers.authorization || req.headers.Authorization;
                let [_, token] = auth.split(" ");
           
                if(!token) {return res.unauthorizedRequest({message: "No Session Found"})}
                let n = await sails.helpers.verifyToken.with({ token });
                id = (n.id);
              } else {
                id = req.session.userId;
              }
            } catch (err) {
              console.log(err);
            }
            // Otherwise, look up the logged-in user.
         
            if (id === 0) {
              sails.log.warn(
                "Somehow, the user record for the logged-in user (`" +
                  req.session.userId +
                  "`) has gone missing...."
              );
              delete req.session.userId;
              return res.unauthorizedRequest({message: "No user session found"});
            }

            var loggedInUser =await User.findOne({
              id,
            });

            // If the logged-in user has gone missing, log a warning,
            // wipe the user id from the requesting user agent's session,
            // and then send the "unauthorized" response.
            if (!loggedInUser) {
              sails.log.warn(
                "Somehow, the user record for the logged-in user (`" +
                  req.session.userId +
                  "`) has gone missing...."
              );
              delete req.session.userId;
              return res.unauthorizedRequest({message: 'No session found'});
            }

            // Add additional information for convenience when building top-level navigation.
            // (i.e. whether to display "Dashboard", "My Account", etc.)
            if (
              !loggedInUser.password ||
              loggedInUser.emailStatus === "unconfirmed"
            ) {
              loggedInUser.dontDisplayAccountLinkInNav = true;
            }

            // Expose the user record as an extra property on the request object (`req.me`).
            // > Note that we make sure `req.me` doesn't already exist first.
            if (req.me !== undefined) {
              throw new Error(
                "Cannot attach logged-in user as `req.me` because this property already exists!  (Is it being attached somewhere else?)"
              );
            }
            req.me = loggedInUser;
            // sails.log.info(loggedInUser)

            return next();
          },
        },

        "/admin/api/*": {
          skipAssets: true,
          fn: async function (req, res, next) {
            // No session? Proceed as usual.
            console.log(req.url)
            // (e.g. request for a static asset)
            if (!req.session) {
              return next();
            }

            // Not logged in? Proceed as usual.
            const IsDev = sails.config.custom.useToken;

            if ((!IsDev && !req.session.userId) || req.url === "/signup") {
              return next();
            }
            let id = 0;

            try {
              if(IsDev && !  (req.headers.authorization || req.headers.Authorization) // && !req.session.userId
              ) {
                return res.unauthorizedRequest({message: "No Session Found on req"})
              }
              if (
                IsDev &&
                (req.headers.authorization || req.headers.Authorization) //&& !req.session.userId
              ) {
                let auth =
                  req.headers.authorization || req.headers.Authorization;
                let [_, token] = auth.split(" ");
           
                if(!token) {return res.unauthorizedRequest({message: "No Session Found"})}
                let n = await sails.helpers.verifyToken.with({ token });
                id = (n.id);
              } else {
                id = req.session.userId;
              }
            } catch (err) {
              console.log(err);
            }
            // Otherwise, look up the logged-in user.
         
            if (id === 0) {
              sails.log.warn(
                "Somehow, the user record for the logged-in user (`" +
                  req.session.userId +
                  "`) has gone missing...."
              );
              delete req.session.userId;
              return res.unauthorizedRequest({message: "No user session found"});
            }

            var loggedInUser =await Admin.findOne({
              id,
            });

            // If the logged-in user has gone missing, log a warning,
            // wipe the user id from the requesting user agent's session,
            // and then send the "unauthorized" response.
            if (!loggedInUser) {
              sails.log.warn(
                "Somehow, the user record for the logged-in user (`" +
                  req.session.userId +
                  "`) has gone missing...."
              );
              delete req.session.userId;
              return res.unauthorizedRequest({message: 'No session found'});
            }

            // Add additional information for convenience when building top-level navigation.
            // (i.e. whether to display "Dashboard", "My Account", etc.)
            if (
              !loggedInUser.password ||
              loggedInUser.emailStatus === "unconfirmed"
            ) {
              loggedInUser.dontDisplayAccountLinkInNav = true;
            }

            // Expose the user record as an extra property on the request object (`req.me`).
            // > Note that we make sure `req.me` doesn't already exist first.
            if (req.me !== undefined) {
              throw new Error(
                "Cannot attach logged-in user as `req.me` because this property already exists!  (Is it being attached somewhere else?)"
              );
            }
            req.me = loggedInUser;
            // sails.log.info(loggedInUser)

            return next();
          },
        },
      },
    },
  };
};
