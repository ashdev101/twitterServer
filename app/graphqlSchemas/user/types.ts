

export const types = ` #graphql

    type User {
        id : ID !
        firstName : String !
        lastName : String 
        email : String !
        profileImgURL : String 
        tweets : [Tweet]
        followedBy : [User]  
        following :  [User]
        
    }
    

`