import ForbiddenError from "../errors/ForbiddenError.js";

const requireAdmin = (req, res, next) => {

    if (!req.user.permissions?.admin) {

        return next(

            new ForbiddenError(
                "Administrator access required."
            )

        );

    }

    next();

};

export default requireAdmin;