"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const prismaClient_1 = require("../../../backend/generated/prismaClient");
exports.prisma = new prismaClient_1.PrismaClient();
