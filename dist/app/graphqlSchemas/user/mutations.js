"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `#graphql
follow(from:String! , to:String!) : Boolean
unfollow(from:String! , to:String!) : Boolean
`;
