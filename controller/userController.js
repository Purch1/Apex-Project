const router = require('express').Router();
const jwt = require('jsonwebtoken')
const { getToken } = require('../utils/getToken');
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const User = require('../model/User')
const { registerValidation, loginValidation, changePasswordValidation} = require('../validation/users')
const generateOTP = require(`../utils/getOTP`);
const sendOtpToken = require(`../utils/nodemailer`);
const { UserRefreshClient } = require('google-auth-library');


const userController = {

register: async (req, res) => {
    let tokenGen = '';

    let { firstname, lastname, gender, date_of_birth, religion, education, country_id, state, address,
        email, password, phone, facebook, twitter, instagram, youtube } = req.body;

    //validate user information entered
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //hash password
    if (password) {
        password = bcrypt.hashSync(password, 8);
    }

    try {
        let users = await User.find({ email:req.body.email});
       
        tokenGen = generateOTP(6);

    if(users.length === null){
        // Create a new wallet and create a new user 
       
        await User.create({
            ...req.body,
            password: password,
            otp: tokenGen,
        });
      const mailjetResponse = sendOtpToken(email, firstname, tokenGen);
      if(mailjetResponse){
        return res.status(201).send({
            status_code: 201,
            message: "New token sent to your email",
            data: req.body.email
        });          
    }else{   
      
        return res.status(400).send({
            status_code: 400,
            message: "Error with token, try again!",
        });
      }
      }

      //check if user exist
    let result = checkEmailExist(req, users);
    if (result) {
        return res.status(400).send({
            status_code: 400,
            message: "User already exist, please login",
            data: req.body
        });
    }else{
        const mailjetResponse = sendOtpToken(email, firstname, tokenGen);
        if(mailjetResponse){
           
            await User.create({
                ...req.body,
                password: password,
                otp: tokenGen,
                
            });
            return res.status(201).send({
                status_code: 201,
                message: "New token sent to your email",
            });
         }else{   
            return res.status(400).send({
                status_code: 400,
                message: "Error with token, try again!",
            });
         }
    }

    }
    catch (error) {
        
        return res.status(500).send({
            status_code: 500,
            detail: error.message,
            message: "Internal server error!",
            data: error,
            response: req.body
        });
    }
},
verifyRegister: async(req, res) => {
    const sentToken = req.body.token;
    const email = req.body.email;
    let response;
    let user;
    
    try {
        if(sentToken && email){
            user = await User.find({email : email});
            let savedToken = user[0].otp;
            response = sentToken === savedToken ? savedToken : null
        }else{
            return res.status(400).send({
                status_code: 400,
                message: "Bad Request, Email and token required!",
                data: email
            });
        }
        if(response){
            await user[0].updateOne({email_verify: true});
            // get jwt
            const token = getToken(user);
            return res.status(200).send({
                status_code: 200,
                message: "Registration successful!",
                token: token,
            });

        }else{
            return res.status(400).send({
                status_code: 400,
                message: "Token Error, try again!",
            });
        }
      
    } catch (error) {
        return res.status(500).send({
            status_code: 500,
            detail: error.message,
            message: "Internal server error!",
            data: error,
        }); 
    }
},


//LOGIN
login: async(req, res) => {
    //validate user information entered
    const { error } = loginValidation(req.body);

    let curentTime;

    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email:req.body.email});
        
        if (!user){
            return res.status(400).send({
                status_code: 400,
                message: "Email doesn't exist, Please register!"
            });
        }else{
    try {
        const { email, password } = req.body;

        //check if email exists
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword){
        curentTime = new Date().getTime();
        let previousTime = curentTime;
        trials++
        if(previousTime <= curentTime && trials >= 3 ) {
            setTimeout(() => {
                trials = 0;
            }, 3600000);
            return res.status(405).send({
                status_code: 405,
                message: "Incorrect password entered 3 times!, Wait 1 hr before retry",
                request: req.body
            });
            
        }else{
            return res.status(400).send({
                status_code: 400,
                message: "Incorrect password!",
                request: req.body
            });
        }
    }   
        // get jwt
        const token = getToken(user);

        return res.status(200).send({
            status_code: 200,
            message: "Login successful!",
            token,
            user: user,
        });

    } catch (error) {
        return res.status(500).send({
            status_code: 500,
            detail: error.message,
            message: "Internal server error!",
            data: error,
            request: req.body
        });
    }
}
},

changePassword: async(req, res) => {
    
        try {
             const {password} = req.body
             
             const passwordHash = await bcrypt.hash(password, 12)

             await Users.findOneAndUpdate({id: req.user._id}, {
                 password: passwordHash
             })

             res.json({message: "Password successfully changed"})             
        } catch (err) { 
            return res.status(500).json({message: err.message})
        }
    }, 

}



function checkEmailExist(req, users){
    
    if ((users.find((item)=>item.email === req.body.email || item.phone === req.body.phone ))) return true;
return false;  
}
module.exports = userController;