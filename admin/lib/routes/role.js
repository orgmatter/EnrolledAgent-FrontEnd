const router = require("express").Router();
const { FileManager, Models: { AdminUser }, ErrorMessage, ErrorCodes, Exception } = require('common')

const RoleController = require('../controllers/role')

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
    .get('/', RoleController.getAll)
    .get('/:id', RoleController.get)
    .post("/", FileManager.none, RoleController.create)
    .put("/:id", FileManager.none, RoleController.update)
    .delete("/:id", RoleController.delete)

module.exports = router
