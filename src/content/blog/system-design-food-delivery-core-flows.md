---
title: Food Delivery System Design
excerpt: Food delivery system design for search, dispatch, and checkout. Elasticsearch catalogs, geo-sharded driver state, order assignment, and idempotent payments.
date: May 27, 2026
readTime: 17 min read
slug: system-design-food-delivery-core-flows
tags: food delivery system design, Elasticsearch architecture, driver matching, payment idempotency, system design interview
categories: Engineering
headerImage: /images/blog/Microservice_Architecture.png
ogImage: /images/blog/Microservice_Architecture.png
dateModified: May 27, 2026
---

Food delivery system design splits into three pain points that fail independently: search has to feel instant, driver assignment cannot double-book, checkout cannot double-charge.

I draw the same three pillars in design reviews and regional rollout plans. I am [Ayabonga Qwabi](https://www.qwabi.co.za/). For platform builds, [custom software and cloud architecture](https://www.qwabi.co.za/solutions/custom-software-development-company-south-africa) is where I spend most delivery time.

## Scope before boxes

One deep session might cover only:

- search for restaurants and menu items
- driver matching when pickup is ready
- customer payment capture

Menu authoring, kitchen hardware, and full dispatch ops can be parallel programs so the core story stays legible.

```mermaid
flowchart LR
  S[Search]
  D[Driver match]
  P[Customer payment]
  S --> CART[Cart and checkout]
  CART --> P
  CART --> D
```

## Non-functional split for food delivery system design

- Search: low latency, high availability, **eventual** catalog mirrors with a written **SLA** on how stale menu text can be
- Driver matching: **stronger consistency** than search. Two drivers on one order is worse than a late special.
- Payments: **strong consistency** and **idempotency** so retries never create duplicate charges

```mermaid
flowchart TB
  subgraph search [Search]
    S1[Low latency]
    S2[Eventual consistency OK]
  end
  subgraph drivers [Driver matching]
    D1[Moderate latency budget]
    D2[Higher consistency]
  end
  subgraph pay [Payments]
    P1[Synchronous user path]
    P2[Strong consistency and idempotency]
  end
```

## Macro architecture

I default to **microservices** behind a **gateway or load balancer** so a lunch-hour search spike does not starve checkout, and checkout spikes do not starve driver sockets.

```mermaid
flowchart TB
  C[Customer apps]
  LB[Load balancer or gateway]
  SS[Search service]
  OS[Order service]
  DS[Delivery and matching service]
  PAY[Payment service]
  SQL[(Orders SQL)]
  IDX[(Search index)]
  LOC[(Driver location store)]

  C --> LB
  LB --> SS --> IDX
  LB --> OS --> SQL
  LB --> PAY
  OS --> DS
  DS --> LOC
```

## Search with Elasticsearch or OpenSearch

For restaurant and dish text I reach for **Elasticsearch** or **OpenSearch**: analyzers, ranking, and horizontal growth are first-class.

Catalog changes flow through CDC or an outbox into index workers on a **cadence** you can defend in cost terms. I do not full reindex the planet on every price tweak unless the business truly demands it.

```mermaid
flowchart LR
  ADMIN[Menu admin writes]
  ADMIN --> BUS[Change feed or CDC]
  BUS --> SYNC[Index updater workers]
  SYNC --> IDX2[Elasticsearch cluster]
  CUST[Customer query]
  CUST --> SS2[Search service]
  SS2 --> IDX2
```

### Search request sequence

```mermaid
sequenceDiagram
  participant U as Customer
  participant G as Gateway
  participant S as Search service
  participant I as Index cluster

  U->>G: text query near location
  G->>S: authenticated search
  S->>I: DSL query with geo filter
  I-->>S: ranked hits
  S-->>G: restaurant and item cards
  G-->>U: results under target latency
```

## Driver matching and live location

Drivers on shift need a **session-style** channel, not polling every second. **WebSockets** or an equivalent stream carry presence and assignment events.

Location writes should not fire on every GPS tick. The client can batch until the driver moves a meaningful distance from the last posted point.

```mermaid
flowchart TB
  DRV[Driver app]
  DRV -->|websocket session| EDGE[Gateway]
  EDGE --> DS[Delivery service]
  DS --> LOC2[Driver location store]
```

Shard driver locations by **region cells** so a Seattle dispatch query never scans New York rows.

```mermaid
flowchart TB
  ODR[Order ready event]
  ODR --> DS3[Delivery service]
  DS3 --> Q[Query geo shard for online drivers]
  Q --> PICK[Pick closest eligible driver]
```

## One driver per active order

Authoritative **order state** lives in SQL or another transactional store. Assignment uses an explicit **order to driver** mapping.

Before assign:

- order still unassigned
- driver online and, if that is the rule, not already carrying another order

```mermaid
stateDiagram-v2
  [*] --> ReadyForPickup
  ReadyForPickup --> Assigned: select driver
  Assigned --> PickedUp: driver confirms
  PickedUp --> Delivered
  Assigned --> ReadyForPickup: driver cancel clears link
```

### Order-driver store for point reads

A narrow mapping from order id to driver id keeps the happy path to a **single-point read**. A reverse driver-to-order index can speed other reads if you accept **dual-write** cost.

```mermaid
erDiagram
  ORDER ||--o| DRIVER_ASSIGNMENT : has
  DRIVER ||--o| DRIVER_ASSIGNMENT : optional

  ORDER {
    uuid order_id PK
    string status
  }
  DRIVER {
    uuid driver_id PK
    bool online
  }
  DRIVER_ASSIGNMENT {
    uuid order_id PK
    uuid driver_id
    datetime assigned_at
  }
```

## Payments and idempotency in food delivery system design

From the customer’s view, capture is **synchronous**: you know pass or fail before the kitchen starts.

**Idempotency keys** come from the client (or the edge that wraps the mobile SDK). The payment service remembers keys so a **retry storm** collapses to one charge.

```mermaid
sequenceDiagram
  participant App as Client
  participant Pay as Payment service
  participant PSP as Processor

  App->>Pay: pay intent idempotency-key
  alt first time key
    Pay->>PSP: authorize and capture
    PSP-->>Pay: success
    Pay-->>App: receipt
  else duplicate key
    Pay-->>App: same receipt without second charge
  end
```

## Slice after checkout

```mermaid
sequenceDiagram
  participant C as Customer
  participant Pay as Payment service
  participant Ord as Order service
  participant Del as Delivery service
  participant D as Driver

  C->>Pay: pay for cart
  Pay-->>C: ok
  C->>Ord: place order
  Ord-->>Del: order ready signal
  Del->>D: assign nearest eligible driver
  D-->>Del: accept
  Del-->>C: driver enroute update path
```

## Regional scale without pretending the world is one city

Even when the product is **US-only**, I still draw **region boundaries** so search clusters, driver stores, and compliance boundaries stay **co-located** with traffic. That stops a design that only works in one metro.

```mermaid
flowchart TB
  US[Region US]
  US --> W[West cells]
  US --> E[East cells]
  W --> CW[Search and driver clusters west]
  E --> CE[Search and driver clusters east]
```

## Review checklist

- Search: latency target plus explicit staleness budget for menus
- Dispatch: race-safe assignment under concurrent matchers
- Payments: idempotent, auditable, reconciled with processor

## Related system design posts

- [LLM chat system design with moderation and sharded stores](/blog/system-design-conversational-ai-assistant)
- [Dating app system design with geo-sharded feeds](/blog/system-design-swipe-dating-platform)

## FAQ

**Why Elasticsearch for food delivery search?**  
Faceted text plus geo filters plus horizontal index shards match how people actually query (dish name, cuisine, distance).

**How do you avoid assigning two drivers to one order?**  
Transactional order state plus an assignment row or equivalent, checked before write. Contention needs a clear retry story.

**Where do idempotency keys live?**  
On the payment attempt from the client or gateway so network retries cannot create duplicate captures.

**Is eventual consistency acceptable for menus?**  
Often yes for read replicas if you publish an SLA (“menu changes visible within N minutes”) and handle out-of-stock at checkout.

Ship plans with numbers: [get a quote](https://www.qwabi.co.za/get-a-quote).
