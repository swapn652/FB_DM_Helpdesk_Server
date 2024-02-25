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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateSecretKey_1 = __importDefault(require("./generateSecretKey"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const SECRET_KEY = (0, generateSecretKey_1.default)();
router.post("/sign-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, email } = req.body;
    try {
        // Check if email already exists
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            // Email already exists, return an error
            res.status(400).json({ message: "Email already exists" });
        }
        // Email does not exist, hash the password and create the new user
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: {
                name,
                password: hashedPassword,
                email,
            },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user || !(yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password)))
            res.status(401).json({ error: "Invalid username or password!" });
        const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user.id, name: user === null || user === void 0 ? void 0 : user.name, email: user === null || user === void 0 ? void 0 : user.email }, SECRET_KEY);
        res.json({ token });
    }
    catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
