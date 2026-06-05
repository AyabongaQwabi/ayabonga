---
title: "How to Choose the Best VPS for Your Project"
excerpt: "RAM, storage type, location, managed vs unmanaged. Here is what actually matters when picking a VPS and what most people get wrong."
date: June 5, 2026
readTime: 9 min read
slug: how-to-choose-best-vps
tags: VPS, Hosting, Infrastructure, Web Hosting, South Africa
categories: Engineering, Infrastructure
headerImage: /images/blog/vps.png
ogImage: /images/blog/vps.png
seoTitle: How to Choose the Best VPS for Your Project
metaDescription: A practical guide to picking the right VPS. What RAM, storage, location, and managed vs unmanaged mean for your specific project type, with South African context.
---

Most VPS comparison articles will tell you to look at the CPU count and the monthly price and pick the middle option. That's not how you should actually think about this.

The right VPS depends on what you're building, where your users are, and how much you want to handle yourself. Here's how to think through it properly.

## Start with the workload

Different workloads need different things. Be honest about what you're actually running before you look at a single pricing page.

**Basic business website or blog.** A WordPress or static site with moderate traffic. You don't need much. 1 vCPU and 1GB of RAM will handle this. A managed VPS at the lower tier from any reputable South African provider is fine.

**eCommerce store (WooCommerce, Shopify self-hosted, custom).** This is where storage type starts to matter. WooCommerce does a lot of database reads and writes for every product page, cart, and checkout. You want NVMe SSD storage and at least 2GB of RAM. On a busy sale day (Black Friday, Easter, payday weekends), you'll thank yourself for the extra RAM headroom.

**SaaS or custom web application.** A Node.js, Python, or Go API serving multiple users. More variables here. Start with 2 vCPUs and 4GB of RAM and monitor. Most early-stage SaaS apps don't need more than this, but you want the ability to scale up fast if you get a spike.

