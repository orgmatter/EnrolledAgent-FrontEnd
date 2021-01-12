const router = require("express").Router(); 

router
.use((req, res) => {
    res.statusCode = 404;
    // console.log(req.url.split("/").pop());
    // res.render(req.path.split("/").pop(), { locals: req.locals }, (err, dat) => {
    res.render("page_404", { locals: req.locals });
    // else res.send(dat);
    // });
  });


module.exports = router
