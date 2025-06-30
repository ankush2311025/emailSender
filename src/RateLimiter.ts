export class RateLimiter {
  private maxRequests: number;
  private interval: number;
  private timestamps: number[] = [];

  constructor(maxRequests: number, interval: number) {
    this.maxRequests = maxRequests;
    this.interval = interval;
  }

  public allow(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(ts => now - ts < this.interval);
    if (this.timestamps.length >= this.maxRequests) return false;
    this.timestamps.push(now);
    return true;
  }
}