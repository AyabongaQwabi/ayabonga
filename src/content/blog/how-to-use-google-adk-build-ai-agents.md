---
title: "How to use the Google Agent Development Kit to build AI agents"
excerpt: "Google's ADK gives you orchestration, tool routing, session state, and multi-agent coordination in one framework. Here is how to actually use it — from install to a working agent loop."
date: June 4, 2026
readTime: 10 min read
slug: how-to-use-google-adk-build-ai-agents
tags: Google ADK, AI Agents, Python, Gemini, South Africa, Tooling
categories: AI, Engineering
headerImage: /images/blog/google-adk-ai-agents-developer.jpg
ogImage: /images/blog/google-adk-ai-agents-developer.jpg
seoTitle: "How to Build AI Agents with Google ADK (Agent Development Kit)"
seoDescription: "Step-by-step guide to building AI agents with Google's Agent Development Kit (ADK) in 2026: install, tools, orchestration, session state, and multi-agent patterns."
---

Google's Agent Development Kit (ADK) is a Python framework for building AI agents that can use tools, coordinate across sub-agents, and maintain session state. If you have been building with raw LangChain chains or ad-hoc OpenAI tool loops, ADK gives you proper orchestration primitives without the complexity overhead.

This is a practical walkthrough — install to a working agent loop — based on real use in production work.

## What ADK actually is

ADK is not a wrapper around the Gemini API. It is a framework for building agents that can:

- Call external tools (functions you define) based on LLM decisions
- Route tasks between a coordinator agent and specialist sub-agents
- Maintain session state across multiple turns
- Stream responses and tool outputs progressively

It is opinionated about structure in a way that saves you from building plumbing yourself, but you still own your tools and your business logic.

It works primarily with Gemini models, which is the main lock-in consideration. If you are on OpenAI or Anthropic for your existing products, weigh that before committing to ADK for orchestration.

## Install and setup

```bash
pip install google-adk
```

You will need a Google Cloud project with the Generative AI API enabled, or a Gemini API key from Google AI Studio.

```python
import os
os.environ["GOOGLE_API_KEY"] = "your-key-here"
```

For production, use Secret Manager or environment config — not a hardcoded key.

## Your first agent

The core primitive is `Agent`. You give it a name, a model, an instruction, and a list of tools.

```python
from google.adk.agents import Agent
from google.adk.tools import FunctionTool

def get_order_status(order_id: str) -> dict:
    """Look up the status of an order by ID."""
    # Your real DB/API call goes here
    return {"order_id": order_id, "status": "in_transit", "eta": "2026-06-07"}

agent = Agent(
    name="support_agent",
    model="gemini-2.0-flash",
    instruction="""
        You are a customer support agent for a South African logistics platform.
        When a customer asks about their order, use the get_order_status tool.
        Always confirm the order ID before checking. Be concise.
    """,
    tools=[FunctionTool(get_order_status)]
)
```

The tool docstring matters — ADK passes it to the LLM so it knows when and how to call the function. Write it as if you are explaining the tool to a junior developer.

## Running the agent

```python
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService

session_service = InMemorySessionService()
runner = Runner(agent=agent, session_service=session_service, app_name="support")

# Create a session
session = runner.session_service.create_session(app_name="support", user_id="user_001")

# Send a message
from google.adk.types import Content, Part
message = Content(role="user", parts=[Part(text="Where is order ORD-2891?")])

for event in runner.run(user_id="user_001", session_id=session.id, new_message=message):
    if event.is_final_response():
        print(event.response.parts[0].text)
```

The `runner.run()` method is a generator — you iterate over events, which include tool calls, tool results, and the final response. This lets you stream output or log intermediate steps.

## Adding session state

Session state lets you persist context across turns without re-sending full history.

```python
from google.adk.agents import Agent
from google.adk.tools import FunctionTool

def remember_preference(key: str, value: str, tool_context) -> str:
    """Store a user preference in session state."""
    tool_context.state[key] = value
    return f"Noted: {key} = {value}"

def get_preference(key: str, tool_context) -> str:
    """Retrieve a stored user preference."""
    return tool_context.state.get(key, "not set")

agent = Agent(
    name="personalised_agent",
    model="gemini-2.0-flash",
    instruction="Help users with their preferences. Remember things they tell you.",
    tools=[FunctionTool(remember_preference), FunctionTool(get_preference)]
)
```

`tool_context.state` is a dict scoped to the session. For production, swap `InMemorySessionService` for a database-backed implementation — ADK's session service is pluggable.

## Multi-agent coordination

This is where ADK earns its place over raw tool loops. You can define a coordinator that routes to specialist sub-agents.

```python
from google.adk.agents import Agent
from google.adk.tools import AgentTool

billing_agent = Agent(
    name="billing_agent",
    model="gemini-2.0-flash",
    instruction="Handle billing questions, invoices, and payment queries.",
)

logistics_agent = Agent(
    name="logistics_agent",
    model="gemini-2.0-flash",
    instruction="Handle order tracking, delivery estimates, and courier queries.",
)

coordinator = Agent(
    name="coordinator",
    model="gemini-2.0-flash",
    instruction="""
        Route customer queries to the right specialist.
        Billing questions go to billing_agent.
        Delivery and order questions go to logistics_agent.
        Handle simple greetings yourself.
    """,
    tools=[
        AgentTool(agent=billing_agent),
        AgentTool(agent=logistics_agent),
    ]
)
```

The coordinator LLM decides which sub-agent to call based on the query. Each sub-agent can have its own tools, instruction, and context. This pattern scales well — you add specialists without touching the coordinator's core logic.

## What I have learned in production

A few things that bit me on the [Queens Connect work](https://www.qwabi.co.za/blog/google-adk-production-lessons) and other ADK deployments:

**Tool docstrings are prompt engineering.** The quality of the docstring directly affects whether the LLM calls the right tool at the right time. Treat them as seriously as your agent instruction.

**Granular tools beat monolithic ones.** A `get_order_status` tool and a `cancel_order` tool are better than a single `manage_order` tool. The LLM makes better routing decisions when tool scope is narrow.

**Pre-load session context on start.** If the user has existing account data, inject it into session state at session creation rather than waiting for the agent to discover it through tool calls. Faster, fewer tokens.

**Log everything in development.** ADK events give you visibility into every tool call and result. Use it. You will catch routing failures and unexpected LLM decisions that a final-response-only view hides.

**Gemini coupling is real.** If you need model portability — running on Claude for cost or Llama for on-premise — ADK is not the right orchestrator. LangGraph or a thinner custom loop gives you more flexibility.

## When ADK fits

ADK is a good choice when:

- You are committed to the Google Cloud / Gemini ecosystem
- You need multi-agent coordination with clean routing logic
- Session persistence and tool observability matter
- Python is your backend language

It is less suited to polyglot teams, strict model agnosticism requirements, or projects where the overhead of the framework exceeds the complexity of the agent work.

For SA product teams building operations tooling, support agents, or document automation — ADK gives you a production-ready skeleton faster than rolling your own. The multi-agent pattern in particular is useful once you have more than three or four tools and your coordinator prompt starts getting unwieldy.
