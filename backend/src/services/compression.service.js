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
    if (!buffer) return null;

    // Convert MongoDB Binary or other objects to Node Buffer
    let input;
    if (Buffer.isBuffer(buffer)) {
      input = buffer;
    } else if (buffer.buffer && Buffer.isBuffer(buffer.buffer)) {
      input = buffer.buffer;
    } else {
      input = Buffer.from(buffer);
    }

    // Check for Gzip magic bytes (0x1f, 0x8b)
    if (input.length < 2 || input[0] !== 0x1f || input[1] !== 0x8b) {
      // Not a Gzip buffer, try to parse as raw JSON in case it was stored incorrectly
      try {
        return JSON.parse(input.toString());
      } catch (e) {
        return null;
      }
    }

    const decompressed = await gunzip(input);
    return JSON.parse(decompressed.toString());
  } catch (error) {
    console.error("Decompression error:", error);
    return null;
  }
}
