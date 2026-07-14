import resend from "../config/email.js";

import passwordResetTemplate from "../templates/passwordReset.template.js";

export const sendResetEmail = async (

    email,

    otp

) => {

    if (!resend) {

        return;

    }

    await resend.emails.send({

        from:

            process.env.EMAIL_FROM,

        to: email,

        subject:

            "FarmConnect Password Reset",

        html:

            passwordResetTemplate(otp),

    });

};