const client = require('remoteflags-nodejs-client');

const apiClient = new client.ApiClient();
const api = new client.PublicApi(apiClient);

export const getStatus = (params, done, err) => {
  const token = params.token;
  const ownerId = params.ownerId;
  const flagId = params.flagId;

  const opts = {
    'segment': params.segment === undefined ? "status" : params.segment,
    'key': params.key === undefined ? "" : params.key
  }

  apiClient.authentications['RemoteFlagsAuthorizer'].apiKey = token;

  api.getStatus(ownerId, flagId, opts)
    .then(
      (response) => { done(response) },
      (error) => {
        console.log(error);
        err(error.response.data);
      }
    );
};
