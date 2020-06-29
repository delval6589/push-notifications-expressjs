const isObject = (input) => Object(input) === input;

const isValidSubscription = (subscription) => {
  const isInvalid =
    !subscription ||
    typeof subscription.customerId !== "string" ||
    subscription.customerId.length !== 16 ||
    !isObject(subscription.details) ||
    typeof subscription.details.endpoint !== "string" ||
    !isObject(subscription.details.keys) ||
    typeof subscription.details.keys.auth !== "string" ||
    typeof subscription.details.keys.p256dh !== "string";

  return !isInvalid;
};

module.exports = isValidSubscription;
