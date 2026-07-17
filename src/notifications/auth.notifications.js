export const WELCOME = (

    user

) => ({

    title:

        "Welcome to FarmConnect",

    message:

        `Hi ${user.fullName}, welcome to FarmConnect.`,

    type:

        "system",

});

export const PASSWORD_CHANGED = () => ({

    title:

        "Password Updated",

    message:

        "Your password has been changed successfully.",

    type:

        "system",

});

export const EMAIL_VERIFIED = () => ({

    title:

        "Email Verified",

    message:

        "Your email address has been verified successfully.",

    type:

        "system",

});

export const OTP_SENT = () => ({

    title:

        "Verification Code",

    message:

        "Your verification code has been sent successfully.",

    type:

        "system",

});