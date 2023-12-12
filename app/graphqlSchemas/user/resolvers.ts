import axios from "axios"
import { prismaClient } from "../../PrismaClient/PrismaClient"
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { GraphQLSchemaContext, GraphQLServerContext } from "@apollo/server"
import { jwtuserContext } from "../../../types/type"
import { User } from "@prisma/client"

type PropToken = {
    token: string
}

type UserGoogle = {
    id: string
    email: string
    verified_email: boolean
    name: string
    given_name: string
    family_name: string
    picture: string
    locale: string
}

type followInput = {
    from: string
    to: string
}

const queries = {
    verifyGoogleToken: async (_parent: any, { token }: PropToken) => {
        //generate our own access token form the google auth token 
        const baseURL = new URL("https://www.googleapis.com/oauth2/v1/userinfo")

        if (token.length < 1) throw new Error("token not received")


        baseURL.searchParams.set("access_token", token)

        const url = baseURL.toString()


        const res = await axios.get<UserGoogle>(url)

        // if (res.status != 200) throw new Error("token validation failed something wrong with token") but thats aytomatically thrown so no point of doing so 

        const userIndb = await prismaClient.user.findUnique({ where: { email: res.data.email } })
        if (!userIndb) {

            const newUser = await prismaClient.user.create({
                data: {
                    firstName: res.data.given_name,
                    lastName: res.data.family_name,
                    email: res.data.email,
                }
            })

            const { firstName, lastName, email, id } = newUser
            // process.env.ACCESS_KEY
            const generated_acess_token = jwt.sign(

                {
                    id,
                    firstName,
                    lastName,
                    email
                },
                `${process.env.ACCESS_KEY}`,
                { expiresIn: "1d" }
            )
            return generated_acess_token
            // console.log(newUser)
        }

        if (userIndb) {

            const { id, firstName, lastName, email } = userIndb
            // process.env.ACCESS_KEY
            const generated_acess_token = jwt.sign(

                {
                    id,
                    firstName,
                    lastName,
                    email

                },
                `${process.env.ACCESS_KEY}`,
                { expiresIn: "1d" }
            )

            return generated_acess_token
            // console.log(newUser)

        }
    },

    getCurrentUser: async (_: any, __: any, ctx: jwtuserContext) => {
        //get the information about the current user from the database

        if (ctx.user) {
            const user_info = ctx.user.email
            // console.log(user_info)
            const user = await prismaClient.user.findUnique({ where: { email: ctx.user.email } })
            // console.log(user)
            return user
        } else return undefined
    },

    getCurrentUserFollowers : async (_: any, __: any, ctx: jwtuserContext) =>{
        if(!ctx.user?.id) throw new Error("Unauthenticated")

        const user =  await prismaClient.user.findUnique({
            where : {id:ctx.user.id},
            include : {
                followedBy : true ,
            }
        })
        // console.log(user)
        return user?.followedBy
    }



}

// connect query connects a record to an existing related record

const mutations = {

    follow: async (_: any, { from, to }: followInput, ctx: jwtuserContext) => {
        if (!ctx.user?.id) throw new Error("Unauthenticated")

        const user = await prismaClient.user.findFirst({
            where: { id: ctx.user.id },
            include: {
                following: true
            }
        })


        const isAlreadyFollowing = user?.following.filter(item => item.id === to)
        console.log(isAlreadyFollowing)
        if (isAlreadyFollowing?.length) return false

        await prismaClient.user.update({
            where: { id: ctx.user.id },
            data: {
                following: { connect: { id: to } },
            }
        })

        await prismaClient.user.update({
            where: { id: to },
            data: {
                followedBy: { connect: { id: from } }
            }
        })

        return true
    },

    unfollow: async (_: any, { from, to }: followInput, ctx: jwtuserContext) => {

        await prismaClient.user.update({
            where: { id: ctx.user?.id },
            data: {
                following: { disconnect: { id: to } }
            }
        })

        await prismaClient.user.update({
            where: { id: to },
            data: {
                followedBy: { disconnect: { id: from } }
            }
        })

        return true
    }
}


const extraResolvers = {
    User: {
        followedBy: async (parent: User) => {
        
            const user = await prismaClient.user.findFirst({
                where: { id: parent.id },
                include: { followedBy: true },
            })
            console.log(user?.followedBy)
            return user?.followedBy

        },

        following: async (parent: User) => {
            const user = await prismaClient.user.findFirst({
                where: { id: parent.id },
                include: { following: true }
            })

            return user?.following
        }
    }
}




export const resolvers = {
    queries, mutations ,extraResolvers
}