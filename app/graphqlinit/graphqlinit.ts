import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import cors from 'cors'

import express from 'express';

import { User } from '../graphqlSchemas/user'
import { Tweet } from '../graphqlSchemas/tweet'
import {Comment} from '../graphqlSchemas/comment'

import bodyParser from 'body-parser';
import { jwtUser, jwtuserContext } from '../../types/type';

import jwt from "jsonwebtoken"
import { corsOptions } from '../../config/corsOptions';


export const graphqServer = async () => {
    const app = express();

    const httpServer = http.createServer(app);

    app.use(bodyParser.json())
    app.use(cors(corsOptions))

    const server = new ApolloServer<jwtuserContext>({
        typeDefs: `
        ${User.types}
        ${Tweet.types}
        ${Comment.types}
        
        type Query  {
            ${User.queries}
            ${Tweet.queries}
            ${Comment.queries}
        }

        type Mutation {
            ${Tweet.mutations}
            ${User.mutations}
            ${Comment.mutations}
        }
      `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                ...Tweet.resolvers.queries,
                ...Comment.resolvers.queries
            },

            Mutation: {
                ...Tweet.resolvers.mutations ,
                ...User.resolvers.mutations,
                ...Comment.resolvers.mutations
            },
            //extraResolvers here
            ...Tweet.resolvers.extraResolvers ,
            ...User.resolvers.extraResolvers,
            ...Comment.resolvers.extraResolvers
        },
        // introspection: process.env.NODE_ENV !== 'production'
    })

    await server.start();

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req, res }) => {
                const headers = req.headers.authorization 
                const access_token = headers?.split(" ")[1]
                console.log(access_token)
                const user = access_token
                    ? jwt.verify(access_token, `${process.env.ACCESS_KEY}`)
                    : undefined

                return { user }
            }
        })
    );
    return app
}