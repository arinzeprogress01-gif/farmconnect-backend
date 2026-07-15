import ForbiddenError from "../errors/ForbiddenError.js";

const userOnly = (

    req,

    res,

    next

) => {

    if (req.user.role !== "user") {

        return next(

            new ForbiddenError(

                "Only users can perform this action."

            )

        );

    }

    next();

};

export default userOnly;