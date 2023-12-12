import { Tweet } from "@prisma/client"
import { jwtuserContext } from "../../../types/type"
import { prismaClient } from "../../PrismaClient/PrismaClient"

type inputForMakeTweet = {
    content: string
    image?: string
}

const mutations = {
    makeTweet: async (_: any, { content, image }: inputForMakeTweet, ctx: jwtuserContext) => {

        if (!ctx.user) throw new Error("no token found or invalid token ")


        const newTweet = await prismaClient.tweet.create({
            data: {
                content: content,
                image: image,
                author: { connect: { id: ctx.user.id } },
                // we dont need to give authorId as doing do prisma is giving error as it automatically does it 
            }
        })


        return newTweet

    }
}

const queries = {

    getAllTweetsofUser: async (_: any, __: any, ctx: jwtuserContext) => {
        if (!ctx.user?.id) throw new Error("no token found or invalid token ")
        // console.log(ctx.user.email)
        const AllTweets = await prismaClient.tweet.findMany(
            {
                where: { authorId: ctx.user?.id },
                orderBy: { createdAt: "desc" }
            },
        )
        console.log(AllTweets)
        return AllTweets
    },
    getAllTweets: async (_: any, { skip, take }: { skip: number, take: number }) => {
        console.log(skip)
        if (skip && take) {
            return prismaClient.tweet.findMany({
                skip,
                take,
                orderBy: { createdAt: "desc" }
            })
        }
        return await prismaClient.tweet.findMany({

            orderBy: { createdAt: "desc" }
        })
    }
}

//basically for the realted field with the particular model it has to be excatly as we would have to write query for eg : inside Tweet we will ask for author so it would be like below  : and its required to provide the tppe of the parent and here prisma does the job 


const extraResolvers = {
    Tweet: {
        author: async (parent: Tweet) => await prismaClient.user.findUnique({ where: { id: parent.authorId } })
    }
}


export const resolvers = { mutations, queries, extraResolvers }