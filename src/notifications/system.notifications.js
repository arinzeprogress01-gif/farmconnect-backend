export const PROFILE_COMPLETED = () => ({

    title:

        "Profile Completed",

    message:

        "Your profile has been completed successfully.",

    type:

        "system",

});

export const MAINTENANCE = () => ({

    title:

        "Maintenance Notice",

    message:

        "FarmConnect will undergo scheduled maintenance.",

    type:

        "system",

});

export const GENERAL_ANNOUNCEMENT = (

    title,

    message

) => ({

    title,

    message,

    type:

        "system",

});