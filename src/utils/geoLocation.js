export const createGeoPoint = (longitude, latitude) => {

    const lng = Number(longitude);
    const lat = Number(latitude);

    if (!isValidCoordinates(lng, lat)) {
        return null;
    }

    return {
        type: "Point",
        coordinates: [lng, lat],
    };
};

export const isValidCoordinates = (longitude, latitude) => {
    const lng = Number(longitude);
    const lat = Number(latitude);

    return (
        Number.isFinite(lng) &&
        Number.isFinite(lat) &&
        lng >= -180 &&
        lng <= 180 &&
        lat >= -90 &&
        lat <= 90
    );
};