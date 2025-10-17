
import rateLimit from "express-rate-limit";
import { API_KEYS } from "../config/apiKeys.js";
import { PLANS } from "../config/plans.js";

const limiters = {};

export function getRateLimiter(apiKey) {
    const planName = API_KEYS[apiKey];
    const plan = PLANS[planName] || PLANS.basic;

    if (!limiters[apiKey]) {
        limiters[apiKey] = rateLimit({
            windowMs: 60 * 1000,
            max: plan.limitPerMinute,
            message: { error: "Too many requests for your plan, please wait." },
            standardHeaders: true,
            legacyHeaders: false,
        });
    }

    return limiters[apiKey];
}
