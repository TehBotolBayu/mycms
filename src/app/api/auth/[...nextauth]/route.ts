import { connect } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions : any = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            
            async authorize(credentials) {
                const {email, password } = credentials;
                try {
                    await connect();
                    let user = await User.findOne({email});

                    if(!user){
                        console.log("Email not registered");
                        return null;
                    }

                    const match = await bcrypt.compare(password, user.password);

                    if(!match){
                        console.log("Wrong Password");
                        return null;
                    }
                    return user;
                } catch (error) {
                    console.log("Error: " + error);
                }
            }
        })
    ],

    callbacks:{
        jwt: async ({ token, trigger, session, user, account }:{ token:any, trigger:any, session:any, user:any, account: any }) =>{
        //   if(account){
        //     token.accessToken = Object.assign({}, token, { access_token: account.access_token });
        //   }
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
            session.token = token.accessToken;
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