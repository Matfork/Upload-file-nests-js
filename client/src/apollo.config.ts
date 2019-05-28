import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache, ApolloLink } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';

const cache = new InMemoryCache();

const uploadLink = createUploadLink({
  uri: 'http://localhost:4001/api/graphql'
});

const httpLink = ApolloLink.from([
  createHttpLink({
    uri: `http://localhost:4001/api/graphql`,
    credentials: 'include' // It will always send all cookies for current domain to server
  })
]);

export const client = new ApolloClient({
  cache,
  // link: httpLink // replace with 'link' var, once ws is set up
  link: uploadLink // replace with 'link' var, once ws is set up
  //connectToDevTools: true
});
