<script setup>
import { provide } from 'vue';
import { DefaultApolloClient, useQuery } from '@vue/apollo-composable'
import gfnApolloClient from '../services/gfn-apollo.js';
import gql from 'graphql-tag'
import GQL_GAMES from '../graphql/games.gql';
import { VPC_ID } from '../constants/vpcId';
import { SupportedLang } from '../constants/supportedLang';

console.log("Hello from the popup!");

provide(DefaultApolloClient, gfnApolloClient)

const { result, variables, loading, error} = useQuery(gql`${GQL_GAMES}`, {
  vpcId: VPC_ID['NP-STH-01'],
  lang: SupportedLang.en_US
})
</script>

<template>
  <div>
    <img src="../../public/icon-with-shadow.svg" />
    <h1>vite-plugin-web-extension</h1>
    <p>
      Template: <code>asd</code>
    </p>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <ul v-else-if="result && result.data">
    <li v-for="app of result.data.apps.items" :key="app.id">
      {{ app.title }}
    </li>
  </ul>
  </div>
</template>

<style>
html,
body {
  width: 300px;
  height: 400px;
  padding: 0;
  margin: 0;
}

body {
  background-color: rgb(36, 36, 36);
}

body > div {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

img {
  width: 200px;
  height: 200px;
}

h1 {
  font-size: 18px;
  color: white;
  font-weight: bold;
  margin: 0;
}

p {
  color: white;
  opacity: 0.7;
  margin: 0;
}

code {
  font-size: 12px;
  padding: 2px 4px;
  background-color: #ffffff24;
  border-radius: 2px;
}
</style>
