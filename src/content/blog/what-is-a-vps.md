---
title: "What is a VPS?"
excerpt: "Shared hosting is a flat. A dedicated server is a house. A VPS is the apartment in between. Here is what that actually means and when you need one."
date: June 5, 2026
readTime: 8 min read
slug: what-is-a-vps
tags: VPS, Hosting, Infrastructure, Web Hosting, Beginners
categories: Engineering, Infrastructure
headerImage: /images/blog/vps.png
ogImage: /images/blog/vps.png
seoTitle: What is a VPS? Virtual Private Server Explained Simply
metaDescription: A VPS gives you dedicated resources, root access, and your own environment on a shared physical server. Here is what that means and when you actually need one.
---

At some point, every developer or small business owner hits the wall with shared hosting. The site gets a bit of traffic. Load times slow down. The host tells you you're using too many resources. You start looking at the next tier up and see the words "Virtual Private Server."

So what actually is it?

## The apartment analogy

Shared hosting is like living in a student residence. You have a bed and some storage, but you share everything else: the kitchen, the bathrooms, the internet connection. If someone on your floor throws a party, everyone's night gets worse.

A dedicated server is like owning a house. You have the whole building, the full connection, all the resources. Nobody else affects your experience. But you pay for the whole house whether you need it or not.

A VPS is an apartment. You have your own unit with its own walls. What happens next door doesn't affect you. You have your own kitchen, your own bathroom, your own utilities. But you're still in the same building as everyone else, on the same physical structure.

That physical structure is the actual server. The "virtualization" is the technology that carves it into isolated units.

## How it works technically

A VPS provider takes a physical server, usually a machine with 64 or 128+ CPU cores and hundreds of gigabytes of RAM, and uses software called a [hypervisor](https://en.wikipedia.org/wiki/Hypervisor) to divide it into multiple isolated virtual machines.

The most common hypervisor technology in South African and global hosting is [KVM](https://www.linux-kvm.org/), which stands for Kernel-based Virtual Machine. It's part of the [Linux](https://www.kernel.org/) kernel. Each KVM virtual machine gets its own allocated vCPU cores, RAM, and storage. It boots its own operating system. It has its own IP address. It cannot see or affect other virtual machines on the same hardware.

From inside the VPS, it feels and behaves exactly like a dedicated server. You have root access. You can install whatever software you want. You can configure the firewall, run background services, set up your own databases. Nobody else is sharing your allocated resources.

## Managed vs unmanaged

This is the distinction most people miss when they first look at VPS pricing.

An unmanaged VPS gives you the machine and steps back. The provider keeps the hardware running and connected. Everything else: the OS installation, software setup, security patches, backups, firewall configuration, everything, is your responsibility.

A managed VPS means the provider handles the technical operations. They set up the server, monitor it, apply security updates, handle hardware failures, and often provide support when things go wrong.

Unmanaged is much cheaper. Managed costs more but is worth it if you don't want to become a sysadmin.

For most small businesses and solo developers running production apps, managed is the right choice unless you have the Linux knowledge to handle things yourself.

## VPS vs shared hosting

|                         | Shared Hosting         | VPS              |
| ----------------------- | ---------------------- | ---------------- |
| Resources               | Shared with everyone   | Dedicated to you |
| Performance             | Affected by neighbours | Isolated         |
| Root access             | No                     | Yes              |
| Install custom software | No                     | Yes              |
| Price                   | Cheap                  | More             |
| Skill needed            | Low                    | Medium           |

Shared hosting is fine for static sites, basic WordPress blogs, or anything that doesn't need real performance or customization. The moment you need to run a Node.js app, a custom API, a non-standard database, or anything that requires installing software at the OS level, you need a VPS.

## VPS vs dedicated server

A dedicated server gives you the entire physical machine. No sharing at all. This matters if:

- You're running workloads that need consistent access to hardware (not virtualized)
- You need maximum RAM (some dedicated servers go to 384GB+)
- You have compliance requirements around shared hardware
- Your traffic or compute needs consistently max out VPS tiers

For most applications, a VPS is more than enough. Dedicated servers are significantly more expensive and usually only make sense at serious scale.

## What you actually use a VPS for

In practice, developers and businesses in South Africa use VPSes for:

**Hosting web apps and APIs.** Any Node.js, Python, Go, or PHP application that needs a real server environment. You're not going to run [Express](https://expressjs.com/), [FastAPI](https://fastapi.tiangolo.com/), or [Laravel](https://laravel.com/) on shared hosting cleanly.

**Running databases.** [PostgreSQL](https://www.postgresql.org/), [MySQL](https://www.mysql.com/), [MongoDB](https://www.mongodb.com/), [Redis](https://redis.io/). You can self-host your databases on a VPS. For small to medium workloads, this is cheaper than managed database services.

**Development and staging environments.** A VPS that mirrors your production setup. Test deployments without touching production.

**Self-hosted tools.** Things like [Plausible](https://plausible.io/) for analytics, [Umami](https://umami.is/) for tracking, [Coolify](https://coolify.io/) or [CapRover](https://caprover.com/) as a self-hosted PaaS, [Supabase](https://supabase.com/) self-hosted, [n8n](https://n8n.io/) for automation.

**Email servers.** Running your own SMTP server, though this comes with its own complexity around deliverability.

## Storage types on a VPS

When you're comparing VPS plans, you'll see different storage types. They matter more than most people realize.

**HDD (Hard Disk Drive)** is the old spinning disk technology. Cheap per gigabyte. Slow. Fine for large cold storage or backups. Bad for databases and high-traffic apps.

**SSD (Solid State Drive)** has no moving parts. Significantly faster than HDD. Most modern VPS plans use SSD by default.

**NVMe SSD** is the current standard for performance hosting. NVMe drives communicate directly with the CPU over PCIe lanes rather than through the older SATA interface. This makes them 6 to 10 times faster than regular SATA SSDs. If you're running a database-heavy app, a WooCommerce store, or anything that does a lot of disk reads and writes, NVMe makes a noticeable difference.

## South African VPS providers

The local market has solid options. [HostAfrica](https://www.hostafrica.com/), [EliteHost](https://www.elitehost.co.za/), [Domains.co.za](https://www.domains.co.za/), [Xneelo](https://xneelo.co.za/), and [Axxess](https://www.axxess.co.za/) all offer VPS plans with local data centre options, usually hosted at [Teraco Johannesburg](https://www.teraco.co.za/).

The advantage of hosting locally is lower latency for South African visitors, ZAR billing (no exchange rate exposure), and support during South African business hours.

For global projects, international providers like [Hetzner](https://www.hetzner.com/) and [Vultr](https://www.vultr.com/) (which has a Johannesburg node) offer competitive options.

---

A VPS is not complicated once you understand what you're actually getting. Dedicated resources, your own environment, root access, at a fraction of the cost of a dedicated server. For any serious web app or API running in production, it's the right starting point.
