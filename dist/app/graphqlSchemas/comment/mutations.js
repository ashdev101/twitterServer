"use strict";
// updateComment(commentId:String! , comment:String!) : Comment
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `#graphql
makeCommment(comment:String! , tweetId:String!):Comment
deleteComment(commentId :String!) : Boolean

`;
