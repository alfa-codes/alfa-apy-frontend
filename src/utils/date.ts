/**
 * Formats a timestamp from nanoseconds to a localized date string
 * @param timestamp - Timestamp in nanoseconds (bigint)
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: bigint): string {
  // Convert nanoseconds to milliseconds (1 nanosecond = 10^-6 milliseconds)
  const milliseconds = Number(timestamp) / 1_000_000;
  return new Date(milliseconds).toLocaleString();
}
