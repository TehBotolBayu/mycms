import { connect } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import axios from "axios";
import jwt from "jsonwebtoken";

export const authOptions : any = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            
            async authorize(credentials) {
                const {email, password } = credentials as any;
                try {
                    await connect();
                    let user = await User.findOne({email}).lean() as any;
                    let id = user._id;

                    const token = jwt.sign(
                        {
                          id
                        },
                        "secret_key",
                        {
                          expiresIn: "24h",
                        }
                      );

                    if(!user){
                        console.log("Email not registered");
                        return null;
                    }

                    const match = await bcrypt.compare(password, user.password);

                    if(!match){
                        console.log("Wrong Password");
                        return null;
                    }
                    
                    user = {...user, token};
                    return user;
                } catch (error) {
                    console.log("Error: " + error);
                }
            }
        })
    ],

    callbacks:{
        jwt: async ({ token, trigger, session, user, account }:{ token:any, trigger:any, session:any, user:any, account: any }) =>{

          if (user) {
            token.uid = user;
          }
          if (trigger === "update" && session?.user.username) {
            token.uid = session.user
          }
          return token
        },
        session: async ({ session, token }:{ session:any, token:any }) => {
            session.user._id = token.uid._id;
            session.user.username = token.uid.username;
            session.user.token = token.uid.token;
            return session;
        },
      },

    secret: String(process.env.NEXTAUTH_SECRET),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/",
    }
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}