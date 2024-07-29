export default () => ({
  hrisApiGraphQLEndpoint:
    process.env.HRIS_API_GRAPHQL_ENDPOINT || 'http://localhost:5257/graphql',
});
