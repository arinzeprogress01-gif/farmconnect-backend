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

    console.log("🔥 ABOUT TO READ QUERY");

    const {
        street,
        city,
        state,
    } = req.query;

    console.log("🔥 QUERY RECEIVED:", {
        street,
        city,
        state,
    });

    console.log("🔥 CHECKING REQUIRED FIELDS");

    if (!street || !city || !state) {
        console.log("🔥 REQUIRED FIELDS FAILED");

        return res.status(400).json({
            success: false,
            message:
                "Street, city and state are required.",
        });
    }

    console.log("🔥 REQUIRED FIELDS PASSED");

    const addressQuery = [
        String(street).trim(),
        String(city).trim(),
        String(state).trim(),
        "Nigeria",
    ].join(", ");

    console.log(
        "🔥 ADDRESS QUERY CREATED:",
        addressQuery
    );

    const params = new URLSearchParams({
        q: addressQuery,
        countrycodes: "ng",
        format: "jsonv2",
        addressdetails: "1",
        limit: "1",
    });

    console.log(
        "🔥 PARAMS CREATED:",
        params.toString()
    );

    console.log(
        "🔥 ROUTE IS ABOUT TO CALL NOMINATIM"
    );

    return res.status(200).json({
        success: true,
        message: "Route works up to Nominatim.",
        query: {
            street,
            city,
            state,
        },
        nominatimUrl:
            `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    });
});
export default router;