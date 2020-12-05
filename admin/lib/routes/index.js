const router = require("express").Router();
const passport = require("passport");
const user = require("../controllers/users");
const seeder = require("../seed")
const SponsorController = require('../controllers/sponsor')
const ArticleController = require('../controllers/article')

const {
  Exception,
  Constants,
  Logger,
} = require("common");

const Log = new Logger("Portal:Router");

seeder()

router
  .post(
    "/auth",
    passport.authorize("local", {
      successRedirect: "/",
      failureRedirect: "/auth",
    })
  )

  .post("/login", (req, res, next) => {
    passport.authenticate(Constants.DOMAIN.admin, (err, user, info) => {
      if (err) {
        res.status(500);
        return next(err);
      }
      if (!user) {
        return res.json({ data: { message: "Unknown error occured" } });
      }
      req.logIn(user, function (err) {
        if (err) {
          res.status(500);
          return next(err);
        }
        return res.json({ data: { message: `Welcome back ${user.name}` } });
      });

    })(req, res, next);
  })

  
  // .use((req, res, next) => {
  //   if (
  //     req.isAuthenticated() &&
  //     req.user.accountType == 'ADMIN'
  //   ) {
  //     const { imageUrl, name, email } = req.user;
  //     console.log(req.locals);
  //     req.locals = { imageUrl, name, email };
  //     next();
  //   } else res.render("login", );
  // })

  .use('/api', require('./api'))

  .get('/',   SponsorController.getAll)
  .get('/:id', SponsorController.get)

  .get("/users", user.getAll)





// catch 404
router.use((req, res) => {

  // console.log(req.url.split("/").pop());
  Log.info(req.user);

  res.render(req.path.split("/").pop(), { locals: req.locals }, (err, dat) => {
    // console.log(err, dat);
    if (err) {
      res.statusCode = 404;
      res.render("page_404");
    }
    else res.send(dat);
  });
});

// error handler
// I added this to return json @wiseminds
router.use((err, req, res, next) => {

  Log.info(err);
  if (err instanceof Exception) return res.json({ error: err });

  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};
  res.status(err.status || 500);
  res.render("page_500");
});

module.exports = router;
