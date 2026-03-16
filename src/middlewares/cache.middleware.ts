import { Request, Response, NextFunction } from "express";
import redis from "../configs/redis.config.js";

export const cache =
  (ttl: number = 3600) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
      // Intercept res.json to store in Redis before sending
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (res.statusCode === 200) {
          redis.setex(key, ttl, JSON.stringify(body));
        }
        return originalJson(body);
      };
      next();
    } catch {
      next(); // Redis failure should never block the request
    }
  };

export const invalidateCache = async (patterns: string[]) => {
  for (const pattern of patterns) {
    const keys = await redis.keys(`cache:${pattern}`);
    if (keys.length) await redis.del(...keys);
  }
};
