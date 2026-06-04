---
title: "What is LLM finetuning? (and when you actually need it)"
excerpt: "Finetuning is not prompting harder. It is retraining the model's weights on your data. Here is what it changes, what it costs, and when RAG or a better system prompt is enough."
date: June 4, 2026
readTime: 8 min read
slug: what-is-llm-finetuning
tags: LLMs, Finetuning, AI, Machine Learning, South Africa
categories: AI, Engineering
headerImage: /images/blog/llm-finetuning-neural-network.jpg
ogImage: /images/blog/llm-finetuning-neural-network.jpg
seoTitle: "What is LLM Finetuning? A Practical Guide for Builders"
seoDescription: "LLM finetuning explained: what it does, when you need it vs RAG or prompting, costs, and practical examples for South African AI builders in 2026."
---

Most people encounter finetuning when they want their model to behave differently and someone on the internet says to finetune it. Before you spend on compute or a training run, it is worth understanding what finetuning actually changes — and what it does not.

## The short version

A base large language model is trained on massive amounts of text. Finetuning takes that already-trained model and trains it further on a smaller, targeted dataset — your data — to adjust its behaviour, style, or task performance.

Think of the base model as someone who read the whole internet. Finetuning is the focused apprenticeship where you teach them your way of doing things.

## What finetuning actually changes

Finetuning adjusts the model's weights — the numerical parameters that determine how it responds. After finetuning, the model genuinely behaves differently. It is not following a longer prompt. Its outputs are shaped by what it learned from your training examples.

This matters when you need:

- A consistent **tone or style** that a system prompt cannot reliably hold across long outputs
- Domain-specific **terminology** the base model gets wrong — clinical, legal, isiXhosa, industry-specific vocab
- A particular **output format** the model handles poorly even with few-shot examples
- A smaller, cheaper model that matches a larger model's performance on your specific narrow task

## What finetuning does not change

This is where money gets wasted.

Finetuning does not reliably update the model's **knowledge**. If you finetune on documents that say product X is blue, the model may learn the pattern but it will not update its factual memory the way humans learn new facts. Knowledge injection is RAG territory.

Finetuning also does not fix bad prompting. A model that keeps refusing your use case or hallucinating in a predictable way is usually a system prompt or retrieval problem — not a finetuning candidate.

## RAG vs finetuning

This question comes up constantly in agent work.

**Use RAG when** the model needs to know facts, documents, or data it was not trained on — your policy docs, product catalogue, client records, anything that changes over time.

**Use finetuning when** the model needs to behave a certain way — write in a specific format, use your brand voice, follow a structured output schema more reliably, or specialise in a narrow task class.

**Use both when** you want consistent behaviour on a task (finetuning) that requires current or private knowledge (RAG). This is the production pattern that actually ships in serious products.

## What it costs in 2026

Three layers.

**Data prep** is usually the most expensive part. You need labelled input/output pairs that demonstrate the behaviour you want. Quality matters more than quantity. A few hundred high-quality examples often beats thousands of noisy ones. Writing and curating that dataset is real work.

**Compute** — cloud providers offer managed finetuning runs (OpenAI, Google, AWS Bedrock, Azure AI). Depending on model size and dataset, a run ranges from tens to hundreds of dollars. Larger models cost more.

**Inference** — finetuned hosted models typically cost more per token than base models. Budget for ongoing inference, not just the one-time training run.

For most SA product teams, the real cost is not the compute spend. It is the engineering time to prepare data, run evaluations, and debug regressions when the new model breaks things the old one handled fine.

## The Mzansi angle

If you are building AI that speaks to South African users in isiXhosa, Zulu, Sotho, or code-switching mixed registers — finetuning is genuinely worth exploring.

Base models are bad at local register. They can translate, but they cannot talk the way someone from Mthatha talks to their neighbour. The [UCT MzansiLM research](https://www.qwabi.co.za/blog/mzansi-llm-local-language-model) is directly relevant here — their 125M parameter model, finetuned for specific tasks, outperformed encoder-decoder models over 10x its size on isiXhosa benchmarks. Domain-specific data beats scale.

Finetuning on real local dialogue samples — not formal isiXhosa textbook data, but actual conversational register — is one of the few cases where you get meaningful improvement over a smart system prompt.

## When you probably do not need it

Most use cases do not. If a well-written system prompt and a few examples get you 80% of the way there, start there. Finetuning is expensive to maintain — every time you want to change the behaviour, you are potentially re-running training.

Use finetuning as a second or third intervention, not the first. The decision tree:

1. Can a clear system prompt get you most of the way? → Try that first.
2. Are few-shot examples helping? → Add more, better examples to your prompt.
3. Is the problem about facts or live data? → Build RAG before finetuning.
4. Is the base model still structurally wrong for the task? → Now you are a finetuning candidate.
5. Do you have the dataset and budget for training plus ongoing inference? → Then do it properly.

If you are at step 4 or 5 on something in the SA context, I am happy to talk through the data strategy before you commit to compute spend.
