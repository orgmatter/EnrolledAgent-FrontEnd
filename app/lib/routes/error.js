const router = require("express").Router(); 

router
.use((err, req, res, next) => {
    // if (err.code === 'EBADCSRFTOKEN') return res.status(403).json({ error: { message: 'Invalid Token', code: 8000 } })
    Log.info(err);
    console.log(err);
    Log.info(req.headers);
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === "development" ? err : {};
    res.status(err.status || 500);
    res.render("page_500");
  });
  


module.exports = router
