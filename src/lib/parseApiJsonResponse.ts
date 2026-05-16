export async function parseApiJsonResponse(
  response: Response,
): Promise<Record<string, unknown>> {
  const text = await response.text();

  if (!text.trim()) {
    if (!response.ok) {
      throw new Error(
        'Could not reach the quote API. If you are developing locally, restart with npm run dev and ensure RESEND_API_KEY is in .env.local.',
      );
    }
    return {};
  }

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error('The server returned an invalid response. Try again in a moment.');
  }
}
