const router = require("express").Router();
const { FileManager, Models: { AdminUser }, ErrorMessage, ErrorCodes, Exception } = require('common')

const Controller = require('../controllers/staff')

router
    .use(async (req, res, next) => {
        const usr = await AdminUser.findById(req.user.id)
            .populate('role').exec()
        if (!usr) return next(
            new Exception(
                // eslint-disable-next-line new-cap
                ErrorMessage.NO_PRIVILEGE,
                ErrorCodes.NO_PRIVILEGE
            )
        );

        req.isSuperAdmin = usr.isSuperAdmin === true

        if (usr && usr.role)
            req.permissions = usr.role.permissions
        next()
    })

module.exports = router
