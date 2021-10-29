/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {
  try {
    let faqs = [
      {
        title: "What is Ereder",
        body: `Ereder is a video sharing platform where you can watch and purchase videos from creators`,
      },
      {
        title: "Who can become a creator",
        body: `Anyone can become a creator`,
      },
    ];
    let password = await sails.helpers.hashPassword.with({
      password: "0000",
    });
    let adminCreate = {
      fullName: "Allison Kosy",
      emailAddress: "allisonkosy@gmail.com",
      password,
    };

    const IsDev = sails.config.environment === "development";
    if (IsDev) {
      adminCreate.id = "none";
      faqs = faqs.map((f) => {
        return {
          ...f,
          id: "none",
        };
      });

      await Admin.create(adminCreate);
      adminCreate = {
        ...adminCreate,
        dob: "1998-11-22",
        country: "nigeria",
      };

      await User.create(adminCreate);
    }

    let f = await Faq.find();
    if (f.length === 0) {
      sails.log.info("Creating faqs");
      faqs = faqs.map((faq) => Faq.create(faq).fetch());
      faqs = await Promise.all(faqs);
      f = faqs;
    }
    console.log(f);
  } catch (error) {
    sails.log.error(error);
  }
};
