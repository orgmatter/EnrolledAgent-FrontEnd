const router = require("express").Router();
const {  Models: { ArticleCategory, ResourceCategory, QuestionCategory } } = require("common");
const {FileManager} = require('common')

const CategoryController = require('../controllers/category')
const ArticleCategoryController = new CategoryController(ArticleCategory)
const ResourceCategoryController = new CategoryController(ResourceCategory)
const QuestionCategoryController = new CategoryController(QuestionCategory)

router
    .get('/resource/',  ResourceCategoryController.getAll)
    .get('/resource/:id', ResourceCategoryController.get)
    .post("/resource", FileManager.none, ResourceCategoryController.create)
    .put("/resource/:id", FileManager.none, ResourceCategoryController.update)
    .delete("/resource/:id", ResourceCategoryController.delete)

    .get('/article/', ArticleCategoryController.getAll)
    .get('/article/:id', ArticleCategoryController.get)
    .put('/article/:id', FileManager.none, ArticleCategoryController.update)
    .post('/article', FileManager.none,  ArticleCategoryController.create)
    .delete('/article/:id', ArticleCategoryController.delete)


    .get('/question/', QuestionCategoryController.getAll)
    .get('/question/:id', QuestionCategoryController.get)
    .put('/question/:id', FileManager.none, QuestionCategoryController.update)
    .post('/question',  FileManager.none,  QuestionCategoryController.create)
    .delete('/question/:id', QuestionCategoryController.delete)

module.exports = router
