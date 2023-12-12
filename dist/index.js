"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphqlinit_1 = require("./app/graphqlinit/graphqlinit");
const initServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = yield (0, graphqlinit_1.graphqServer)();
    yield new Promise((resolve) => app.listen({ port: `${process.env.PORT}` }, resolve));
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
});
initServer();
