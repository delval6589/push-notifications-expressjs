const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  // push-notifications DB secret
  secret: process.env.FAUNADB_SECRET,
});

const getSubscriptionRef = (customerId, deviceId) =>
  client
    .query(
      q.Paginate(
        q.Match(q.Index("subscriptions_customerId_deviceId"), [
          customerId,
          deviceId,
        ])
      )
    )
    .then((result) => (result.data.length ? result.data[0] : null));

module.exports.readSubscription = async (customerId, deviceId) => {
  const subscriptionRef = await getSubscriptionRef(customerId, deviceId);

  if (!subscriptionRef) {
    return null;
  }

  const result = await client.query(q.Get(subscriptionRef));
  return result.data || null;
};

module.exports.addSubscription = (subscription) =>
  client.query(
    q.Create(q.Ref("classes/subscriptions"), { data: subscription })
  );

module.exports.removeSubscription = async (customerId, deviceId) => {
  const subscriptionRef = await getSubscriptionRef(customerId, deviceId);

  if (!subscriptionRef) {
    return;
  }

  await client.query(q.Delete(subscriptionRef));
};
