export class CircuitBreaker {
  private failureCounts: Map<string, number> = new Map();
  private timeouts: Map<string, number> = new Map();
  private threshold: number;
  private timeout: number;

  constructor(threshold: number, timeout: number) {
    this.threshold = threshold;
    this.timeout = timeout;
  }

  allow(providerName: string): boolean {
    const now = Date.now();
    const timeout = this.timeouts.get(providerName) || 0;
    return now >= timeout;
  }

  recordFailure(providerName: string) {
    const fails = (this.failureCounts.get(providerName) || 0) + 1;
    this.failureCounts.set(providerName, fails);

    if (fails >= this.threshold) {
      this.timeouts.set(providerName, Date.now() + this.timeout);
      this.failureCounts.set(providerName, 0);
    }
  }
}