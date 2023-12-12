import { Comment } from "@prisma/client"
import { jwtuserContext } from "../../../types/type"
import { prismaClient } from "../../PrismaClient/PrismaClient"

type CommentInput = {
    comment: string
    tweetId: string
}


const queries = {
    getAllCommentsByTweetId: async (_: any, { tweetId }: { tweetId: string }) => {
        const tweets = await prismaClient.comment.findMany({
            where: { tweetId: tweetId }
        })
        console.log(tweets)
        return tweets
    }
}

const mutations = {
    makeCommment: async (_: any, { comment, tweetId }: CommentInput, ctx: jwtuserContext) => {
        if (!ctx.user?.id) throw new Error("Unauthenticated")

        const Comment = await prismaClient.comment.create({
            data: {
                comment: comment,
                commenterId: ctx.user.id,
                tweetId: tweetId
            }
        })

        return Comment
    },
    deleteComment: async (_: any, { commentId }: { commentId: string }, ctx: jwtuserContext) => {

        //if so it happen by any chance
        if (!ctx.user?.id) throw new Error("Unauthenticated")


        await prismaClient.comment.delete({
            where: { id: commentId }
        })

        return true

    }
}

const extraResolvers = {
    Comment: {
        commenter: async (parent: Comment) => {
            return await prismaClient.user.findUnique({
                where: { id: parent.commenterId }
            })
        },
        tweet : async(parent :Comment) =>{
            return prismaClient.tweet.findUnique({
                where : {id:parent.tweetId}
            })
        }
    }
}


export const resolvers = {
    mutations,
    queries,
    extraResolvers
}