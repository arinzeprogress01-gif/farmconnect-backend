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

router.get("/search", async (req, res) => {
    console.log("🔥 LOCATION SEARCH ROUTE HIT");

    const {
        street,
        city,
        state,
    } = req.query;

    console.log("📥 Incoming query:", {
        street,
        city,
        state,
    });

    try {
        if (!street || !city || !state) {
            console.log("❌ Missing address fields");

            return res.status(400).json({
                success: false,
                message:
                    "Street, city and state are required.",
            });
        }

        const addressQuery = [
            String(street).trim(),
            String(city).trim(),
            String(state).trim(),
            "Nigeria",
        ]
            .filter(Boolean)
            .join(", ");

        console.log(
            "🌍 Nominatim query:",
            addressQuery
        );

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
            console.log(
                "⏰ ABORTING NOMINATIM REQUEST"
            );

            controller.abort();
        }, 10000);

        console.log(
            "🚀 Calling Nominatim..."
        );

        let response;

        try {
            response = await fetch(
                `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                {
                    method: "GET",

                    headers: {
                        "User-Agent":
                            "FarmConnect/1.0 (FarmConnect application)",
                        Accept:
                            "application/json",
                    },

                    signal: controller.signal,
                }
            );
        } catch (fetchError) {
            console.error(
                "❌ FETCH TO NOMINATIM FAILED:",
                fetchError
            );

            throw fetchError;
        } finally {
            clearTimeout(timeout);
        }

        console.log(
            "✅ Nominatim responded:",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                `Nominatim returned HTTP ${response.status}`
            );
        }

        const results =
            await response.json();

        console.log(
            "📦 Nominatim results:",
            results
        );

        if (
            !Array.isArray(results) ||
            results.length === 0
        ) {
            console.log(
                "⚠️ No location found"
            );

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

        console.log(
            "📍 Coordinates:",
            {
                latitude,
                longitude,
            }
        );

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            throw new Error(
                "Nominatim returned invalid coordinates."
            );
        }

        console.log(
            "🎯 SENDING RESPONSE TO FRONTEND"
        );

        return res.status(200).json({
            success: true,

            data: {
                latitude,
                longitude,

                displayName:
                    location.display_name ||
                    "",
            },
        });
    } catch (error) {
        console.error(
            "💥 LOCATION SEARCH ERROR:",
            error
        );

        if (
            error?.name ===
            "AbortError"
        ) {
            return res.status(504).json({
                success: false,
                message:
                    "Location service timed out. Please try again.",
            });
        }

        return res.status(502).json({
            success: false,
            message:
                "Unable to determine coordinates from the location service.",
        });
    }
});

export default router;