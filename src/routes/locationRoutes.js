import express from "express";

const router = express.Router();

router.get("/search", async (req, res) => {
  console.log("🔥 LOCATION SEARCH ROUTE HIT");
  
  // existing code...
});

/*
 * GET /reverse
 * Coordinates → Address
 */
router.get("/reverse", async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required.",
            });
        }

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
                latitude
            )}&lon=${encodeURIComponent(longitude)}`,
            {
                headers: {
                    "User-Agent": "FarmConnect/1.0",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Reverse geocoding service failed.");
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
                country: address.country || "",
                displayName: data?.display_name || "",
            },
        });
    } catch (error) {
        console.error("Reverse geocoding error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Unable to determine address from coordinates.",
        });
    }
});

/*
 * GET /search
 * Address → Coordinates
 */
router.get("/search", async (req, res) => {
    const {
        street,
        city,
        state,
    } = req.query;

    try {
        if (!street || !city || !state) {
            return res.status(400).json({
                success: false,
                message:
                    "Street, city and state are required.",
            });
        }

        /*
         * Build one complete address query.
         *
         * Example:
         * Pentecost estate, Abbidi Umuoji, Idemili North, Anambra, Nigeria
         */
        const addressQuery = [
            String(street).trim(),
            String(city).trim(),
            String(state).trim(),
            "Nigeria",
        ]
            .filter(Boolean)
            .join(", ");

        const params = new URLSearchParams({
            q: addressQuery,
            countrycodes: "ng",
            format: "jsonv2",
            addressdetails: "1",
            limit: "1",
        });

        const controller =
            new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 10000);

        let response;

        try {
            console.log(
                "🌍 Nominatim search:",
                addressQuery
            );

            response = await fetch(
                `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "User-Agent":
                            "FarmConnect/1.0 (FarmConnect food-sharing application)",
                        Accept:
                            "application/json",
                    },
                    signal: controller.signal,
                }
            );
        } finally {
            clearTimeout(timeout);
        }

        console.log(
            "🌍 Nominatim response:",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                `Nominatim geocoding service returned ${response.status}.`
            );
        }

        const results =
            await response.json();

        if (
            !Array.isArray(results) ||
            results.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Could not find coordinates for this address.",
            });
        }

        const location = results[0];

        const latitude =
            Number(location.lat);

        const longitude =
            Number(location.lon);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            return res.status(502).json({
                success: false,
                message:
                    "The geocoding service returned invalid coordinates.",
            });
        }

        console.log(
            "📍 Coordinates found:",
            {
                latitude,
                longitude,
                displayName:
                    location.display_name,
            }
        );

        return res.status(200).json({
            success: true,
            data: {
                latitude,
                longitude,
                displayName:
                    location.display_name || "",
            },
        });
    } catch (error) {
        if (
            error?.name ===
            "AbortError"
        ) {
            console.error(
                "⏱️ Nominatim request timed out."
            );

            return res.status(504).json({
                success: false,
                message:
                    "The location service took too long to respond. Please try again.",
            });
        }

        console.error(
            "❌ Forward geocoding error:",
            error
        );

        return res.status(502).json({
            success: false,
            message:
                "Unable to determine coordinates from the location service.",
        });
    }
});

export default router;