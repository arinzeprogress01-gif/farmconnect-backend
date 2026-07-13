import ForbiddenError from "../errors/ForbiddenError.js";

const vendorOnly = (

    req,

    res,

    next

) => {

    if (req.user.role !== "vendor") {

        return next(

            new ForbiddenError(

                "Only vendors can perform this action."

            )

        );

    }

    next();

};

export default vendorOnly;