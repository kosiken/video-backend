module.exports = {
  friendlyName: 'Send template email',

  description: 'Send an email using a template.',

  inputs: {
    template: {
      description:
        'The relative path to an EJS template within our `views/emails/` folder -- WITHOUT the file extension.',
      example: 'email-reset-password',
      type: 'string',
      required: true,
    },

    templateData: {
      description:
        'A dictionary of data which will be accessible in the EJS template.',
      type: {},
      defaultsTo: {},
    },

    to: {
      description: 'The email address of the primary recipient.',
      extendedDescription:
        'If this is any address ending in "@example.com", then don\'t actually deliver the message. ' +
        'Instead, just log it to the console.',
      example: 'nola.thacker@example.com',
      required: true,
      isEmail: true,
    },

    toName: {
      description: 'Name of the primary recipient as displayed in their inbox.',
      example: 'Nola Thacker',
    },

    subject: {
      description: 'The subject of the email.',
      example: 'Hello there.',
      defaultsTo: '',
    },

    from: {
      description:
        'An override for the default "from" email that\'s been configured.',
      example: 'anne.martin@example.com',
      isEmail: true,
    },

    fromName: {
      description: 'An override for the default "from" name.',
      example: 'Anne Martin',
    },

    layout: {
      description:
        'Set to `false` to disable layouts altogether, or provide the path (relative ' +
        'from `views/layouts/`) to an override email layout.',
      defaultsTo: 'layout-email',
      custom: (layout) => layout === false || _.isString(layout),
    },

    ensureAck: {
      description:
        'Whether to wait for acknowledgement (to hear back) that the email was successfully sent (or at least queued for sending) before returning.',
      extendedDescription:
        'Otherwise by default, this returns immediately and delivers the request to deliver this email in the background.',
      type: 'boolean',
      defaultsTo: false,
    },

    bcc: {
      description:
        'The email addresses of recipients secretly copied on the email.',
      example: ['jahnna.n.malcolm@example.com'],
    },

    attachments: {
      description:
        'Attachments to include in the email, with the file content encoded as base64.',
      whereToGet: {
        description:
          'If you have `sails-hook-uploads` installed, you can use `sails.reservoir` to get an attachment into the expected format.',
      },
      example: [
        {
          contentBytes: 'iVBORw0KGgoAA…',
          name: 'sails.png',
          type: 'image/png',
        },
      ],
      defaultsTo: [],
    },
  },

  exits: {
    success: {
      outputFriendlyName: 'Email delivery report',
      outputDescription: 'A dictionary of information about what went down.',
      outputType: {
        loggedInsteadOfSending: 'boolean',
      },
    },
  },

  fn: async function ({
    template,
    templateData,
    to,
    toName,
    subject,
    from,
    fromName,
    layout,

    bcc,

  }) {
    var path = require('path');
    var url = require('url');
    var util = require('util');

    if (!_.startsWith(path.basename(template), 'email-')) {
      sails.log.warn(
        'The "template" that was passed in to `sendTemplateEmail()` does not begin with ' +
          '"email-" -- but by convention, all email template files in `views/emails/` should ' +
          'be namespaced in this way.  (This makes it easier to look up email templates by ' +
          'filename; e.g. when using CMD/CTRL+P in Sublime Text.)\n' +
          'Continuing regardless...'
      );
    }

    if (_.startsWith(template, 'views/') || _.startsWith(template, 'emails/')) {
      throw new Error(
        'The "template" that was passed in to `sendTemplateEmail()` was prefixed with\n' +
          '`emails/` or `views/` -- but that part is supposed to be omitted.  Instead, please\n' +
          'just specify the path to the desired email template relative from `views/emails/`.\n' +
          'For example:\n' +
          '  template: \'email-reset-password\'\n' +
          'Or:\n' +
          '  template: \'admin/email-contact-form\'\n' +
          ' [?] If you\'re unsure or need advice, see https://sailsjs.com/support'
      );
    } //•

    // Determine appropriate email layout and template to use.
    var emailTemplatePath = path.join('emails/', template);
    var emailTemplateLayout;
    if (layout) {
      emailTemplateLayout = path.relative(
        path.dirname(emailTemplatePath),
        path.resolve('layouts/', layout)
      );
    } else {
      emailTemplateLayout = false;
    }

    // Compile HTML template.
    // > Note that we set the layout, provide access to core `url` package (for
    // > building links and image srcs, etc.), and also provide access to core
    // > `util` package (for dumping debug data in internal emails).
    var htmlEmailContents = await sails
      .renderView(
        emailTemplatePath,
        _.extend({ layout: emailTemplateLayout, url, util }, templateData)
      )
      .intercept((err) => {
        err.message =
          'Could not compile view template.\n' +
          '(Usually, this means the provided data is invalid, or missing a piece.)\n' +
          'Details:\n' +
          err.message;
        return err;
      });

    var messageData = {
      html: htmlEmailContents,
      to: to,
      toName: toName,
      bcc: bcc,
      subject:  subject,
      from: from,
      fromName: fromName,

    };
    let deferred =  sails.helpers.sendHtmlEmail.with({data:messageData});
    deferred.exec((err)=>{
      if (err) {
        sails.log.error(
      'Background instruction failed:  Could not deliver email:\n'+
      util.inspect({template, templateData, to, toName, subject, from, fromName, layout, ensureAck, bcc, attachments},{depth:null})+'\n',
      'Error details:\n'+
      util.inspect(err)
        );
      } else {
        sails.log.info(
      'Background instruction complete:  Email sent via email delivery service (or at least queued):\n'+
      util.inspect({to, toName, subject, from, fromName, bcc},{depth:null})
        );
      }
    });
    var dontActuallySend = (
      sails.config.environment === 'test'
    );
    return {
      loggedInsteadOfSending: dontActuallySend,
      htmlEmailContents
    };
  },
};
