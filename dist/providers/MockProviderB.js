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
exports.MockProviderB = void 0;
class MockProviderB {
    constructor() {
        this.name = "ProviderB";
    }
    send(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Math.random() < 0.5) {
                throw new Error("Simulated failure B");
            }
            console.log(`ProviderB sent email to ${to}`);
        });
    }
}
exports.MockProviderB = MockProviderB;
