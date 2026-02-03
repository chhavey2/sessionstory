import zlib from "zlib";
import { promisify } from "util";

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

/**
 * Compresses an object or array into a Gzip buffer
 * @param {any} data - The data to compress
 * @returns {Promise<Buffer>}
 */
export async function compress(data) {
  try {
    const jsonString = JSON.stringify(data);
    return await gzip(jsonString);
  } catch (error) {
    console.error("Compression error:", error);
    throw error;
  }
}

/**
 * Decompresses a Gzip buffer back into its original form
 * @param {Buffer} buffer - The compressed buffer
 * @returns {Promise<any>}
 */
export async function decompress(buffer) {
  try {
    const decompressed = await gunzip(buffer);
    return JSON.parse(decompressed.toString());
  } catch (error) {
    console.error("Decompression error:", error);
    return null;
  }
}
