import express from 'express'
import passport from 'passport'
import session from 'express-session'
import cors from 'cors'
import { env } from './env.js'
import { blocosRoutes } from './routes/blocos-routes.js'
import { passportStrategy } from './utils/passport-strategy.js'

const app = express()

const port = env.PORT || 8080

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

passport.use(passportStrategy)

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(({id, displayname }, done) => {
    done(null, {
        id,
        displayname
    });
})

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