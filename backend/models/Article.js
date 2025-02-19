const mongoose = require("mongoose");
const redis = require("redis");
const mongooseRedisCache = require("mongoose-redis-cache");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

mongooseRedisCache(mongoose, {
  client: redisClient,
  ttl: 30 
});

const articleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    text: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  image: String,
  tags: [{ 
    type: String 
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  views: { 
    type: Number, 
    default: 0 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

articleSchema.index({ title: 1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ createdAt: -1 });

articleSchema.set("cache", true);
articleSchema.set("ttl", 30);

module.exports = mongoose.model("Article", articleSchema);