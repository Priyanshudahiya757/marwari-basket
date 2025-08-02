// rateLimit.js - Simple in-memory rate limiting middleware
// For production, use Redis or a distributed store
const rateLimitMap = new Map();

module.exports = (req, res, next) => {
  const key = req.ip + req.path;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const max = 5;
  if (!rateLimitMap.has(key)) rateLimitMap.set(key, []);
  const timestamps = rateLimitMap.get(key).filter(ts => now - ts < windowMs);
  if (timestamps.length >= max) {
    return res.status(429).json({ message: 'Too many requests, try again later.' });
  }
  timestamps.push(now);
  rateLimitMap.set(key, timestamps);
  next();
}; 