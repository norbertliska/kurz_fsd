"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import * as express from 'express';
//import express, { Express, Request, Response } from 'express';
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
//Variablesnpm install --save-dev @types/node @types/express
dotenv_1.default.config();
const app = express_1.default();
const port = process.env.PORT;
const msg = "TypeScript version.";
app.get('/', (req, res) => {
    res.send(msg);
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
