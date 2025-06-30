import { Provider } from "./Provider";

export class MockProviderB implements Provider {
  name = "ProviderB";

  async send(to: string, subject: string, body: string): Promise<void> {
    if (Math.random() < 0.5) {
      throw new Error("Simulated failure B");
    }
    console.log(`ProviderB sent email to ${to}`);
  }
}