export interface Provider {
  name: string;
  send(to: string, subject: string, body: string): Promise<void>;
}