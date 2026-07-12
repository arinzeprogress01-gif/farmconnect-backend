import ForbiddenError from "..errors/ForbiddenError.js";

const requireSuperAdmin = (req, res, next) => {

    if (!req.user.isSuperAdmin) {

        return next(

            new ForbiddenError(
                "Super Administrator access required."
            )

        );

    }

    next();

};

export default requireSuperAdmin;