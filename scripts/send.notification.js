const webpush = require("web-push");
const VAPID_KEYS = {
  PUBLIC:
    "BAVWlS5n0ArkhikXKjiLXtTUpIcPZiFWRcFOSB7bgl51TmWc2E7nIPqHGsEAQuK2epkZLwF5YNeiT-3R99KqWnM",
  PRIVATE: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  "mailto:web-push@foobarbaz.com",
  VAPID_KEYS.PUBLIC,
  VAPID_KEYS.PRIVATE
);

module.exports = webpush.sendNotification.bind(webpush);
