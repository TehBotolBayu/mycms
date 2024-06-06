import { connect } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import url from 'url';
import bcrypt from "bcryptjs"

export async function PUT(req:any) {
    try {
        await connect();
        let {userid, ...body} = await req.json();
        if(body.password !== ''){
            const hashed = await bcrypt.hash(body.password, 10);
            body.password = hashed;
            
        } else {
            let {password, ...bodyWithoutPassword} = body;
            body = bodyWithoutPassword
        }
        const user = await User.findByIdAndUpdate(
            userid,
            body,
            { new: true }
        )
        if(!user) return NextResponse.json({ message: 'Item not found' });
        // console.log("user: ", user);
        return NextResponse.json({message: "Update Success", user})
    } catch (error) {
        console.log(error);
    }
}