import  dotenv from 'dotenv'
dotenv.config()

export const API_URL =  process.env.API_URL || "http://localhost:3000/api"; 