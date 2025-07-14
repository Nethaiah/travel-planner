export const LOCATION_IQ_API_KEY = process.env.LOCATION_IQ_API_KEY

if (!LOCATION_IQ_API_KEY) {
  throw new Error("LOCATION_IQ_API_KEY environment variable is not set")
} 