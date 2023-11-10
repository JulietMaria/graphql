const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema,GraphQLScalarType, Kind  } = require('graphql');
const fs = require('fs');
const path = require('path');

// Define the custom Date scalar type
const DateType = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom Date scalar type',
  parseValue(value) {
    // Convert the input value (e.g., from a JSON variable) to a Date object
    return new Date(value);
  },
  serialize(value) {
    // Convert the Date object to a string for output
    return value.toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      // Parse the date string to a Date object
      return new Date(ast.value);
    }
    return null;
  },
});

const schema = buildSchema(fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'));
schema._typeMap.Date = DateType;

// Define the resolver for the 'task' query
const root = {
  task: () => {
    return {
      title: 'Complete the project',
      dueDate: new Date('2023-11-30T08:00:00.000Z'), // Example due date
    };
  },
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable the GraphiQL interface for testing in the browser
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`GraphQL server is running on http://localhost:${PORT}/graphql`);
});
