import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { LLM_CONFIG } from '../config.js';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function completeJson<T>(
  messages: ChatMessage[],
  options?: { temperature?: number },
): Promise<T> {
  const raw = await completeText(messages, {
    ...options,
    jsonMode: true,
  });
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned) as T;
}

export async function completeText(
  messages: ChatMessage[],
  options?: { temperature?: number; jsonMode?: boolean },
): Promise<string> {
  const temperature = options?.temperature ?? 0.55;

  if (LLM_CONFIG.provider === 'anthropic') {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error('ANTHROPIC_API_KEY is required when BLOG_LLM_PROVIDER=anthropic');
    }
    const client = new Anthropic({ apiKey: key });
    const system = messages.find((m) => m.role === 'system')?.content;
    const userMessages = messages.filter((m) => m.role !== 'system');

    const response = await client.messages.create({
      model: LLM_CONFIG.anthropicModel,
      max_tokens: 16_000,
      temperature,
      system: system ?? undefined,
      messages: userMessages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    });

    const block = response.content.find((b) => b.type === 'text');
    if (!block || block.type !== 'text') {
      throw new Error('Anthropic returned no text block');
    }
    return block.text.trim();
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('OPENAI_API_KEY is required when BLOG_LLM_PROVIDER=openai');
  }

  const client = new OpenAI({ apiKey: key });
  const response = await client.chat.completions.create({
    model: LLM_CONFIG.openaiModel,
    temperature,
    response_format: options?.jsonMode ? { type: 'json_object' } : undefined,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('OpenAI returned empty completion');
  }
  return text;
}
