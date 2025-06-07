    import { NextResponse } from "next/server";
    import jwt from 'jsonwebtoken'
    import dotenv from 'dotenv'

    dotenv.config()

    export const auth =  (req) => {
        try {
            const token = req.cookies.get('token')?.value;

            if(!token){
                throw new Error("No token here, Unauthorized")
            }

            const decoded =  jwt.verify(token, process.env.JWT_SECRET);

            const id = decoded.id
            if(!id){
                throw new Error("Unauthorized, No ID found in token")
            }
            return id;

        } catch (error) {
            throw error
        }
    }