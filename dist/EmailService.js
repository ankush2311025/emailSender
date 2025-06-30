"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const RateLimiter_1 = require("./RateLimiter");
const CircuitBreaker_1 = require("./CircuitBreaker");
class EmailService {
    constructor(providers) {
        this.sentIds = new Set();
        this.rateLimiter = new RateLimiter_1.RateLimiter(5, 1000);
        this.statusMap = new Map();
        this.providers = providers;
        this.circuitBreaker = new CircuitBreaker_1.CircuitBreaker(3, 10000);
    }
    getStatus(id) {
        return this.statusMap.get(id);
    }
    sendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sentIds.has(email.id)) {
                console.log(`Skipping duplicate email: ${email.id}`);
                return;
            }
            if (!this.rateLimiter.allow()) {
                console.log(`Rate limit exceeded. Queuing email: ${email.id}`);
                this.statusMap.set(email.id, "queued");
                setTimeout(() => this.sendEmail(email), 1000);
                return;
            }
            for (let i = 0; i < this.providers.length; i++) {
                const provider = this.providers[i];
                if (!this.circuitBreaker.allow(provider.name)) {
                    continue;
                }
                try {
                    this.statusMap.set(email.id, "retrying");
                    yield this.sendWithRetry(provider, email);
                    this.statusMap.set(email.id, "success");
                    this.sentIds.add(email.id);
                    return;
                }
                catch (err) {
                    console.log(`Provider ${provider.name} failed:`, err);
                    this.circuitBreaker.recordFailure(provider.name);
                }
            }
            this.statusMap.set(email.id, "failed");
            console.log("All providers failed to send the email.");
        });
    }
    sendWithRetry(provider, email) {
        return __awaiter(this, void 0, void 0, function* () {
            let retries = 3;
            let delay = 500;
            for (let i = 0; i < retries; i++) {
                try {
                    yield provider.send(email.to, email.subject, email.body);
                    return;
                }
                catch (_a) {
                    if (i < retries - 1) {
                        yield new Promise(res => setTimeout(res, delay));
                        delay *= 2;
                    }
                    else {
                        throw new Error("All retries failed");
                    }
                }
            }
        });
    }
}
exports.EmailService = EmailService;
