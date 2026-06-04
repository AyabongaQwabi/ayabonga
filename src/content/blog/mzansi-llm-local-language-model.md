---
title: "Mzansi LLM: UCT built a language model for all 11 South African languages"
excerpt: "UCT researchers just shipped MzansiLM — a decoder-only language model trained on all 11 official SA languages. Here is what it is, what it actually does, and why it matters for builders."
date: June 4, 2026
readTime: 7 min read
slug: mzansi-llm-local-language-model
tags: LLMs, Mzansi, South Africa, isiXhosa, African AI, Language Models, UCT
categories: AI, Culture
seoTitle: "MzansiLM: UCT's AI Model for All 11 South African Languages"
seoDescription: "UCT built MzansiLM — a language model trained on all 11 official South African languages. What it is, how it works, and what it means for builders in Mzansi."
headerImage: /images/blog/gsc-mzansi-llm-local-language-model-hero.webp
ogImage: /images/blog/gsc-mzansi-llm-local-language-model-hero.webp
---

UCT just shipped something that has been needed for a long time. A team from the Department of Computer Science — Anri Lombard, Dr Jan Buys, Dr Francois Meyer, and Simbarashe Mawere — released MzansiLM: a decoder-only language model trained specifically on all 11 of South Africa's official written languages. It is the first publicly available model of its kind to cover all 11.

This is not a wrapper around GPT or Claude with a South African system prompt. It is a model trained from scratch on South African data.

## What was built

Two things shipped together. First, **MzansiText** — a curated multilingual dataset covering all 11 official written languages. Building the dataset was the harder, less glamorous part of the work, and it is what makes everything else possible.

Second, **MzansiLM** — a 125 million parameter decoder-only language model trained on that dataset. 125M is small by current commercial standards (GPT-4 is estimated at over a trillion parameters), but that is the point. This is a research baseline, not a product announcement.

The paper will be presented at LREC — Language Resources and Evaluation Conference — in Mallorca this month. Both the dataset and the model are [publicly available on HuggingFace](https://huggingface.co/anrilombard/mzansilm-125m).

## Why the size is not the story

The instinct when you hear "125M parameters" is to compare it to commercial models and walk away unimpressed. That misses what is actually happening here.

On isiXhosa text generation benchmarks, MzansiLM competed with encoder-decoder models more than 10 times its size. The reason is domain specificity — a model trained on South African language data will outperform a massive general model on South African language tasks, because the big model never saw enough of the right data.

Nine of the 11 official languages are considered low-resource. isiNdebele and Sepedi in particular have been largely ignored by the global research community. This model exists for them too, not just isiXhosa and isiZulu which at least had *some* prior research attention.

## What it is not

Dr Buys was direct about this in the paper: MzansiLM "can work well when fine-tuned for specific tasks but is not yet able to work well for general-purpose user interaction or instruction following, due to the limited training data."

It is not a chatbot. You cannot talk to it the way you would use Claude or ChatGPT. It is a base model — a foundation that developers can finetune for specific tasks. Think of it as the starting point, not the finished product.

What does that look like practically? A developer could finetune MzansiLM to summarise government documents in Sepedi. Or extract information from isiZulu support tickets. Or classify community forum posts across multiple languages. Tasks that are bounded, specific, and grounded — not open-ended conversation.

For those use cases, finetuning MzansiLM could be more effective and more affordable than paying per-token to a large proprietary model that barely knows the language exists.

## Why this matters for builders

The register problem in existing models is real. Base models trained on English-dominant internet data will produce isiXhosa that reads like a textbook translation. It is technically correct and culturally hollow — the [LLM tone problem](https://www.qwabi.co.za/blog/llm-tone-local-accents) I have written about before.

MzansiLM does not fully solve that problem. 125M parameters on a still-limited dataset is a start, not a finish. But it creates something that did not exist before: a public baseline that future work can compare against and build on.

The team is explicit that continued openness is how this progresses. "A lot of the progress we were able to make depends on earlier open research from the African Natural Language Processing research community," Lombard said. "Continuing that openness is essential."

If you are building products that serve South African users in their home languages — WhatsApp bots, community tools, educational platforms, support systems — MzansiLM is now part of your research reading list. Not as a drop-in solution, but as a component in a finetuning pipeline.

## The data links

- [Full paper on arXiv](https://arxiv.org/pdf/2603.20732)
- [MzansiText dataset on HuggingFace](https://huggingface.co/datasets/anrilombard/mzansi-text)
- [MzansiLM model on HuggingFace](https://huggingface.co/anrilombard/mzansilm-125m)

The model is out. The dataset is public. The next thing is builders using it for something real.
