import rateLimit from "express-rate-limit";

const defaultLimiter = rateLimit({
    windowMs: 1000,
    max: 2,
    message: 'Too many requests!'
});

const liveDataLimiter = rateLimit({
    windowMs: 60000,
    max: 2,
    message: 'Too many requests!'
});

export {defaultLimiter, liveDataLimiter}
