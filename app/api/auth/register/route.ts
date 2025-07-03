import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

//For registration of the user, Existing user check
export async function POST(request: NextRequest) {
    try{
        const {email, password} = await request.json()

        if(!email || !password){
            return NextResponse.json(
                {error:"email and password are required"},
                {status:400}
            )
        }

        await dbConnect()

        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json(
                {error:"User Registered already"},
                {status:400}
            )
        }

        const newUser = await User.create({
            email,
            password
        })

        return NextResponse.json(
            { message: "User registered successfully", new_User: newUser },
            { status: 400 }
        )
    }catch(e){
        console.log("registration error")
            return NextResponse.json(
                {error:"Failed to register user"},
                {status:400}
            )
    }
}