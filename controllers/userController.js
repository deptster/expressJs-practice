//initialize express
const express = require('express');
const app = express();

//mongoose import
const mongoose = require('mongoose')

// md5 import
const md5 = require('md5')

//bcrypt
const bcrypt = require('bcrypt');

//User model
const UserModel = require('../models/user');
const User = UserModel;

//token model
const tokenModel = require('../models/token');

//address model
const addressModel = require('../models/address')



const registerUser = async (req, res) => {

    let bodyUsername = req.body.username;
    let bodyEmail = req.body.email;

    const dbuser = await User.findOne({username : bodyUsername});
    const dbemail = await User.findOne({email : bodyEmail});


    if (dbuser != null) {
        
        res.send("user already exists")
    } else if (dbemail != null) {
        
        res.send("email already exists")
    } else {
        bcrypt.hash(req.body.password, 5, async function(err, pwdHash) {
            if(err) return err;
            
            let user = await User.create({
                username : req.body.username,
                email: req.body.email,
                password: pwdHash,
                first_name: req.body.first_name,
                last_name: req.body.last_name
            })
        });
        
        
        res.send("user Created")
    }
    
};

const loginUser = async (req, res) => {

    let bodyUsername = req.body.username;
    const dbuser = await User.findOne({username : bodyUsername});
    
    if (dbuser == null) {
        //user does not exist
        res.json({
            message: "User does not exists"
        })
    } else {
        // user exists
        bcrypt.compare(req.body.password, dbuser.password, async (err, result) => {
            if (err) return err;
            if(result) {
                const userExists = await tokenModel.findOne({user_id : bodyUsername});

                if(userExists != null) {
                    //user token already exists

                    //get date from already existing token
                    const createdAt = new Date(userExists.createdAt);
                    const timeNow = new Date();

                    //if already existing token's hours is greater than 1 then delete it
                    if((createdAt.getHours()+1) <= timeNow.getHours()) {
                        //delete old token
                        let token_delete = await tokenModel.deleteOne({user_id: bodyUsername});
                        res.json({
                            token_status: "old Token deleted Login Again"
                        })
                    } else {
                        res.json({
                            login_status: "login Success",
                            user_id: dbuser.username,
                            token_status: "User Token already Exist",
                            token: userExists.access_token,
                            table_id: dbuser._id
                            
                        })
                    }
                    
                } else {
                    let randomNum = md5(Date());

                    let token = await tokenModel.create({
                        user_id : dbuser.username,
                        access_token : randomNum
                    
                    })

                    res.json({
                        login_status: "login Success",
                        user_id: dbuser.username,
                        token_status: "Token Generated",
                        token: token.access_token,
                        table_id: dbuser._id
                    })
                }

                
            } else {
                
                res.send("wrong password\n"+"Failed Login")
            }
        });

    }
}

const returnUser = async (req, res) =>  {
    const accessToken = req.headers.accesstoken;

    const tokendb = await tokenModel.findOne({access_token : accessToken})

    if (tokendb == null)
    {
        res.json({
            token : "invalid token"
        })
    } else {
        //find username in userdb
        const dbUser = await User.findOne({username : await tokendb.user_id})

        //find all the corresponding addresses in addressdb
        const addresses = await addressModel
                            .find({user_id : await tokendb.user_id})
                            .populate("user_id");
                            
        //print user details and all the addresses
        res.json({
            dbUser : dbUser,
            addresses : addresses
        })
    }
}

const deleteUser = async (req, res) => {

    let user_delete = await User.deleteOne({_id: req.headers.accesstoken});
    if(user_delete.deletedCount == 0) {
        res.status(500).json({
            message: "User does not exist"
        });
    } else {
        res.status(200).json({
            message: "User deleted"
        });
    }    

}

const getUserData = async (req, res) => {
    let skip = parseInt(req.params.page) * 10;
    let users = await User
        .find({})
        .skip(skip)
        .limit(10);
    res.json({
        "user count": users.length,
        users: users
    });
    
    
}

const userAddress = async (req, res) => {
    const tokenExists = await tokenModel.findOne({access_token : req.headers.accesstoken});

    if (tokenExists == null)
    {
        res.json({
            message: "invalid login token"
        })
    } else {
        let dbusername = await tokenExists.user_id;
        let address = await addressModel.create({
            user_id: dbusername,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pin_code: req.body.pin_code,
            phone_no: req.body.phone_no
        })

        res.json({
            message: "address updated",
            address: address
        })
    }
    
}

module.exports = {
    registerUser,
    loginUser,
    returnUser,
    deleteUser,
    getUserData,
    userAddress
};