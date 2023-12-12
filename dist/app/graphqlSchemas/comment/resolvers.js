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
const queries = {
    getAllCommentsByTweetId: (_, { tweetId }) => __awaiter(void 0, void 0, void 0, function* () {
        const tweets = yield PrismaClient_1.prismaClient.comment.findMany({
            where: { tweetId: tweetId }
        });
        console.log(tweets);
        return tweets;
    })
};
const mutations = {
    makeCommment: (_, { comment, tweetId }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id))
            throw new Error("Unauthenticated");
        const Comment = yield PrismaClient_1.prismaClient.comment.create({
            data: {
                comment: comment,
                commenterId: ctx.user.id,
                tweetId: tweetId
            }
        });
        return Comment;
    }),
    deleteComment: (_, { commentId }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        //if so it happen by any chance
        if (!((_b = ctx.user) === null || _b === void 0 ? void 0 : _b.id))
            throw new Error("Unauthenticated");
        yield PrismaClient_1.prismaClient.comment.delete({
            where: { id: commentId }
        });
        return true;
    })
};
const extraResolvers = {
    Comment: {
        commenter: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield PrismaClient_1.prismaClient.user.findUnique({
                where: { id: parent.commenterId }
            });
        }),
        tweet: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return PrismaClient_1.prismaClient.tweet.findUnique({
                where: { id: parent.tweetId }
            });
        })
    }
};
exports.resolvers = {
    mutations,
    queries,
    extraResolvers
};
