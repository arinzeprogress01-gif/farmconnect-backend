import express from "express";

const router = express.Router();

/*
 * GET /search
 * Address → Coordinates
 */
router.get("/search", async (req, res) => {
    console.log("🔥 LOCATION SEARCH ROUTE HIT");

    try {
        const { city, state } = req.query;

        console.log("🔥 QUERY:", {
            city,
            state,
        });

        if (!city || !state) {
            return res.status(400).json({
                success: false,
                message: "City and state are required.",
            });
        }

        const params = new URLSearchParams({
            q: `${String(city).trim()}, ${String(state).trim()}, Nigeria`,
            countrycodes: "ng",
            format: "jsonv2",
            addressdetails: "1",
            limit: "1",
        });

        console.log(
            "🔥 NOMINATIM QUERY:",
            params.toString()
        );

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${params.toString()}`,
            {
                headers: {
                    "User-Agent": "FarmConnect/1.0",
                    Accept: "application/json",
                },
            }
        );

        console.log(
            "🔥 NOMINATIM STATUS:",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                `Nominatim returned ${response.status}`
            );
        }

        const results = await response.json();

        console.log(
            "🔥 NOMINATIM RESULTS:",
            results
        );

        if (!results.length) {
            return res.status(404).json({
                success: false,
                message:
                    "Could not find coordinates for this city and state.",
            });
        }

        const location = results[0];

        return res.status(200).json({
            success: true,
            data: {
                latitude: Number(location.lat),
                longitude: Number(location.lon),
                displayName:
                    location.display_name || "",
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
                "Unable to determine coordinates from location.",
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