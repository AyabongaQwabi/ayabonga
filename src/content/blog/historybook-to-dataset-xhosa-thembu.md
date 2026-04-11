---
title: "historybook-to-dataset — From PDF History Books to LLM Training Data"
excerpt: "Open-source pipeline for Xhosa Thembu texts, Ollama Q&A triples, Hugging Face datasets, and the Nomava YouTube channel."
date: March 25, 2026
readTime: 8 min read
tags: Machine learning, isiXhosa, Thembu, Ollama, Hugging Face, Open source
categories: AI, Culture
---

I built a small, focused open-source utility called historybook-to-dataset specifically to turn historical books (PDFs) into high-quality machine-learning datasets for fine-tuning LLMs:

🔗 https://github.com/AyabongaQwabi/historybook_to_dataset

What it actually does (no fluff)
Takes a PDF history book as input.
Extracts clean text using PyPDF2.
Intelligently chunks the content.
Filters for historically relevant sections using a customizable keywords.txt file (e.g., "xhosa", "thembu", "maqoma", "nongqause", "cattle-killing" etc.).
Uses a local Ollama model (default: Llama 3.1, but you can swap to Mistral etc.) to generate contextual instruction + input + output Q&A triples per chunk.
Runs in parallel with multi-threading (`--max-workers`), supports resuming from checkpoints if interrupted.
Deduplicates similar pairs for better quality.
Outputs everything in clean JSONL format — perfect for Hugging Face datasets, Alpaca-style fine-tuning, ShareGPT etc.

Example command that I used:

python history_to_dataset.py "thembu_history_book.pdf" "thembu_dataset.jsonl" --model-name llama3.1 --max-workers 6

The README is straightforward, covers Ollama setup, spaCy model download, troubleshooting (Ollama not reachable? Check port 11434), and even has logging for raw model responses so you can debug quality.

I ran this pipeline on three key Xhosa Thembu historical texts and pushed the resulting datasets publicly on Hugging Face:

1. Xhosa Thembu History – Wagenaar

https://huggingface.co/datasets/ayabongaqwabi/xhosa_thembu_history_wagenaar

2. Xhosa Thembu History – Yekela

https://huggingface.co/datasets/ayabongaqwabi/xhosa_thembu_history_yekela

3. Xhosa Thembu History – Sihele

https://huggingface.co/datasets/ayabongaqwabi/xhosa_thembu_history_sihele

These are still early versions — mostly chapter-based Q&A pairs with some instruction variations — but they form a solid foundation of structured isiXhosa historical knowledge (kings, clans, events, customs, land & resistance narratives).

Next chapter:

I’m gearing up to grab a Google Colab Pro / Pro+ subscription so I can run proper fine-tuning sessions without the free-tier timeouts killing momentum every 90 minutes. The dream is to fine-tune (or heavily LoRA-adapt) a capable smaller model that becomes really strong at Xhosa history, genealogy, izibongo (praise poetry), traditional governance, oral traditions, and contextual isiXhosa reasoning.

All of this feeds straight into Nomava — my YouTube channel focused on sharing indigenous Xhosa knowledge authentically, in isiXhosa, grounded in primary sources and oral accounts (no lazy translations 😂):

📺 https://www.youtube.com/@NomavaTV

If the fine-tune lands well, the model could help with accurate video summaries, answer viewer questions from historical context, suggest episode ideas based on patterns in the data, or even assist with script outlines in natural, idiomatic isiXhosa.

Still very scrappy, solo grind, but meaningful.

One love, keep preserving and building,

Ayabonga Qwabi

(Software Architect • Product Builder • Keeping isiXhosa memory alive through code)
