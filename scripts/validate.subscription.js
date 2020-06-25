const isObject = (input) => Object(input) === input;

const isValidSubscription = (subscription) => {
  debugger;
  const isInvalid =
    !subscription ||
    typeof subscription.customerId !== "string" ||
    subscription.customerId.length !== 16 ||
    typeof subscription.deviceId !== "string" ||
    subscription.deviceId.length !== 2 ||
    !isObject(subscription.details) ||
    typeof subscription.details.endpoint !== "string" ||
    !isObject(subscription.details.keys) ||
    typeof subscription.details.keys.auth !== "string" ||
    typeof subscription.details.keys.p256dh !== "string";

  return !isInvalid;
};

module.exports = isValidSubscription;
