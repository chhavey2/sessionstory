import { Worker } from "bullmq";
import dotenv from "dotenv";
import { hitSession } from "../services/session.service.js";

dotenv.config();

const connection = {
  url: process.env.REDIS_URI,
  // Tell Redis it's okay to evict some keys if we run out of memory (suppresses BullMQ warning for free redis instances)
  maxRetriesPerRequest: null,
};

export const sessionWorker = new Worker(
  "session-recording",
  async (job) => {
    try {
      const { sessionId, fp, userId, events, ip, url } = job.data;
      
      console.log(`Processing job ${job.id} for session ${sessionId}`);
      
      // Perform the heavy database work here
      await hitSession(sessionId, fp, userId, events, ip, url);
      
      console.log(`Completed job ${job.id} for session ${sessionId}`);
      return { success: true, sessionId };
    } catch (error) {
      console.error(`Failed job ${job.id}:`, error);
      throw error; // Let BullMQ handle retries
    }
  },
  { 
    connection,
    // Concurrency controls how many jobs to process simultaneously
    concurrency: 5 
  }
);

sessionWorker.on("completed", (job) => {
  // Optional: Add logging or metrics here if needed
});

sessionWorker.on("failed", (job, err) => {
  console.error(`${job.id} has failed with ${err.message}`);
});
