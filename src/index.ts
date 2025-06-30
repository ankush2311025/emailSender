import { EmailService } from "./EmailService";
import { MockProviderA } from "./providers/MockProviderA";
import { MockProviderB } from "./providers/MockProviderB";

const service = new EmailService([new MockProviderA(), new MockProviderB()]);

const email = {
  id: "123",
  to: "test@example.com",
  subject: "Hello!",
  body: "This is a test email."
};

service.sendEmail(email);