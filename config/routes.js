/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  "GET /": { action: "dashboard/view-welcome" },
  "GET /main": { action: "dashboard/view-welcome" },
  "GET /main/*": { action: "dashboard/view-welcome" },
  "GET /creator/*": { action: "dashboard/view-welcome" },
  "GET /login": { action: "dashboard/view-welcome" },
  "GET /signup": { action: "dashboard/view-welcome" },
  "GET /all-channels": { action: 'get-channels' },
  "GET /all-channels/:id": { action: 'get-channel-single' },
  "GET /all-channels-videos/:channelId": { action: 'get-channel-videos' },
  "GET /api/video/:videoId": { action: "get-video" },
  "GET /api/user/check-access/:videoId": { action: "user/check-for-access" },
  "GET /api/user/restricted/:accessCode": { action: "user/get-video" },
  "GET /faqs": { action: "all-faqs" },
  "POST /api/creator/upload": { action: "creator/video-init" },
  "POST /api/creator/thumbnail/:videoId": {
    action: "creator/update-thumbnail",
  },
  "GET /videos": { action: "all-videos" },
  "GET /privacy-policy": { action: "get-privacy-policy" },
  "GET /terms-conditions": { action: "get-terms-conditions" },
  "GET /admin/api/me": { action: "admin/me" },
  "POST /reset-password": { action: "request-reset-password" },
  "GET /reset-password": { action: "verify-reset-password-token" },
  "POST /update-password": { action: "reset-password" },
  "POST /signup": { action: "user/signup" },
  "POST /login": { action: "user/login" },
  "GET /email/confirm": { action: "user/verify-email" },
  "GET /show-video/:videoId": { action: "show-video" },
  "GET /api/me": { action: "user/me" },
  "POST /api/user/update": { action: "user/update-details" },
  "GET /api/creator/become": { action: "creator/become" },
  "GET /api/creator/wallet": { action: "creator/get-wallet" },
  "GET /api/creator/analytics/:modelName": { action: "creator/analytics" },
  "POST /api/creator/delete/:modelName": { action: "creator/delete" },
  "GET /api/creator/channel": { action: "creator/get-channel" },
  "GET /api/creator/requests": { action: "creator/get-requests" },

  "GET /api/creator/bank-details": { action: "creator/get-account-details" },
  "POST /api/creator/channel": { action: "creator/update-channel" },
  "POST /api/creator/bank-details": { action: "creator/add-account-details" },
  "POST /api/creator/requests": { action: "creator/request-withdrawal" },

  //user
  "GET /logout": { action: "user/logout" },
  "GET /api/user/history": { action: "user/history" },
  "GET /api/user/paid-videos": { action: "user/paid-videos" },
  "GET /api/user/following": { action: "user/subcribed-channels" },
  "GET /api/user/comment/:videoId": { action: "user/get-comments" },
  "POST /api/user/comment/:videoId": { action: "user/add-comment" },
  "POST /api/creator/channel/upload-logo": { action: "creator/upload-logo" },
  "POST /api/creator/channel/upload-banner": {
    action: "creator/upload-banner",
  },
  "POST /api/user/upload-profile-pic": { action: 'user/upload-profile-pic' },
  "POST /api/user/message/:ticketId": { action: "user/message-admin" },
  "POST /api/user/ticket": { action: "user/add-ticket" },

  "POST /api/creator/video/:uploadId": { action: "creator/upload-video" },
  "POST /api/user/like": { action: "user/like-video" },
  "POST /api/user/un-like": { action: "user/un-like-video" },
  "GET /api/user/view/:videoId": { action: "user/view-video" },
  "GET /api/user/view-restricted/:accessCode": {
    action: "user/view-restricted-video",
  },
  "GET /api/user/purchase/:videoId": { action: "user/purchase-video" },
  "POST /api/user/card": { action: "user/add-card" },
  "GET /api/user/subscribe/:channelId": { action: "user/subscribe-to-channel" },

  // Admin

  "GET /admin": {
    view: "pages/admin/homepage",
    locals: {
      layout: "layouts/layout-admin",
      title: "Ereder",
    },
  },
  "GET /admin/api/dashboard": {
    view: "pages/admin/dashboard",
    locals: {
      layout: "layouts/layout-admin",
      title: "Ereder",
    },
  },
  "GET /admin/signup": {
    view: "pages/admin/signup",
    locals: {
      layout: "layouts/layout-admin",
      title: "Ereder",
    },
  },
  "GET /admin/login": {
    view: "pages/admin/login",
    locals: {
      layout: "layouts/layout-admin",
      title: "Ereder",
    },
  },

  "POST /admin/html/signup": { action: "admin/html/signup" },
  "POST /admin/html/login": { action: "admin/html/login" },
  "POST /admin/api/privacy-policy": { action: "admin/update-privacy-policy" },

  "POST /admin/api/messages/:ticketId": { action: "admin/message-user" },

  "POST /admin/api/terms-conditions": {
    action: "admin/update-terms-conditions",
  },

  "GET /admin/html/api/:modelName": { action: "admin/html/model" },
  "GET /admin/html/api/:modelName/:id": { action: "admin/html/view" },
  "GET /admin/html/api/edit/:modelName/:id": { action: "admin/html/edit" },
  "GET /admin/html/api/delete/:modelName/:id": { action: "admin/html/delete" },
  "GET /admin/html/api.create/:modelName": { action: "admin/html/create" },

  "POST /admin/signup": { action: "admin/signup" },
  "POST /admin/login": { action: "admin/login" },
  "POST /admin/api/handle-withdrawal-request/:requestId": {
    action: "admin/handle-withdrawal-request",
  },

  "GET /admin/api/messages/:ticketId": { action: "admin/get-messages" },
  "GET /admin/api/:modelName": { action: "admin/model" },
  "GET /admin/api/:modelName/:id": { action: "admin/view" },
  "GET /admin/api/edit/:modelName/:id": { action: "admin/edit" },
  "GET /admin/api/delete/:modelName/:id": { action: "admin/delete" },
  "GET /admin/api/create/:modelName": { action: "admin/create" },
  "POST /admin/api/faq": { action: "admin/create-faq" },
  "PUT /admin/api/faq/:faqId": { action: "admin/update-faq" },
  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝
  // …

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the Paras
};
