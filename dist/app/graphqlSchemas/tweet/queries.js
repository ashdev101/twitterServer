"use strict";
//here sience the database returns the array of tweets we writeit as follows 
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `#graphql 
    getAllTweetsofUser : [Tweet]
    getAllTweets(skip:Int , take : Int) : [Tweet]

`;
