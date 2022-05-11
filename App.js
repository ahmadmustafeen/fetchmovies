const express = require("express");
const mongoose = require("mongoose");
const ApolloServer = require("apollo-server").ApolloServer;
const bodyParser = require("body-parser");
const { gql } = require("apollo-server-express");
const cors = require("cors");

const {Users} = require("./models/userSchema");



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
type Mutation {
    CreateUser(firstName: String, lastName: String, age: Int, cnic: String, address: String, phone: String, email: String, password: String): User
}

`
const resolvers = {
    Query: {
        FetchUsers: async () => {
            const users = await Users.find();
            return users;
        }
    },
    Mutation: {
        CreateUser: async (parent, quote) => {
            const user = Users()
            user.firstName = quote.firstName
            user.lastName = quote.lastName
            user.age = quote.age
            user.cnic = quote.cnic
            user.address = quote.address
            user.phone = quote.phone
            user.email = quote.email
            user.password = quote.password
            await user.save()
            return quote
        }
    }
}


//  PERSONAL NOTE:
//do not touch this, as this is being hanled by resolvers and typeDefs
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
