import { Strategy } from "passport-google-oauth20"
import { createGoogleUser, findGoogleUser } from "./create-google-user.js"
import { env } from "../env.js"

export const passportStrategy = new Strategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET_ID,
    callbackURL: env.GOOGLE_CALLBACK_URL,
},
    async function (accessToken, refreshToken, profile, done) {
        const findUser = await findGoogleUser(profile)

        if(findUser)  return done(null, {name: profile.displayName, id: profile.id})

        await createGoogleUser(profile)

        return done(null, {name: profile.displayName, id: profile.id})
    }
)