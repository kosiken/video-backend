/**
 * User.js
 *
 * A user who can log in to this application.
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    emailAddress: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: "mary.sue@example.com",
    },
    country: {
      type: "string",
      required: true,
    },
    dob: {
      type: "string",
      required: true,
    },
    emailStatus: {
      type: "string",
      isIn: ["unconfirmed", "change-requested", "confirmed"],
      defaultsTo: "unconfirmed",
      description: "The confirmation status of the user's email address.",
      extendedDescription: `Users might be created as "unconfirmed" (e.g. normal signup) or as "confirmed" (e.g. hard-coded
admin users).  When the email verification feature is enabled, new users created via the
signup form have \`emailStatus: 'unconfirmed'\` until they click the link in the confirmation email.
Similarly, when an existing user changes their email address, they switch to the "change-requested"
email status until they click the link in the confirmation email.`,
    },

    emailChangeCandidate: {
      type: "string",
      isEmail: true,
      description:
        "A still-unconfirmed email address that this user wants to change to (if relevant).",
    },

    password: {
      type: "string",
      required: true,
      description:
        "Securely hashed representation of the user's login password.",
      protect: true,
      example: "2$28a8eabna301089103-13948134nad",
    },

    fullName: {
      type: "string",
      required: true,
      description: "Full representation of the user's name.",
      maxLength: 120,
      example: "Mary Sue van der McHenst",
    },
    isCreator: {
      type: "boolean",
      defaultsTo: false,
    },
    isSuperAdmin: {
      type: "boolean",
      description:
        'Whether this user is a "super admin" with extra permissions, etc.',
    },

    passwordResetToken: {
      type: "string",
      description:
        "A unique token used to verify the user's identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.",
    },

    passwordResetTokenExpiresAt: {
      type: "number",
      description:
        "A JS timestamp (epoch ms) representing the moment when this user's `passwordResetToken` will expire (or 0 if the user currently has no such token).",
      example: 1502844074211,
    },
    profilePic: { type: "string" },
    emailProofToken: {
      type: "string",
      description:
        "A pseudorandom, probabilistically-unique token for use in our account verification emails.",
    },

    emailProofTokenExpiresAt: {
      type: "number",
      description:
        "A JS timestamp (epoch ms) representing the moment when this user's `emailProofToken` will expire (or 0 if the user currently has no such token).",
      example: 1502844074211,
    },

    hasBillingCard: {
      type: "boolean",
      description:
        "Whether this user has a default billing card hooked up as their payment method.",
      extendedDescription: `More specifically, this indcates whether this user record's linked customer entry in Stripe has
a default payment source (i.e. credit card).  Note that a user have a \`stripeCustomerId\`
without necessarily having a billing card.`,
      defaultsTo: false,
    },

    billingCardBrand: {
      type: "string",
      example: "Visa",
      description:
        "The brand of this user's default billing card (or empty string if no billing card is set up).",
      extendedDescription:
        "To ensure PCI compliance, this data comes from Stripe, where it reflects the user's default payment source.",
    },

    billingCardLast4: {
      type: "string",
      example: "4242",
      description:
        "The last four digits of the card number for this user's default billing card (or empty string if no billing card is set up).",
      extendedDescription:
        "To ensure PCI compliance, this data comes from Stripe, where it reflects the user's default payment source.",
    },

    billingCardExpMonth: {
      type: "string",
      example: "08",
      description:
        "The two-digit expiration month from this user's default billing card, formatted as MM (or empty string if no billing card is set up).",
      extendedDescription:
        "To ensure PCI compliance, this data comes from Stripe, where it reflects the user's default payment source.",
    },

    billingCardExpYear: {
      type: "string",
      example: "2023",
      description:
        "The four-digit expiration year from this user's default billing card, formatted as YYYY (or empty string if no credit card is set up).",
      extendedDescription:
        "To ensure PCI compliance, this data comes from Stripe, where it reflects the user's default payment source.",
    },
    bankName: {
      type: "string",
    
    },
    bankAccountName: {
      type: "string",

    },
    bankAccountNumber: {
      type: "string",

    },
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // n/a
  },
};
