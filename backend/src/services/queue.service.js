import { Queue } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

const connection = {
  url: process.env.REDIS_URI,
  // Tell Redis it's okay to evict some keys if we run out of memory (suppresses BullMQ warning for free redis instances)
  maxRetriesPerRequest: null,
};

export const sessionQueue = new Queue("session-recording", { connection });

/**
 * Adds a new session recording job to the queue
 * @param {Object} jobData - The data payload for the job
 * @returns {Promise<Job>}
 */
export const addSessionJob = async (jobData) => {
  return await sessionQueue.add("record-session", jobData, {
    removeOnComplete: true, // Don't store completed jobs forever
    removeOnFail: 100,      // Keep last 100 failed jobs for debugging
    attempts: 3,            // Retry failed jobs up to 3 times
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  });
};
