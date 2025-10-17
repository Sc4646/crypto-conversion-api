import express from "express";
import { getCoinPrice } from '../services/coinGeckoService.js';

const router = express.Router();

const API_KEY = process.env.API_KEY;
const RATE_LIMIT = new Map();
const MAX_REQUESTS = 60;
const WINDOW_MS = 60 * 1000;

router.get("/", async (req, res) => {
    const { from, to, amount, api_key } = req.query;

    try {
        if (api_key !== API_KEY) {
            return res.status(401).json({ error: "Unauthorized: Invalid API key" });
        }

        if (!from || !to || !amount) {
            return res.status(400).json({ error: "Missing required query parameters: from, to, amount" });
        }

        const now = Date.now();
        const timestamps = RATE_LIMIT.get(api_key) || [];
        const recentRequests = timestamps.filter(ts => now - ts < WINDOW_MS);

        if (recentRequests.length >= MAX_REQUESTS) {
            return res.status(429).json({ error: "Too many requests. Try again later." });
        }

        recentRequests.push(now);
        RATE_LIMIT.set(api_key, recentRequests);

        const fromPrice = await getCoinPrice(from);
        const toPrice = await getCoinPrice(to);

        if (fromPrice === null || toPrice === null) {
            return res.status(400).json({ error: "Invalid currency pair or unsupported symbol" });
        }

        const rate = fromPrice / toPrice;
        const result = parseFloat(amount) * rate;

        return res.status(200).json({ from, to, amount, rate, result });

    } catch (error) {
        console.error("❌ Conversion Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
