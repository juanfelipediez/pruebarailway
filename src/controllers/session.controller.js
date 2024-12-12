import {authToken, generateToken, jwtKey} from '../utils/jwtFunctions.js'
import CustomError from "../utils/errors/CustomError.js"
import errors from "../utils/errors/errors.js"

class SessionController{
    register(req, res) {
        return res.status(201).json({
            response: req.user,
            message: 'New user created'
        })
    }
    
    login(req, res){
        const payload = {
            email: req.user.email,
            role: req.user.role
        }
        const token = generateToken(payload)
        res.cookie('token', token, {
            maxAge: 1000*60*5,
            httpOnly: true
        })
        res.status(200).json({message: 'Success login'})
    }
    logout(req, res){
        req.clearCookie("token");
        res.status(200).json({ message: 'Success logout'});
    }

    loginError(req, res){
        CustomError.newError(errors.auth)
    }

    failRegister(req, res){
        CustomError.newError(errors.error)
    }

    current(req, res){
        res.status(200).json({message: 'Active session', data: req.user})
    }

    auth(req, res){
        res.status(200).json({message: 'Active session', data: req.user})
    }
}

export const sessionController = new SessionController



