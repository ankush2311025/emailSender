"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = require("./EmailService");
const MockProviderA_1 = require("./providers/MockProviderA");
const MockProviderB_1 = require("./providers/MockProviderB");
const service = new EmailService_1.EmailService([new MockProviderA_1.MockProviderA(), new MockProviderB_1.MockProviderB()]);
const email = {
    id: "123",
    to: "test@example.com",
    subject: "Hello!",
    body: "This is a test email."
};
service.sendEmail(email);
