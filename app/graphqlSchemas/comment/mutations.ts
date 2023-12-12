// updateComment(commentId:String! , comment:String!) : Comment

export const mutations = `#graphql
makeCommment(comment:String! , tweetId:String!):Comment
deleteComment(commentId :String!) : Boolean

`