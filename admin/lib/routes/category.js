const router = require("express").Router();
const {  Models: { ArticleCategory, ResourceCategory } } = require("common");

const CategoryController = require('../controllers/category')
const ArticleCategoryController = new CategoryController(ArticleCategory)
const ResourceCategoryController = new CategoryController(ResourceCategory)

router
    .get('/resource/',  ResourceCategoryController.getAll)
    .get('/resource/:id', ResourceCategoryController.get)
    .post("/resource", ResourceCategoryController.create)
    .put("/resource/:id", ResourceCategoryController.update)
    .delete("/resource/:id", ResourceCategoryController.delete)

    .get('/article/', ArticleCategoryController.getAll)
    .get('/article/:id', ArticleCategoryController.get)
    .put('/article/:id',  ArticleCategoryController.update)
    .post('/article',   ArticleCategoryController.create)
    .delete('/article/:id', ArticleCategoryController.delete)

module.exports = router
