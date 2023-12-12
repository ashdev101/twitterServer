"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqServer = void 0;
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const user_1 = require("../graphqlSchemas/user");
const tweet_1 = require("../graphqlSchemas/tweet");
const comment_1 = require("../graphqlSchemas/comment");
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const corsOptions_1 = require("../../config/corsOptions");
const graphqServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    app.use(body_parser_1.default.json());
    app.use((0, cors_1.default)(corsOptions_1.corsOptions));
    const server = new server_1.ApolloServer({
        typeDefs: `
        ${user_1.User.types}
        ${tweet_1.Tweet.types}
        ${comment_1.Comment.types}
        
        type Query  {
            ${user_1.User.queries}
            ${tweet_1.Tweet.queries}
            ${comment_1.Comment.queries}
        }

        type Mutation {
            ${tweet_1.Tweet.mutations}
            ${user_1.User.mutations}
            ${comment_1.Comment.mutations}
        }
      `,
        resolvers: Object.assign(Object.assign(Object.assign({ Query: Object.assign(Object.assign(Object.assign({}, user_1.User.resolvers.queries), tweet_1.Tweet.resolvers.queries), comment_1.Comment.resolvers.queries), Mutation: Object.assign(Object.assign(Object.assign({}, tweet_1.Tweet.resolvers.mutations), user_1.User.resolvers.mutations), comment_1.Comment.resolvers.mutations) }, tweet_1.Tweet.resolvers.extraResolvers), user_1.User.resolvers.extraResolvers), comment_1.Comment.resolvers.extraResolvers),
        // introspection: process.env.NODE_ENV !== 'production'
    });
    yield server.start();
    app.use('/graphql', (0, express4_1.expressMiddleware)(server, {
        context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            const headers = req.headers.authorization;
            const access_token = headers === null || headers === void 0 ? void 0 : headers.split(" ")[1];
            console.log(access_token);
            const user = access_token
                ? jsonwebtoken_1.default.verify(access_token, `${process.env.ACCESS_KEY}`)
                : undefined;
            return { user };
        })
    }));
    return app;
});
exports.graphqServer = graphqServer;
