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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const PrismaClient_1 = require("../../PrismaClient/PrismaClient");
const mutations = {
    makeTweet: (_, { content, image }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.user)
            throw new Error("no token found or invalid token ");
        const newTweet = yield PrismaClient_1.prismaClient.tweet.create({
            data: {
                content: content,
                image: image,
                author: { connect: { id: ctx.user.id } },
                // we dont need to give authorId as doing do prisma is giving error as it automatically does it 
            }
        });
        return newTweet;
    })
};
const queries = {
    getAllTweetsofUser: (_, __, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (!((_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id))
            throw new Error("no token found or invalid token ");
        // console.log(ctx.user.email)
        const AllTweets = yield PrismaClient_1.prismaClient.tweet.findMany({
            where: { authorId: (_b = ctx.user) === null || _b === void 0 ? void 0 : _b.id },
            orderBy: { createdAt: "desc" }
        });
        console.log(AllTweets);
        return AllTweets;
    }),
    getAllTweets: (_, { skip, take }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(skip);
        if (skip && take) {
            return PrismaClient_1.prismaClient.tweet.findMany({
                skip,
                take,
                orderBy: { createdAt: "desc" }
            });
        }
        return yield PrismaClient_1.prismaClient.tweet.findMany({
            orderBy: { createdAt: "desc" }
        });
    })
};
//basically for the realted field with the particular model it has to be excatly as we would have to write query for eg : inside Tweet we will ask for author so it would be like below  : and its required to provide the tppe of the parent and here prisma does the job 
const extraResolvers = {
    Tweet: {
        author: (parent) => __awaiter(void 0, void 0, void 0, function* () { return yield PrismaClient_1.prismaClient.user.findUnique({ where: { id: parent.authorId } }); })
    }
};
exports.resolvers = { mutations, queries, extraResolvers };
