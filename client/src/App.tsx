import React from 'react';
import Routes from './Router';
import { ApolloProvider } from 'react-apollo';
import { client } from './apollo.config';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  );
}

export default App;
