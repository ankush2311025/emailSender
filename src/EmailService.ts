import { Provider } from "./providers/Provider";
import { RateLimiter } from "./RateLimiter";
import { CircuitBreaker } from "./CircuitBreaker";

type EmailRequest = {
  id: string;
  to: string;
  subject: string;
  body: string;
};

type Status = 'success' | 'failed' | 'retrying' | 'queued';

export class EmailService {
  private providers: Provider[];
  private sentIds = new Set<string>();
  private rateLimiter = new RateLimiter(5, 1000);
  private statusMap = new Map<string, Status>();
  private circuitBreaker: CircuitBreaker;

  constructor(providers: Provider[]) {
    this.providers = providers;
    this.circuitBreaker = new CircuitBreaker(3, 10000);
  }

  public getStatus(id: string): Status | undefined {
    return this.statusMap.get(id);
  }

  public async sendEmail(email: EmailRequest) {
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
        await this.sendWithRetry(provider, email);
        this.statusMap.set(email.id, "success");
        this.sentIds.add(email.id);
        return;
      } catch (err) {
        console.log(`Provider ${provider.name} failed:`, err);
        this.circuitBreaker.recordFailure(provider.name);
      }
    }

    this.statusMap.set(email.id, "failed");
    console.log("All providers failed to send the email.");
  }

  private async sendWithRetry(provider: Provider, email: EmailRequest) {
    let retries = 3;
    let delay = 500;

    for (let i = 0; i < retries; i++) {
      try {
        await provider.send(email.to, email.subject, email.body);
        return;
      } catch {
        if (i < retries - 1) {
          await new Promise(res => setTimeout(res, delay));
          delay *= 2;
        } else {
          throw new Error("All retries failed");
        }
      }
    }
  }
}