const router = require('express').Router();
const { PageAnalyticsService, Logger, Helper } = require('common');

const CityController = require('../controllers/city');
const { verify } = require('../controllers/auth');
const ContactController = require('../controllers/contact');
const ResourceController = require('../controllers/resource');
const ArticleController = require('../controllers/article');
const AgentController = require('../controllers/agent');
const QuestionController = require('../controllers/question');
const ReviewController = require('../controllers/review');
const FaqController = require('../controllers/faq');

const Log = new Logger('App:open');

// const checkRedirectCookie = (req, res, next) => {
//   const path = req.cookies['redirect-to'];
//    res.clearCookie('redirect-to');

//   if (path && path.length > 1) return res.redirect(path);
//   next();
// };

router
.get('/contact', (req, res) => {
  res.render('contact', { locals: req.locals });
  PageAnalyticsService.inc('/contact');
})
  .get(
    '/',
    Helper.checkRedirectCookie,
    (req, res) => {
      Promise.allSettled([
        new Promise((resolve, reject) => {
          CityController.get(req, res, () => resolve())
        }),
        new Promise((resolve, reject) => {
          AgentController.popular(req, res, () => resolve())
        }),
        new Promise((resolve, reject) => {
          ResourceController.random(req, res, () => resolve())
        })])
        .then(val => {
          res.render('home', { locals: req.locals });
          PageAnalyticsService.inc('/home');
        })
    }
  )

  .get('/career-center', (req, res) => {
    res.render('careerCenter', { locals: req.locals });
    PageAnalyticsService.inc('/career-center');
  })
  .get('/frequently-asked-questions', FaqController.getAll, (req, res) => {
    res.render('faq', {
      locals: req.locals,
      id: false
    });
    PageAnalyticsService.inc('/frequently-asked-questions');
    Log.info('faq', req.locals.faqs.data);
  })
  .get('/frequently-asked-questions/:id', FaqController.getAll, FaqController.get, (req, res) => {
    res.render('faq', {
      locals: req.locals,
      id: true
    });
    PageAnalyticsService.inc('/frequently-asked-questions');
    Log.info('faq', req.locals);
  })
  .get('/about-us', (req, res) => {
    res.render('about', { locals: req.locals });
    PageAnalyticsService.inc('/about-u');
  })
  .get('/privacy', (req, res) => {
    res.render('privacy', { locals: req.locals });
    PageAnalyticsService.inc('/privacy');
  })
  .get('/terms', (req, res) => {
    res.render('terms', { locals: req.locals });
    PageAnalyticsService.inc('/terms');
  })
  .get('/unsubscribe', ContactController.unsubscribe)
  .get('/verify/:token', verify)

  // .get('/linkedin/callback', passport.authenticate('linkedin'), handleSocial)
  // .get('/google/callback', passport.authenticate('google', { scope: ['profile', 'email'], }), handleSocial)

  .get(
    '/blog',
    ArticleController.getAll,
    ArticleController.featured,
    ArticleController.latest,
    (req, res) => {
      res.render('blog', { locals: req.locals });
      PageAnalyticsService.inc('/blog');
      Log.info('articles>>>', req.locals.articles.data);
    }
  )
  .get('/blog/:id', ArticleController.get, (req, res) => {
    res.render('singleBlog', { locals: req.locals });
    PageAnalyticsService.inc('/blog/:blog-id');
    Log.info('articles>>>', req.locals.article);
  })
  .get('/ea-listings', AgentController.getAll, (req, res) => {
    res.render('ea-listings', { locals: req.locals });
    PageAnalyticsService.inc('/ea-listings');
    Log.info('locals are', req.locals.agents);
  })
  .get(
    '/find-agent',
    CityController.get,
    AgentController.popular,
    ResourceController.random,
    (req, res) => {
      res.render('find-agent', { locals: req.locals });
      PageAnalyticsService.inc('/find-agent');
    }
  )
  .get(
    '/search-results',
    ReviewController.agent,
    AgentController.getAll,
    (req, res) => {
      res.render('search-results', { locals: req.locals });
      PageAnalyticsService.inc('/career-center');
      Log.info('locals>>>>', req.locals.query);
    }
  )


  .get('/claim-listing', (req, res) => {
    res.render('listings', { locals: req.locals });
    PageAnalyticsService.inc('/claim-listing');
  })
  .get(
    '/ask-ea',
    QuestionController.getAll,
    ArticleController.latest,
    (req, res) => {
      Log.info('questions', req.locals);
      res.render('askEA', { locals: req.locals });
      PageAnalyticsService.inc('/ask-ea');
      Log.info('questions', req.locals);
    }
  )
  .get(
    '/ask-ea/:id',
    QuestionController.get,
    ArticleController.latest,
    (req, res) => {
      res.render('askEASingle', { locals: req.locals });
      PageAnalyticsService.inc('/ask-ea/:id');
      Log.info('questions', req.locals);
    }
  )
  .get(
    '/ask-ea/category/:category',
    QuestionController.getAll,
    ArticleController.latest,
    (req, res) => {
      res.render('askEACategory', {
        locals: req.locals,
        name: req.params.category,
      });
      PageAnalyticsService.inc('/ask-ea/category/:category');
      Log.info('params', req.locals);
    }
  )
  .get('/new-question', ArticleController.latest, (req, res) => {
    if (!(req.isAuthenticated() && req.user)) return res.redirect('/login');
    res.render('newQuestions', { locals: req.locals });
    PageAnalyticsService.inc('/new-question');
    Log.info('cate', req.locals);
  })
  .get(
    '/agent/:id',
    ReviewController.analysis,
    AgentController.get,
    (req, res) => {
      res.render('single-agent-details', { locals: req.locals });
      PageAnalyticsService.inc('/agent/:id');
      Log.info('agent>>>>', req.locals);
    }
  )
  .get(
    '/agents/all-states',
    CityController.allStates,
    CityController.get,
    AgentController.get,
    (req, res) => {
      //  Log.info(req.locals);
      res.render('states', { locals: req.locals });
      PageAnalyticsService.inc('/agents/all-states');
    }
  )
  .get(
    '/agents/:state',
    CityController.state,
    CityController.forState,
    AgentController.popularInState,
    AgentController.get,
    (req, res) => {
      //  Log.info(req.locals);
      res.render('single-state', { locals: req.locals });
      PageAnalyticsService.inc('/agents/:state');
    }
  )
  .get('/agents/:state/:city', AgentController.city, (req, res) => {
    //  Log.info(req.locals);
    res.render('city', { locals: req.locals });
  })
  // .get('/offshore-team', (req, res) => {
  //   res.render('offshoreTeam', { locals: req.locals });
  //   PageAnalyticsService.inc('/agents/:state/:city');
  // })
  .get(
    '/resource',
    CityController.get,
    ResourceController.getAll,
    (req, res) => {
      //  Log.info(req.locals.resource)
      res.render('resource', {
        name: 'Resources',
        description: 'Valuable services, products, tools, and whitepapers from our partners, carefully selected by our staff.',
        locals: req.locals,
      });
      PageAnalyticsService.inc('/resource');
    }
  )
  .get(
    '/resource/:category',
    CityController.get,
    ResourceController.getAll,
    (req, res) => {
      let description = '';
      let name = '';
      if (req.locals.category && req.locals.category.description)
        description = req.locals.category.description;
      if (req.locals.category && req.locals.category.name)
        name = req.locals.category.name;
      res.render('resource', {
        name,
        description,
        locals: req.locals,
      });
      PageAnalyticsService.inc('/resource/:category');
    }
  )
  .get('/practice-exchange', CityController.get, (req, res) => {
    res.render('practiceExchange', { locals: req.locals });
    PageAnalyticsService.inc('/practice-exchange');
  })
  .get(
    '/states/:state',
    CityController.get,
    AgentController.popular,
    (req, res) => {
      //  Log.info("data>>>>>", req.locals);
      res.render('singleFirm', { locals: req.locals });
      PageAnalyticsService.inc('/states/:state');
    }
  )
  .get(
    '/find-enrolled-agents',
    CityController.get,
    AgentController.popular,
    (req, res) => {
      res.render('find-agent', { locals: req.locals });
      PageAnalyticsService.inc('/find-enrolled-agents');
    }
  )
  .get('/need-accountant', (req, res) => {
    res.render('need-accountant', { locals: req.locals });
    PageAnalyticsService.inc('/need-accountant');
  })
  .get('/license-verification', (req, res) => {
    res.render('license-verification', { locals: req.locals });
    PageAnalyticsService.inc('/license-verification');
    Log.info('license', req.locals);
  })
  .get(
    '/claim-profile/:id',
    ReviewController.analysis,
    AgentController.get,
    (req, res) => {
      res.render('claim-profile', {
        locals: req.locals,
      });
      PageAnalyticsService.inc('/claim-profile/:id');
      Log.info('listing >>>', req.locals);
    }
  )

  // .use((req, res, next) => {
  //   if (!(req.isAuthenticated() && req.user)) return res.redirect('/login');
  //   next();
  // })
  .get('/new-listing', (req, res) => {
    if (!(req.isAuthenticated() && req.user)) return res.redirect('/login');
    res.render('newListing', {
      locals: req.locals,
      page_name: 'new-listings',
      sub_page_name: 'new-listings',
    });
    PageAnalyticsService.inc('/new-listing');
  });

module.exports = router;
