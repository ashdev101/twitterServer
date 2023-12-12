
export const types = `#graphql


 type Tweet {
    id : String
    content : String 
    image : String 
    author : User !
      comments : [Comment]
      createdAt : String !
      updatedAt : String
      
 }

`