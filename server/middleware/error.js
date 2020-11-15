

module.exports=function(err, req, res, next) {
  
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    res.status(err.status || 500);
    res.send('error');

    next();
}