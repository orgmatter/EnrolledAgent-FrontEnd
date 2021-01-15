const router = require("express").Router();
const { FileManager, Models: { AdminUser }, ErrorMessage, ErrorCodes, Exception } = require('common')

const Controller = require('../controllers/staff')

router
    .use(async (req, res, next) => {
        if (req.isSuperAdmin != true)
            return next(
                new Exception(
                    // eslint-disable-next-line new-cap
                    ErrorMessage.NO_PRIVILEGE,
                    ErrorCodes.NO_PRIVILEGE
                )
            );
        next()
    })
    .get('/', Controller.getAll)
    .get('/:id', Controller.get)
    .post("/", FileManager.none, Controller.create)
    .put("/:id", FileManager.none, Controller.update)
    .delete("/:id", Controller.delete)

module.exports = router
