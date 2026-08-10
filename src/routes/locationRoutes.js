import express from "express";

const router = express.Router();

/*
 * GET /search
 * Address → Coordinates
 */
router.get("/search", async (req, res) => {
    console.log("🔥 LOCATION SEARCH ROUTE HIT");

    try {
        const {
            street,
            city,
            state,
        } = req.query;

        if (!street || !city || !state) {
            return res.status(400).json({
                success: false,
                message:
                    "Street, city and state are required.",
            });
        }

        const cleanStreet = String(street).trim();
        const cleanCity = String(city).trim();
        const cleanState = String(state).trim();

        /*
         * Try the most specific query first.
         */
        const queries = [
            `${cleanStreet}, ${cleanCity}, ${cleanState}, Nigeria`,
            `${cleanStreet}, ${cleanState}, Nigeria`,
            `${cleanCity}, ${cleanState}, Nigeria`,
        ];

        let results = [];

        for (const query of queries) {
            console.log(
                "🔥 NOMINATIM QUERY:",
                query
            );

            const params = new URLSearchParams({
                q: query,
                countrycodes: "ng",
                format: "jsonv2",
                addressdetails: "1",
                limit: "1",
            });

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                {
                    headers: {
                        "User-Agent":
                            "FarmConnect/1.0",
                        Accept:
                            "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Nominatim returned ${response.status}`
                );
            }

            const currentResults =
                await response.json();

            console.log(
                "🔥 RESULTS:",
                currentResults.length
            );

            if (currentResults.length > 0) {
                results = currentResults;
                break;
            }
        }

        if (!results.length) {
            return res.status(404).json({
                success: false,
                message:
                    "Could not find coordinates for this address.",
            });
        }

        const location = results[0];

        return res.status(200).json({
            success: true,
            data: {
                latitude: Number(
                    location.lat
                ),
                longitude: Number(
                    location.lon
                ),
                displayName:
                    location.display_name ||
                    "",
            },
        });
    } catch (error) {
        console.error(
            "🔥 Forward geocoding error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to determine coordinates from address.",
        });
    }
});

/*
 * GET /reverse
 * Coordinates → Address
 */
router.get("/reverse", async (req, res) => {
    try {
        const {
            latitude,
            longitude,
        } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message:
                    "Latitude and longitude are required.",
            });
        }

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
                latitude
            )}&lon=${encodeURIComponent(
                longitude
            )}`,
            {
                headers: {
                    "User-Agent": "FarmConnect/1.0",
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                "Reverse geocoding service failed."
            );
        }

        const data = await response.json();

        const address = data?.address || {};

        return res.status(200).json({
            success: true,
            data: {
                street:
                    address.road ||
                    address.pedestrian ||
                    address.neighbourhood ||
                    "",
                city:
                    address.city ||
                    address.town ||
                    address.village ||
                    address.municipality ||
                    "",
                state: address.state || "",
                country:
                    address.country || "",
                displayName:
                    data?.display_name || "",
            },
        });
    } catch (error) {
        console.error(
            "Reverse geocoding error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to determine address from coordinates.",
        });
    }
});

export default router;