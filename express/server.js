"use strict";

const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const {
  readSubscription,
  addSubscription,
  removeSubscription,
} = require("../faunadb/subscriptions");

const app = express();

app.use(bodyParser.json());

app.get("/api/subscription/:customerId/:deviceId", async (req, res) => {
  try {
    const subscription = await readSubscription(
      req.params.customerId,
      req.params.deviceId
    );
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/subscription", async (req, res) => {
  try {
    await addSubscription(req.body);
    res.status(201).json({});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/subscription/:customerId/:deviceId", async (req, res) => {
  try {
    await removeSubscription(req.params.customerId, req.params.deviceId);
    res.status(204).json({});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
