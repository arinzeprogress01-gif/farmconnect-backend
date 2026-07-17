export const RESERVATION_SUCCESS = (

    reservation

) => ({

    title:

        "Reservation Successful",

    message:

        `Your reservation for "${reservation.foodName}" has been confirmed. Pickup Code: ${reservation.pickupCode}.`,

    type:

        "reservation",

});

export const NEW_RESERVATION = (

    user,

    reservation

) => ({

    title:

        "New Reservation",

    message:

        `${user.fullName} reserved ${reservation.quantityRequested} portion(s) of "${reservation.foodName}".`,

    type:

        "reservation",

});

export const RESERVATION_CANCELLED = (

    reservation

) => ({

    title:

        "Reservation Cancelled",

    message:

        `Your reservation has been cancelled. Reason: ${reservation.cancellationReason}.`,

    type:

        "reservation",

});

export const RESERVATION_COMPLETED = (

    reservation

) => ({

    title:

        "Reservation Completed",

    message:

        `Your reservation for "${reservation.foodName}" has been marked as completed. Thank you for rescuing food.`,

    type:

        "reservation",

});

export const PICKUP_REMINDER = (

    reservation

) => ({

    title:

        "Pickup Reminder",

    message:

        `Don't forget to pick up "${reservation.foodName}". Pickup Code: ${reservation.pickupCode}.`,

    type:

        "reminder",

});