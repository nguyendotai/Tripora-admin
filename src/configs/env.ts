// `||` not `??` — an env var set to an empty string on the hosting platform must also
// fall back, otherwise fetch() calls resolve to a relative path and crash at build/request time.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5550/api/v1";
