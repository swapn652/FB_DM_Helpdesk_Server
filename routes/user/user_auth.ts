import express, {Router, Request, Response} from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateSecretKey from './generateSecretKey';

const prisma = new PrismaClient();
const router: Router = express.Router();
const SECRET_KEY = generateSecretKey();

router.post("/sign-up", async (req: Request, res: Response): Promise<void> => {
    const { name, password, email } = req.body;

    try {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            // Email already exists, return an error
            res.status(400).json({ message: "Email already exists" });
        }

        // Email does not exist, hash the password and create the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                password: hashedPassword,
                email,
            },
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const {email, password}: {email: string, password: string} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if(!user || !(await bcrypt.compare(password, user?.password)))
            res.status(401).json({error: "Invalid username or password!"});
        
        const token = jwt.sign({id: user?.id, name: user?.name, email: user?.email}, SECRET_KEY);

        res.json({token});
    } catch(err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;