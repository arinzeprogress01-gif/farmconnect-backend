import Listing from "../models/listing.model.js";

const generateListingId = async () => {

    const count = await Listing.countDocuments();

    const number = String(count + 1).padStart(5, "0");

    return `FC-LST-${number}`;

};

export default generateListingId;