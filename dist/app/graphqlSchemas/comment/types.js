"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql

type Comment {
    id : String 
    comment : String !
    commenter : User !
    commenterId : String !
    tweet :Tweet !
    tweetId : String !
    createdAt : String !
    updatedAt : String
}

`;
