//initialize express
const express = require('express');
const app = express();

const mongoose = require('mongoose')


//bcrypt
const bcrypt = require('bcrypt');

//model
const UserModel = require('../models/user');
const User = UserModel;



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
        res.send("User does not exists")
    } else {
        // user exists
        bcrypt.compare(req.body.password, dbuser.password, async (err, result) => {
            if (err) return err;
            if(result) {
                res.send("Login Success\n" + "Mongo Id is: " + dbuser._id)
            } else {
                
                res.send("wrong password\n"+"Failed Login")
            }
        });

    }
}

const returnUser = async (req, res) =>  {
    const accessToken = req.headers.accesstoken;

    const dbUser = await User.findOne({_id : accessToken});

    if (dbUser == null) {
        res.send("Invalid token")
    } else {
        res.send(dbUser)
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

module.exports = {
    registerUser,
    loginUser,
    returnUser,
    deleteUser,
    getUserData
};