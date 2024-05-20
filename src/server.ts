import express from 'express'
import passport from 'passport'
import session from 'express-session'
import cors from 'cors'
import { Strategy } from 'passport-google-oauth20'
import { env } from './env.js'
import { blocosRoutes } from './routes/blocos-routes.js'
import { createGoogleUser, findGoogleUser } from './utils/create-google-user.js'

const app = express()

const sessionOptions = {
    secret: env.SECRET_PASSWORD_SESSION,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 3 // 3days
    },
    name: '@bloco-carnaval/@v1'
}

app.use(cors())
app.use(express.json())
app.use(session(sessionOptions))
app.use(passport.session());

passport.use(new Strategy({
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
))

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(({id, displayname }, done) => {
    done(null, {
        id,
        displayname
    });
})

const port = env.PORT || 8080

app.use('/api/blocos', blocosRoutes)

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', { 
    failureRedirect: '/failed',
}),
  function(req, res) {
    res.redirect('http://localhost:5173/');
  });


app.listen(port, () => {
    console.log(`Rodando na porta http://localhost:${port}`)
})