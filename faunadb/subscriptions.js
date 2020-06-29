const faunadb = require("faunadb");

const q = faunadb.query;
const client = new faunadb.Client({
  // push-notifications DB secret
  secret: process.env.FAUNADB_SECRET,
});

const getSubscriptionRefByEndpoint = (endpoint) =>
  client
    .query(q.Paginate(q.Match(q.Index("subscriptions_endpoint"), [endpoint])))
    .then((result) => (result.data.length ? result.data[0] : null));

module.exports.readSubscription = async (endpoint) => {
  const subscriptionRef = await getSubscriptionRefByEndpoint(endpoint);

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

module.exports.removeSubscription = async (endpoint) => {
  const subscriptionRef = await getSubscriptionRefByEndpoint(endpoint);

  if (!subscriptionRef) {
    return;
  }

  await client.query(q.Delete(subscriptionRef));
};

module.exports.getAllUserSubscriptions = (customerId) =>
  client
    .query(
      q.Map(
        q.Paginate(q.Match(q.Index("subscriptions_customerId"), customerId)),
        q.Lambda("subscription", q.Get(q.Var("subscription")))
      )
    )
    .then(({ data: results }) =>
      results.length ? results.map((result) => result.data) : []
    );
