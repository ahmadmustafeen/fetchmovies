const express = require("express");
const mongoose = require("mongoose");
const ApolloServer = require("apollo-server").ApolloServer;
const bodyParser = require("body-parser");
const cors = require("cors");
const {Users} = require("./models/userSchema");
const { gql } = require("apollo-server-express");
const url =
  "mongodb+srv://ahmad:ahmadahmad@cluster0.bfizc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connect = mongoose.connect(url, { useNewUrlParser: true });
connect.then(
  (db) => {
    console.log("Connected correctly to server!");
  },
  (err) => {
    console.log(err);
  }
);
const app = express();
app.use(bodyParser.json());
app.use("*", cors());

const typeDefs = gql`
type User {
    firstName: String
    lastName: String
    age: Int
    cnic: String
    address: String
    phone: String
    email: String
    password: String
    createdAt: String
    updatedAt: String
}
type FetchUsers {
    users: [User]
}
type Query {
    FetchUsers(title: String): [User]
  }

`
const resolvers = {
    Query: {
        FetchUsers: async () => {
            const users = await Users.find();
            return users;
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  server
    .listen({ port: process.env.PORT || 8080 })
    .then(({ url }) => console.log(`GraphQL server running at ${url}`));
  



//now adding graphql to the app


app.listen({ port: 4000 }, () =>
  console.log("Now browse to http://localhost:4000/graphql")
);