**Agency managing multiple client sites.** You want a managed VPS that includes [WHM](https://www.cpanel.net/products/whm/) or unlimited [cPanel](https://cpanel.net/) accounts so you can host multiple clients on one instance without paying per client.

**Backup or archive storage.** This is the one case where HDD makes sense. You need bulk storage cheaply, not fast random access. Some providers like [Afrihost](https://www.afrihost.com/) offer SAN-attached HDD tiers that scale to 8TB for exactly this use case.

## RAM is usually the most important number

People obsess over vCPU counts. RAM is almost always the bottleneck first.

For modern PHP, MySQL, and most web app stacks, RAM is what gets eaten up. [PHP-FPM](https://www.php.net/manual/en/install.fpm.php) workers, MySQL buffer pool, Nginx worker processes, and your app all compete for the same RAM. When RAM runs out, the server starts using swap (disk-based memory), which is dramatically slower.

For small sites: 1GB RAM is enough. For WooCommerce or multi-site installs: budget 4GB minimum. For SaaS apps with a database: 4 to 8GB. If you're running a database server separately, you can get away with less on the app server.

## Storage type matters more than storage size

A 10GB NVMe SSD will outperform a 100GB HDD for web serving. Full stop.

Here's the practical hierarchy:

**NVMe SSD** is what you want for anything database-heavy or high-traffic. It connects directly to the CPU via PCIe lanes. Reads and writes are 6 to 10 times faster than standard SATA SSDs. The difference shows up as faster page loads, faster checkout completions, and lower server response times. Providers like [EliteHost](https://www.elitehost.co.za/), [HostAfrica](https://www.hostafrica.com/), and [Domains.co.za](https://www.domains.co.za/) use NVMe on their VPS infrastructure.

**SATA SSD** is still fast compared to HDD. Fine for most workloads. If a provider offers only SATA SSD, it's not a dealbreaker for a standard website, but it's worth knowing.

**HDD** is only appropriate for backups and cold storage. If you see a VPS marketed as "HDD hosting" at a suspiciously low price, that's why. [Axxess](https://www.axxess.co.za/) uses standard HDD on their entry-level tier. Fine if you know what you're getting. Not fine if you're running a database on it.

## Server location for South African projects

If your users are in South Africa, your server should be too.

The reason is latency. A request from a browser in Johannesburg to a server in Amsterdam adds roughly 150 to 200ms of network round-trip time compared to a server at [Teraco Johannesburg](https://www.teraco.co.za/). That matters for [Google's Core Web Vitals](https://web.dev/vitals/) scores, which directly affect search rankings.

Most serious South African providers host their VPS infrastructure at Teraco's data centres in Isando, Johannesburg. This gives you access to [NAPAfrica](https://www.napafrica.net/) peering, which connects to most local ISPs directly.

For projects with a South African audience: choose a provider with Johannesburg servers.

For projects serving the rest of Africa: providers like [HostAfrica](https://www.hostafrica.com/) have nodes in Kenya, Ghana, and Nigeria, which matters for regional latency.

For global projects: international providers like [Hetzner](https://www.hetzner.com/) or [Vultr](https://www.vultr.com/) (which has a Johannesburg point of presence) give you both local and international coverage.

There's also [POPIA](https://www.justice.gov.za/inforeg/) to consider. If you're processing personal data about South African residents, keeping that data on South African servers simplifies your compliance posture significantly.

## Managed vs unmanaged, for real

The managed vs unmanaged question is really a question about your time and your Linux knowledge.

**Unmanaged** means you're the sysadmin. You install the OS. You configure [Nginx](https://nginx.org/) or [Apache](https://httpd.apache.org/). You set up [Let's Encrypt](https://letsencrypt.org/) for SSL. You configure the firewall with [UFW](https://help.ubuntu.com/community/UFW) or [iptables](https://linux.die.net/man/8/iptables). You apply security patches. You handle backups. You debug the server when it goes down at 3am.

If you enjoy this and know what you're doing, unmanaged is cheaper and gives you full control. [Absolute Hosting](https://www.absolutehosting.co.za/) offers unmanaged AMD EPYC plans from under R100 per month.

**Managed** means the provider handles the infrastructure layer. You deploy your app. They handle the OS, the updates, the monitoring, and the recovery. You pay a premium for this. Providers like [telaHosting](https://telahosting.co.za/) and [HostAfrica](https://www.hostafrica.com/) include [LiteSpeed](https://www.litespeedtech.com/), [CloudLinux](https://www.cloudlinux.com/), and [Imunify360](https://www.imunify360.com/) in their managed stacks.

For businesses where the website is revenue-critical and no one on the team wants to run servers, managed is not a luxury. It's the right call.

## Bandwidth and traffic limits

Some providers give you unmetered bandwidth. Some give you a monthly data transfer cap (like 1TB or 2TB). Some charge for overages.

For most small business sites, a 1TB monthly cap is more than enough. A typical business WordPress site doing 50,000 page views per month uses maybe 50 to 100GB of bandwidth.

Where unmetered bandwidth matters: news sites, file download sites, anything that serves large files or gets unpredictable traffic spikes. [EliteHost](https://www.elitehost.co.za/) is notable in the South African market for offering unlimited, unmetered bandwidth across all their VPS tiers.

## The checklist before you buy

Before you commit to a VPS:

- What's the workload? (static site, WooCommerce, SaaS app, API, multiple client sites)
- How much RAM does that workload actually need at your expected traffic?
- Is the storage NVMe, SATA SSD, or HDD?
- Where are the servers located relative to your users?
- Managed or unmanaged? (Be honest about your Linux knowledge)
- Is bandwidth metered or unmetered?
- What's the actual uptime SLA?
- Are there backups included, and how long are they retained?
- What's the support like? (Phone? Ticket? WhatsApp? South African hours?)

Get answers to all of these before signing up. Most providers in South Africa have solid documentation and responsive support if you ask directly.
