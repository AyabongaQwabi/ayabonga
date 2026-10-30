import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomUUID,
} from "node:crypto";
import { put } from "@vercel/blob";
import type { SamsungResultsBatch } from "../../src/lib/samsung-test-results-schema";
export const RESULTS_PREFIX = "samsung-intent-results/v1/";
export type ResultsEnvelope = {
  version: 1;
  algorithm: "aes-256-gcm";
  iv: string;
  tag: string;
  ciphertext: string;
};
function encryptionKey(secret: string) {
  return createHash("sha256")
    .update("samsung-intent-results:v1\0")
    .update(secret)
    .digest();
}
export function encryptResults(
  value: unknown,
  secret: string,
): ResultsEnvelope {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(secret), iv);
  const bytes = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return {
    version: 1,
    algorithm: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    ciphertext: bytes.toString("base64"),
  };
}
export function decryptResults(
  envelope: ResultsEnvelope,
  secret: string,
): unknown {
  if (envelope.version !== 1 || envelope.algorithm !== "aes-256-gcm")
    throw new Error("Unknown report format");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(secret),
    Buffer.from(envelope.iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  return JSON.parse(
    Buffer.concat([
      decipher.update(Buffer.from(envelope.ciphertext, "base64")),
      decipher.final(),
    ]).toString("utf8"),
  );
}
export async function storeResults(batch: SamsungResultsBatch) {
  const token =
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) throw new Error("Results storage is not configured");
  const receiptId = randomUUID();
  const envelope = encryptResults(
    { receiptId, receivedAt: new Date().toISOString(), batch },
    process.env.SAMSUNG_RESULTS_ENCRYPTION_KEY?.trim() || token,
  );
  // Existing store is public: only authenticated ciphertext is uploaded, never raw test data.
  await put(`${RESULTS_PREFIX}${receiptId}.json`, JSON.stringify(envelope), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
    token,
  });
  return receiptId;
}
