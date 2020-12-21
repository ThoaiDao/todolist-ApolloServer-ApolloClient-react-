const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");

let todos = [
  {
    id: "1",
    text: "Hello from GraphQL 1",
    completed: true,
  },
  {
    id: "2",
    text: "Hello from GraphQL 1",
    completed: true,
  },
  {
    id: "3",
    text: "Hello from GraphQL 1",
    completed: true,
  },
];

const typeDefs = gql`
  type Todo {
    id: String
    text: String
    completed: Boolean
  }

  type Query {
    todos: [Todo]!
    filterToDos(id: String, text: String): [Todo]
    filterCompleted: [Todo]
    filterActive: [Todo]
  }

  type Mutation {
    createTodo(text: String!): Todo
    removeTodo(id: String!): [Todo]
    updateTodo(id: String!, text: String!): [Todo]
    checkDoneItem(id: String!): Todo
    checkDoneAll: [Todo]
  }
`;

const resolvers = {
  Query: {
    todos: () => {
      return todos;
    },

    filterToDos: (parent, args, context, info) => {
      var listFilter;
      if (
        (args.id && args.text === undefined) ||
        (args.id && args.text === "")
      ) {
        listFilter = todos.filter((x) => x.id === args.id);
      }
      if (
        (args.text && args.id === undefined) ||
        (args.text && args.id === "")
      ) {
        listFilter = todos.filter((x) => x.text === args.text);
      }
      if (args.id && args.text === undefined) {
        listFilter = todos.filter((x) => x.id === args.id);
      }

      return listFilter;
    },

    filterCompleted: () => {
      var listCompleted;
      listCompleted = todos.filter((x) => x.completed === true);
      return listCompleted;
    },

    filterActive: () => {
      var listActive;
      listActive = todos.filter((x) => x.completed === false);
      return listActive;
    },
  },

  Mutation: {
    createTodo: (parent, args, context, info) => {
      var id = Number(todos[todos.length - 1].id) + 1;
      args.id = id;
      let addItem = {
        id: id.toString(),
        text: args.text,
        completed: false,
      };

      todos.push(addItem);
      return addItem;
    },

    removeTodo: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id) {
          todos.splice(i, 1);
        }
      }
      console.log("remove:", todos);
      return todos;
    },

    updateTodo: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id && args.text) {
          todos[i].text = args.text;
        }
      }
      console.log(todos, args);
      return todos;
    },

    checkDoneItem: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id) {
          todos[i].completed = true;
        }
      }
    },

    checkDoneAll: () => {
      for (let i in todos) {
        todos[i].completed = true;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.use(cors());

app.listen({ port: 4000 }, () =>
  console.log("Now browse to http://localhost:4000" + server.graphqlPath)
);
