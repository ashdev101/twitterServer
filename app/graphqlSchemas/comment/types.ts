

export const types = `#graphql

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

`

