import express from "express";

const router = express.Router();

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
      message: "Unable to determine address from coordinates.",
    });
  }
});

export default router;