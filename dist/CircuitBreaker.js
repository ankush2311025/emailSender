"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
class CircuitBreaker {
    constructor(threshold, timeout) {
        this.failureCounts = new Map();
        this.timeouts = new Map();
        this.threshold = threshold;
        this.timeout = timeout;
    }
    allow(providerName) {
        const now = Date.now();
        const timeout = this.timeouts.get(providerName) || 0;
        return now >= timeout;
    }
    recordFailure(providerName) {
        const fails = (this.failureCounts.get(providerName) || 0) + 1;
        this.failureCounts.set(providerName, fails);
        if (fails >= this.threshold) {
            this.timeouts.set(providerName, Date.now() + this.timeout);
            this.failureCounts.set(providerName, 0);
        }
    }
}
exports.CircuitBreaker = CircuitBreaker;
