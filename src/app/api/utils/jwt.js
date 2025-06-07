import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken =  (id) => {
    try {

        if(!id) {
            throw new Error("ID is required to generate a token");
        }

        const token =  jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Token expires in 1 hour
        });
        return token;

    } catch (error) {
        return ""
        
    }
}
