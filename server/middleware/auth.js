const jwt = require('jsonwebtoken');
const {User} = require('../models/user')

module.exports = async (req, res, next)=> {
    let token = req.cookies['x-auth']

    if(!token) return res.status(403).send({
        error:true,
        message: "You don't have the right permission to accesss here"

    })

    let decoded = await User.findByToken(token);


    const user = await User.findOne({_id: decoded.id, token})
    
        if(!User) return res.status(400).send({
            error:true,
        })
        
        req.token = token;
        req.user = user;
        next()
}