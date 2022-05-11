const { ApolloServer, gql } = require("apollo-server");
const {movies} = require("./constants/movies");
// typeDefs tell the GraphQL server what data to expect
// Notice the gql tag, this converts your string into GraphQL strings that can be read by Apollo
const typeDefs = gql`
  type User {
    firstName: String!
    lastName: String!
    age: Int!
  }
  type PosterArt {
    url: String!
    width: Int
    height: Int
  }
  type Image {
    PosterArt: PosterArt
  }
  type Movies {
    title: String!
    description: String!
    programType: String!
    images: Image!
    releaseYear: Int
  }
  type Query {
    hello: String!
    randomNumber: Int!
    queryMovies(title: String): [Movies]
  }
  type Mutation {
    createUser(firstName: String!, lastName: String!, age: Int!): User
    editUser(firstName: String!, lastName: String!, age: Int!): User
    deleteUser(firstName: String!): User
  }
`;


let user = [];
const createUser = (user_data) => {
  user.push(user_data);
  return user;
};
const resolvers = {
  Query: {
    queryMovies(parent, args, context, info) {
      if (args.title) {
        return movies.filter((movie) => movie.title === args.title);
      }
      return movies;
    },
  },
  Mutation: {
    createUser: async (parent, quote) => {
      createUser(quote);
      return quote;
    },
    editUser: async (parent, { id, ...quote }) => {
      if (!user.find((user) => user.firstName === quote.firstName)) {
        throw new Error("User doesn't exist");
      }
      let currentIndex = user.findIndex(
        (user) => user.firstName === quote.firstName
      );
      user[currentIndex] = {
        ...user[currentIndex],
        ...quote,
      };
      return user[currentIndex];
    },
    deleteUser: async (parent, quote) => {
      let currentIndex =
        user.length > 0
          ? user.findIndex((user) => user.firstName === quote.firstName)
          : -1;
      console.log(currentIndex, "this is the current nde");
      const ok = Boolean(currentIndex);
      if (currentIndex !== -1) {
        delete user[currentIndex];
        user.filter((x) => x !== null);
      }
      console.log(
        user.filter((x) => x !== null),
        "this is the user"
      );
      console.log(user);
      return quote;
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server
  .listen({ port: process.env.PORT || 8080 })
  .then(({ url }) => console.log(`GraphQL server running at ${url}`));
