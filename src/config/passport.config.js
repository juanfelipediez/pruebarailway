import passport from 'passport'
import localStrategy from 'passport-local'
import {createHash, isValidPassword } from '../utils/hashFunctions.js';
import {authToken, generateToken, jwtKey} from '../utils/jwtFunctions.js'
import jwt from 'passport-jwt'
import { cartService } from '../services/index.js';
import { userService } from '../services/index.js';

const LocalStrategy = localStrategy.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

function initializePassport(){
    passport.use('register', new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true, 
        },
        async (req, email, password, done) => {
            try{
                const {first_name, last_name, age,} = req.body
                if( !first_name || !last_name || !age ){
                    done(null, false)
                }
                const user = await userService.findOne({ email });
                if(user){
                    return done(null, false, {message: 'This email is alredy registered'});
                }
                const newCart = await cartService.create()
                const data = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: newCart._id,
                }
                const newUser = await userService.create(data)
                return done(null, newUser)
            }catch(error){
                return done(error)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (username, password, done) => {
            try{
                if(!username || !password){
                    return done(null, false, {message: 'All fields are required.'})
                }

                const user = await userService.findOne({email: username})
                if(!user){
                    return done(null, false, {message: 'This email is not registered'})
                }
                if(!isValidPassword(user, password)){
                    return done(null, false, {message: 'Password is not correct.'})
                }

                return done(null, user)
            } catch(error){
                return done(error)
            }
    
        }
    ))

    passport.use(
        "current",
        new JWTStrategy(
          {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: jwtKey,
          },
          async (payload, done) => {
            try {
              done(null, payload);
            } catch (error) {
              return done(error);
            }
          }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
          const user = await userService.findById(id);
        
          return done(null, user);
        } catch (error) {
          return done(error);
        }
    });
}


function cookieExtractor(req) {
    let token = null;
  
    if (req && req.cookies) {
      token = req.cookies.token;
    }
  
    return token;
  }

export default initializePassport