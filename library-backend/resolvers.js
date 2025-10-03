const Author = require("./models/Author");
const Book = require("./models/Book");
const { GraphQLError } = require("graphql");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const authorized = (context) => {
  if (!context.currentUser) {
    throw new GraphQLError("not authenticated", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
};

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args, context) => {
      const books = await Book.find({
        ...(args.genre && { genres: { $in: [args.genre] } }),
      }).populate({
        path: "author",
        match: args.author ? { name: args.author } : {},
      });

      return books.filter((item) => !!item.author);
    },
    allAuthors: async () => Author.find({}),
    findBook: async (root, args) => {
      const { title } = args;
      return Book.findOne({ title });
    },
    findAuthor: async (root, args) => {
      const { name } = args;
      const author = await Author.findOne({ name });

      return {
        ...author._doc,
        bookCount: await Book.countDocuments({ author: name }),
      };
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      authorized(context);
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        try {
          author = new Author({ name: args.author });
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      }

      const book = new Book({ ...args, author: author._id });

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: JSON.stringify(args),
            error,
          },
        });
      }

      const bookResponse = await book.populate("author");
      pubsub.publish("BOOK_ADDED", { bookAdded: bookResponse });
      return bookResponse;
    },
    editAuthor: async (root, args, context) => {
      authorized(context);
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Saving author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
            error,
          },
        });
      }
      return author;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterator("BOOK_ADDED") },
  },
};

module.exports = resolvers;
