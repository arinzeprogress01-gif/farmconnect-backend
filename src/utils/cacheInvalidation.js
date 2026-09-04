import cache from "./cache.js";

export const invalidateMarketListingsCache = async () => {
    await cache.invalidateVersion("market-listings");
};

export const invalidateVendorListingsCache = async (
    vendorId
) => {
    await cache.delete(
        "vendor-listings",
        vendorId
    );
};

export const invalidateVendorProfileCache = async (
    vendorId
) => {
    await cache.delete(
        "vendor-profile",
        vendorId
    );
};

export const invalidateListingCache = async (
    listingId
) => {
    await cache.delete(
        "listing",
        listingId
    );
};