import { NextResponse } from "next/server";
import {connect} from "@/lib/mongodb"
import User from "@/models/user";
import bcrypt from "bcryptjs"
import url from 'url';

export async function GET(req:any) {
    try {
        await connect();
        const parsedUrl = url.parse(req.url, true);
        const { pathname, query } = parsedUrl;
        // console.log('the query')
        // console.log(query.userid)

        const user = await User.findById(query.userid);
        // const userid = query.userid;
        return NextResponse.json(user)
    } catch (error) {
        console.log(error);
    }
}