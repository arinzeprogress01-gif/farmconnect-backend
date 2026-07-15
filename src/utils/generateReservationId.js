const generateReservationId = () => {

    const random =
        Math.floor(
            100000 + Math.random() * 900000
        );

    return `RSV-${random}`;
};

export default generateReservationId;