"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql


 type Tweet {
    id : String
    content : String 
    image : String 
    author : User !
      comments : [Comment]
      createdAt : String !
      updatedAt : String
      
 }

`;
