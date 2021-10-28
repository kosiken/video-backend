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
  'GET /':             { action: 'dashboard/view-welcome' },
  'POST /signup': {action: 'user/signup'},
  'POST /login': {action: 'user/login'},
  'GET /email/confirm': {action: 'user/verify-email'},
  'GET /show-video/:videoId': {action: 'show-video'},
  'GET /api/me': {action: 'user/me'},
  'POST /api/user/update': {action: 'user/update-details'},
  'GET /api/creator/become': {action: 'creator/become'},
  'GET /api/creator/channel': {action: 'creator/get-channel'},
  'GET /api/creator/bank-details': {action: 'creator/get-account-details'},
  'POST /api/creator/channel': {action: 'creator/update-channel'},
  'POST /api/creator/bank-details': {action: 'creator/add-account-details'},



  //user
    
  'GET /api/user/history': {action: 'user/history'},
  'GET /api/user/paid-videos': {action: 'user/paid-videos'},
  'GET /api/user/following': {action: 'user/subcribed-channels'},

  
  'POST /api/creator/video': {action: 'creator/upload-video'},
  'POST /api/user/like': {action: 'user/like-video'},
  'POST /api/user/un-like': {action: 'user/un-like-video'},
  'POST /api/user/view': {action: 'user/view-video'},
  'POST /api/user/purchase': {action: 'user/purchase-video'},
  'POST /api/user/card': {action: 'user/add-card'},
  'POST /api/user/subscribe': {action: 'user/subscribe-to-channel'},
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
