import express from "express";
import bcrypt from 'bcrypt'
import { client } from "../db";
import jwt from "jsonwebtoken";

const JWT_SECRET = "example"
const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const userId = Math.random().toString().substring(2, 15);

    await client.query(`INSERT into users VALUES($1 , $2 , $3 , $4)`, [userId, name, email, hash])

    const token = jwt.sign({
        userId,
        email
    }, JWT_SECRET, { expiresIn: '1d' })

    res.status(200).send({
        userId,
        token
    })

})

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const response = await client.query(`SELECT id,password from users where email=$1`, [email]);

    if (!response.rows[0]) {
        res.status(404).json({ msg: "User not found" });
        return;
    }

    if (await bcrypt.compare(password, response.rows[0]?.password)) {
        const token = jwt.sign({
            userId: response.rows[0]?.id,
            email
        }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            userId: response.rows[0]?.id,
            token
        })
    } else {
        res.status(404).json({
            msg: "Invalid email or password"
        })
    }

})

export { authRouter };

