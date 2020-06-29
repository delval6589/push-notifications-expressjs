"use strict";

const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const cors = require("cors");

const {
  readSubscription,
  addSubscription,
  removeSubscription,
  getAllUserSubscriptions,
} = require("../faunadb/subscriptions");
const isValidSubscription = require("../scripts/validate.subscription");
const sendNotification = require("../scripts/send.notification");

const app = express();
const router = express.Router();

router.get("/api/get-subscription", async (req, res) => {
  try {
    const subscription = await readSubscription(req.query.endpoint);
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/create-subscription", async (req, res) => {
  try {
    if (!isValidSubscription(req.body)) {
      res.status(400).json({ error: "Invalid subscription." });
      return;
    }

    await addSubscription(req.body);
    res.status(201).json({});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/api/remove-subscription", async (req, res) => {
  try {
    await removeSubscription(req.query.endpoint);
    res.status(204).json({});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/send-push-msg", async (req, res) => {
  try {
    const customerId = req.body.customerId;
    const subscriptions = await getAllUserSubscriptions(customerId);

    if (!subscriptions.length) {
      res.status(400).json({ error: "No subscriptions active for the user." });
      return;
    }

    await Promise.all(
      subscriptions.map((subscription) =>
        sendNotification(
          subscription.details,
          JSON.stringify(req.body.notification)
        ).catch((error) => {
          if (error.statusCode === 404 || error.statusCode === 410) {
            // Subscription has expired or is no longer valid
            return removeSubscription(subscription.details.endpoint);
          } else {
            throw error;
          }
        })
      )
    );
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use("/.netlify/functions/server", router);

module.exports = app;
module.exports.handler = serverless(app);
