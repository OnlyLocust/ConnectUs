import { NextResponse } from "next/server";


export const GET = async (req) => {
        const res = NextResponse.json(
                { message: "Log-out successful", success: true },
                { status: 200 }
        );

        res.cookies.set("token", "", {
                httpOnly: true,
                expires: new Date(0),
                path: "/",
        });

        return res;
}