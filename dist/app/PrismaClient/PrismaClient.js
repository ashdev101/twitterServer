"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const client_1 = require("@prisma/client");
// export const prismaClient = new PrismaClient({ log: ['query'] })
exports.prismaClient = new client_1.PrismaClient();
// async function main() {
//     // ... you will write your Prisma Client queries here
// }
// main()
//     .then(async () => {
//         await prismaClient.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await prismaClient.$disconnect()
//         process.exit(1)
//     })
