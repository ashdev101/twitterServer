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
exports.resolvers = void 0;
const axios_1 = __importDefault(require("axios"));
const PrismaClient_1 = require("../../PrismaClient/PrismaClient");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const queries = {
    verifyGoogleToken: (_parent, { token }) => __awaiter(void 0, void 0, void 0, function* () {
        //generate our own access token form the google auth token 
        const baseURL = new URL("https://www.googleapis.com/oauth2/v1/userinfo");
        if (token.length < 1)
            throw new Error("token not received");
        baseURL.searchParams.set("access_token", token);
        const url = baseURL.toString();
        const res = yield axios_1.default.get(url);
        // if (res.status != 200) throw new Error("token validation failed something wrong with token") but thats aytomatically thrown so no point of doing so 
        const userIndb = yield PrismaClient_1.prismaClient.user.findUnique({ where: { email: res.data.email } });
        if (!userIndb) {
            const newUser = yield PrismaClient_1.prismaClient.user.create({
                data: {
                    firstName: res.data.given_name,
                    lastName: res.data.family_name,
                    email: res.data.email,
                }
            });
            const { firstName, lastName, email, id } = newUser;
            // process.env.ACCESS_KEY
            const generated_acess_token = jsonwebtoken_1.default.sign({
                id,
                firstName,
                lastName,
                email
            }, `${process.env.ACCESS_KEY}`, { expiresIn: "1d" });
            return generated_acess_token;
            // console.log(newUser)
        }
        if (userIndb) {
            const { id, firstName, lastName, email } = userIndb;
            // process.env.ACCESS_KEY
            const generated_acess_token = jsonwebtoken_1.default.sign({
                id,
                firstName,
                lastName,
                email
            }, `${process.env.ACCESS_KEY}`, { expiresIn: "1d" });
            return generated_acess_token;
            // console.log(newUser)
        }
    }),
    getCurrentUser: (_, __, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        //get the information about the current user from the database
        if (ctx.user) {
            const user_info = ctx.user.email;
            // console.log(user_info)
            const user = yield PrismaClient_1.prismaClient.user.findUnique({ where: { email: ctx.user.email } });
            // console.log(user)
            return user;
        }
        else
            return undefined;
    }),
    getCurrentUserFollowers: (_, __, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id))
            throw new Error("Unauthenticated");
        const user = yield PrismaClient_1.prismaClient.user.findUnique({
            where: { id: ctx.user.id },
            include: {
                followedBy: true,
            }
        });
        // console.log(user)
        return user === null || user === void 0 ? void 0 : user.followedBy;
    })
};
// connect query connects a record to an existing related record
const mutations = {
    follow: (_, { from, to }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (!((_b = ctx.user) === null || _b === void 0 ? void 0 : _b.id))
            throw new Error("Unauthenticated");
        const user = yield PrismaClient_1.prismaClient.user.findFirst({
            where: { id: ctx.user.id },
            include: {
                following: true
            }
        });
        const isAlreadyFollowing = user === null || user === void 0 ? void 0 : user.following.filter(item => item.id === to);
        console.log(isAlreadyFollowing);
        if (isAlreadyFollowing === null || isAlreadyFollowing === void 0 ? void 0 : isAlreadyFollowing.length)
            return false;
        yield PrismaClient_1.prismaClient.user.update({
            where: { id: ctx.user.id },
            data: {
                following: { connect: { id: to } },
            }
        });
        yield PrismaClient_1.prismaClient.user.update({
            where: { id: to },
            data: {
                followedBy: { connect: { id: from } }
            }
        });
        return true;
    }),
    unfollow: (_, { from, to }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        yield PrismaClient_1.prismaClient.user.update({
            where: { id: (_c = ctx.user) === null || _c === void 0 ? void 0 : _c.id },
            data: {
                following: { disconnect: { id: to } }
            }
        });
        yield PrismaClient_1.prismaClient.user.update({
            where: { id: to },
            data: {
                followedBy: { disconnect: { id: from } }
            }
        });
        return true;
    })
};
const extraResolvers = {
    User: {
        followedBy: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield PrismaClient_1.prismaClient.user.findFirst({
                where: { id: parent.id },
                include: { followedBy: true },
            });
            console.log(user === null || user === void 0 ? void 0 : user.followedBy);
            return user === null || user === void 0 ? void 0 : user.followedBy;
        }),
        following: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield PrismaClient_1.prismaClient.user.findFirst({
                where: { id: parent.id },
                include: { following: true }
            });
            return user === null || user === void 0 ? void 0 : user.following;
        })
    }
};
exports.resolvers = {
    queries, mutations, extraResolvers
};
