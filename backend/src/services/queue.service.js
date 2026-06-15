import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.REDIS_URI);

/**
 * Adds a new session recording job to the queue
 * @param {Object} jobData - The data payload for the job
 * @returns {Promise<number>}
 */
export const addSessionJob = async (jobData) => {
  // Push the job data to the right side of the 'sessionstory' list
  return await redis.rpush("sessionstory", JSON.stringify(jobData));
};
