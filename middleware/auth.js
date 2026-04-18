const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  const serverKey = process.env.ADMIN_API_KEY;

  if (!serverKey) {
    console.warn("ADMIN_API_KEY is not set in environment variables.");
  }

  // Allow passing if it matches
  if (apiKey && apiKey === serverKey) {
    return next();
  }

  return res.status(403).json({ 
    success: false, 
    message: "Access denied. Invalid or missing API Key." 
  });
};

module.exports = { apiKeyMiddleware };
