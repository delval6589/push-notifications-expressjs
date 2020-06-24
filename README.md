# Express.js on Netlify Example

[![Netlify Status](https://api.netlify.com/api/v1/badges/77441da4-f9bb-40bd-a5ae-937427991612/deploy-status)](https://app.netlify.com/sites/dreamy-heisenberg-7963a1/deploys)

An example of how to host an Express.js app on Netlify using
[serverless-http](https://github.com/dougmoscrop/serverless-http). See
[express/server.js](express/server.js) for details, or check it out at
https://dreamy-heisenberg-7963a1.netlify.app/!

[index.html](index.html) simply loads html from the Express.js app using
`<object>`, and the app is hosted at `/.netlify/functions/server`. Examples of
how to access the Express.js endpoints:

```sh
curl https://dreamy-heisenberg-7963a1.netlify.app/.netlify/functions/server
curl https://dreamy-heisenberg-7963a1.netlify.app/.netlify/functions/server/another
curl --header "Content-Type: application/json" --request POST --data '{"json":"POST"}' https://dreamy-heisenberg-7963a1.netlify.app/.netlify/functions/server
```
