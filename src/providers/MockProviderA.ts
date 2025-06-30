import { Provider } from "./Provider";

export class MockProviderA implements Provider {
  name = "ProviderA";

  async send(to: string, subject: string, body: string): Promise<void> {
    if (Math.random() < 0.7) {
      throw new Error("Simulated failure A");
    }
    console.log(`ProviderA sent email to ${to}`);
  }
}