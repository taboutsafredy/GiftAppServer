
// Path: src/utils/checkSignature.ts

import { createHash, createHmac } from "crypto";

interface Request {
  body: any;
  headers: any;
}

/**
 * Verifies the signature of the incoming request from Crypto Pay.
 * @param {string} token - The app token used to generate the signature.
 * @param {Request} req - The request object containing body and headers.
 * @returns {boolean} - True if the signature is valid, false otherwise.
 */
export const checkSignature = (token: string, { body, headers }: Request): boolean => {
  const secret = createHash("sha256").update(token).digest();
  const checkString = JSON.stringify(body);
  const hmac = createHmac("sha256", secret).update(checkString).digest("hex");
  return hmac === headers["crypto-pay-api-signature"];
};

