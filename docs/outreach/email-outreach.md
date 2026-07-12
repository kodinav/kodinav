# Email Outreach Guide

Two completely different email games. Mixing them up damages your domain.

## Game 1: Hostinger email marketing (100/day free) — WARM lists only

Email-marketing tools require opted-in recipients (their terms + spam law
norms). Cold/scraped lists get the tool suspended and, worse, poison
kodinav.com's sending reputation so even replies to real leads hit spam.

**What to use the free 100/day for:**
1. **Audit-lead nurture** — everyone who orders/enquires about the audit.
2. **Blog newsletter** — offer "one useful article a month" on the site later.
3. **Past clients & contacts** — people who know you; occasional useful updates.
4. **Lead follow-up sequences** — enquiries from the site that went quiet:
   day 3 "still interested?", day 10 "case study you might like".

**Before sending anything:** in Hostinger hPanel → Emails, enable **DKIM and
DMARC** for kodinav.com (SPF already exists). Without them, deliverability
suffers everywhere.

## Game 2: Cold prospecting — manual, personal, small

Cold email works in India for B2B, but only done like an engineer, not a
spammer:

- **From your normal mailbox** (hello@kodinav.com), one email at a time.
- **20–30 per day maximum.** Volume is the enemy of deliverability and of
  personalisation.
- **One true, specific observation per email** — same rule as WhatsApp
  outreach. This is the entire difference.
- Plain text, no images, no tracking pixels, no "marketing" formatting.
- If someone says no or ignores two emails: stop. Never re-add them.

### Building the list (30 min/day)

1. Google Maps: "coaching institute Noida", "dental clinic Ghaziabad",
   "hotel Greater Noida", "CA firm Delhi", "real estate developer Gurgaon".
2. Open their websites on your phone. Shortlist the slow/broken/dated ones —
   those are the ones with a reason to buy.
3. Paste shortlisted URLs into `urls.txt`, then:
   `node scripts/harvest-emails.mjs urls.txt > prospects.csv`
   The script pulls the publicly listed contact email + phone from each site.
4. Run each site through PageSpeed Insights, note ONE number per prospect.

### The cold email template

Subject: `[Institute name]'s website takes 9 seconds to load`

> Hi [Name],
>
> I'm Abhinav, a software engineer in Delhi NCR. I came across
> [Business]'s website today and ran it through Google's speed test:
> it takes [9] seconds to open on a phone. Most [parents/patients/customers]
> searching on mobile give up before that.
>
> I build fast, Google-friendly websites for [coaching institutes / clinics /
> businesses]. Recent work, all live and clickable: kodinav.com/work
>
> If it's useful, I'll send you a short free breakdown of what I found and
> what I'd fix. No obligation either way.
>
> Abhinav Saxena
> Kodinav — Independent Software Studio
> kodinav.com · +91 81266 61493
>
> (If you'd rather not hear from me, just reply "no" and I won't write again.)

Follow-up once, after 4 days:

> Hi [Name], floating this up once in case it got buried. Happy to send the
> breakdown whenever useful; otherwise I'll leave you in peace.

### The maths

25 truly personalised emails/day ≈ 120/week → typical B2B cold reply rates of
3–8% on well-targeted, specific emails → 4–9 replies/week → 1–3 real
conversations → first close in the same 2–5 week window as WhatsApp outreach.
Email + WhatsApp + referrals running together is how one project lands fastest.
