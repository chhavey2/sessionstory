import Redis from "ioredis";
import dotenv from "dotenv";
import { hitSession } from "../services/session.service.js";

dotenv.config();

const redis = new Redis(process.env.REDIS_URI);

const processQueue = async () => {
  console.log("Worker started, waiting for jobs on 'sessionstory' queue...");
  
  while (true) {
    try {
      // blpop blocks until an element is available in the queue, or timeout (0 means wait forever)
      const result = await redis.blpop("sessionstory", 0);
      
      if (result) {
        // result is an array [queueName, value]
        const [, jobDataString] = result;
        const jobData = JSON.parse(jobDataString);
        
        const { sessionId, fp, userId, events, ip, url } = jobData;
        console.log(`Processing session ${sessionId}`);
        
        // Perform the heavy database work here
        await hitSession(sessionId, fp, userId, events, ip, url);
        
        console.log(`Completed processing session ${sessionId}`);
      }
    } catch (error) {
      console.error(`Error processing job:`, error);
      // Wait a bit before trying again if there's an error (e.g. redis connection issue)
      await new Promise(resolve => setTimeout(result => resolve(), 5000));
    }
  }
};

// Start processing
processQueue();
