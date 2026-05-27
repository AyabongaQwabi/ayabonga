---
title: Dating App System Design
excerpt: Dating app system design for swipe feeds, profile uploads, geo-sharded candidates, filters, matches, and chat handoff. Diagrams for mobile backends at scale.
date: May 27, 2026
readTime: 17 min read
slug: system-design-swipe-dating-platform
tags: dating app system design, geo-sharding, recommendation system, mobile backend architecture, system design interview
categories: Engineering
headerImage: /images/blog/mobile-apps-1-scaled.jpg
ogImage: /images/blog/mobile-apps-1-scaled.jpg
dateModified: May 27, 2026
---

The UI looks like photos and cards. The backend is binary media, JSON-shaped profiles, location, and a recommendation loop that has to stay fast while millions of people swipe.

This is how I break down **dating app system design** in reviews and whiteboard sessions. I am [Ayabonga Qwabi](https://www.qwabi.co.za/). For shipping mobile backends, see [mobile app development in South Africa](https://www.qwabi.co.za/solutions/mobile-app-development-south-africa).

## Core product pillars

- Profile creation: photos, bio, preferences, location
- Feed: ranked candidates near the viewer
- Matching: mutual accept creates a relationship record
- Chat after match (media in a later phase)

```mermaid
flowchart TB
  P[Profile and media]
  R[Recommendation feed]
  M[Match service]
  C[Chat service]
  P --> R
  R --> M
  M --> C
```

## Profile model for dating app system design

I split **user id** (billing and account) from **profile id** so someone can reset their dating identity without deleting purchase history.

A profile document usually holds:

- preferences JSON (index selective fields if you filter on them)
- self-attributes (age band, gender, short bio)
- location (lat, long, coarse region for policy)
- photo ids only after upload completes

```mermaid
erDiagram
  ACCOUNT ||--o{ PROFILE : may_reset
  PROFILE {
    string profile_id PK
    string user_id FK
    json preferences
    json self_attributes
    float latitude
    float longitude
    array photo_ids
    datetime last_active_at
  }
  ACCOUNT {
    string user_id PK
  }
```

## Image pipeline before the profile row

I do not let raw uploads land in the same transaction as profile insert.

1. Client gets signed URLs or streaming session from an upload service
2. Worker transcodes, resizes, runs policy checks
3. Blob store holds canonical renditions
4. Client gets stable image ids
5. Profile API writes the document to a document store (NoSQL fits the shape)

```mermaid
sequenceDiagram
  participant App as Mobile app
  participant U as Upload service
  participant W as Media worker
  participant B as Blob store
  participant API as Profile API
  participant DB as Profile store

  App->>U: start upload
  U-->>App: signed URL or chunk session
  App->>U: PUT bytes
  U->>W: enqueue processing
  W->>B: write renditions
  W-->>App: image ids
  App->>API: POST profile with ids
  API->>DB: upsert profile document
```

## Recommendation feed and geo locality

Constraints I write on the board first:

- local candidates, not random global rows
- recently active people so the deck feels alive
- capped page size (often ~50 cards) so payloads stay small

```mermaid
flowchart LR
  REQ[GET feed]
  REC[Recommendation service]
  GEO[Geo shard mapper]
  S2[Cell index library]
  SH[(Geo-sharded profile shards)]

  REQ --> REC --> GEO --> S2 --> SH
  SH --> REC
  REC --> FILT[Filter by prefs and activity]
  FILT --> RESP[Return profile cards]
```

### Why geo sharding shows up in dating app system design

With a geospatial cell index (S2-style or equivalent), the service sends the viewer location, reads **only shards that overlap nearby cells**, then filters a bounded set. That is how p95 stays stable when row counts go huge.

```mermaid
flowchart TB
  NY[Dense city example]
  NY --> C1[Cell shard 1]
  NY --> C2[Cell shard 2]
  NY --> C3[Cell shard 3]
  RECS[Recommendation service queries only overlapping cells]
  NY --> RECS
```

## Filters after geo fetch

Deterministic steps:

- candidate matches viewer preferences
- `last_active_at` inside a window (example: 5 days)
- hard cap before ranking

```mermaid
flowchart TB
  L[Large candidate batch from geo layer]
  L --> P[Preference filter]
  P --> A[Active user filter]
  A --> R[Rank and truncate to N]
```

## Fast refill versus heavy re-rank

Product trade, not philosophy.

- Fast refill: empty deck, new batch in seconds, ranking can be shallow.
- Heavy re-rank: minutes of CPU per user fights impatient swiping unless you prefetch quietly.

I usually pick **fast refill** for consumer swipe patterns and accept that the first batch after cold start is not globally optimal.

```mermaid
sequenceDiagram
  participant U as User
  participant App as App
  participant R as Recommendation service

  loop swipe through local batch
    U->>App: swipe
  end
  App->>R: feed empty, request more
  R-->>App: new batch within seconds
```

## Match and chat handoff

Mutual accept creates a match row and a thread id. Chat is then a normal messaging subsystem with its own storage and presence work.

```mermaid
stateDiagram-v2
  [*] --> ShownInFeed
  ShownInFeed --> Passed: left swipe
  ShownInFeed --> Liked: right swipe
  Liked --> Matched: mutual like
  Matched --> Chatting: first message
```

## Photo storage math

A few million DAU, hundreds of thousands of new profiles per day, several photos each at a few hundred KB after compression: you climb toward **hundreds of terabytes** fast. That means object storage, CDN, lifecycle rules, not disks on app hosts.

```mermaid
flowchart LR
  IMG[Profile images]
  IMG --> O[Object storage tier]
  O --> CDN[Edge cache]
  O --> ARC[Cold archive policy]
```

## What I timebox in a short session

Logging, metrics, abuse response, and subscriptions are real programs. In a 45-minute slice I either park them as sibling tracks or give each a one-line owner so the core loop stays readable.

## Related system design posts

- [LLM chat system design with moderation and sharded stores](/blog/system-design-conversational-ai-assistant)
- [Food delivery system design for search, drivers, and checkout](/blog/system-design-food-delivery-core-flows)

## FAQ

**What makes dating app system design hard?**  
Media pipelines, geo-bounded queries at scale, and ranking under latency pressure. SQL-only mental models usually break once feed read paths fan out.

**Why separate profile id from user id?**  
Account deletion, billing disputes, and “reset my dating profile” are different lifecycles. Splitting ids avoids painting yourself into a corner.

**Is SQL wrong for profiles?**  
Not always. Document stores fit flexible profile JSON and horizontal growth; relational fits if your team already runs Postgres well and you design JSONB plus indexes carefully.

**How tight should the active-user window be?**  
Pick a window from product data. Five days is a common starting point for interviews; production should follow your retention curves.

If you want this applied to your product constraints, start at [qwabi.co.za](https://www.qwabi.co.za/) or use the [quote flow](https://www.qwabi.co.za/get-a-quote).
