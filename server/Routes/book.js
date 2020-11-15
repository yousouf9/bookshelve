
const {Book, validateUser} = require('../models/book');
const express = require('express');
const  _  = require('lodash');
const { User } = require('../models/user');

const Router = express.Router();

Router.get('/books',  async(req, res)=>{
   console.log(req.params);
   console.log(req.query);
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let order = parseInt(req.query.order);
    const books = await Book.find()
                            .skip(skip)
                            .sort({_id: order})
                            .limit(limit);
                            


        if(!books) return res.status(404).send(new Error('Failed to retrive Books'))

        res.send(books);

})
Router.get('/book/:id', async(req, res)=>{

    const id =  req.params.id;
    const book = await Book.findOne({_id:id});

    if(!book) return res.status(404).send('Book not found');

    res.status(200).send(book)

})

Router.post('/book', async (req, res)=>{

 

   const { error } = validateUser(req.body);
     
    if(error) return res.status(400).send(error.message);

    const book = new Book(req.body);
    
    const result = await  book.save();

    res.status(200).json({
        post:true,
        bookId: result._id
    })
   
    console.log()
    console.log()


})
Router.put('/book/:id',async (req, res)=>{
    
   const book = await Book.findOne({_id: req.params.id});
      const isValid = ["name", "author", "review","pages","rating","price", "ownerId"]
    const { error } = validateUser(_.pick(book, isValid));
    if(error) return res.status(400).send(error.message);


   if(!book) return res.status(404).send('Book not found');

   const result = await Book.findByIdAndUpdate({_id: req.params.id}, req.body, {new:true});

   if(!result) return res.status(404).send('Failed to update');

   res.status(200).send({
       success:true,
       result
   });
  
    
})
Router.delete('/book/:id', async(req, res)=>{
    const id = req.params.id;
     const resutl = await Book.findOneAndRemove({_id:id});

     if(!resutl) return res.status(400).send('Failed to delete');

     res.status(200).send(true);

})

module.exports = Router;

