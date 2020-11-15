const {User, validateUser} = require('../models/user');
const express = require('express');
const _ = require('lodash');
const  jwt = require('jsonwebtoken');
const { Book } = require('../models/book');
const auth = require('../middleware/auth');

const Router = express.Router();


Router.get('/users',  async(req, res)=>{
    const users = await User.find()
                      .sort({name: 1})
                      .select({email:1, name: 1, lastname:1});
    if(!users) return res.status(404).send(new Error('Failed to retrive users'))

    res.send(users);
})
Router.get('/users_all',  async(req, res)=>{
    const users = await User.find();
    if(!users) return res.status(404).send(new Error('Failed to retrive users'))

    res.send(users);
})

Router.get('/reviewer/:id',  async(req, res)=>{
   const id  = req.params.id;
   
   const user = await User.findById(id);

   if(!user) return res.status(400).send('Invalid reviewer')

   res.status(200).send({
       name: user.name,
       lastname: user.lastname
   })
})

Router.get('/user_post/:id',  async(req, res)=>{

    const books = await Book.find({ownerId: req.params.id});
         
   if(!books) return res.status(404).send('Books not found')

   res.status(200).send(books);
})


Router.post('/register',  async (req, res)=>{

    const { error } = validateUser(req.body);
  

    if(typeof error !== 'undefined') return res.status(400).send({success:false})


     let user = new User(req.body);    
     user.password = await User.hashpassword(user.password);

      const result = await user.save();
      res.status(200).send({
        success:true,
        user: result
    });

   
})

Router.post('/login',async (req, res) =>{
 
    const user = await User.findOne({email:req.body.email});
   

    if(!user) return res.status(401).send({ isAuth:false, message: 'Invalid email or username'});

    
    let validpassword  = await User.isvalidPassword(user.password, req.body.password);
     if(!validpassword) return res.status(401).send({ isAuth:false, message: 'Invalid email or username'})                  
   
     const token =  user.generateToken({id:user._id});
    
     user.token = token;
   
     await user.save();

      if(!token) return res.status(400).send(new Error('Failed to generate token'));
       
      res.cookie('x-auth',  token).send({
         isAuth:true,
         id: user._id,
         email:user.email 
     })

})

Router.get('/logout',auth,  async(req, res)=>{
    
          const result = await req.user.deleteToken(req.token);
       
          if(!result) return res.status(400).send('Failed to logout')

          res.status(200).send('Ok')
          
})
Router.get('/auth', auth, (req, res)=>{
       res.status(200).send({
           isAuth:true,
           id:req.user._id,
           email: req.user.email,
           name:req.user.name,
           lastname: req.user.lastname
       })
})

module.exports = Router;