# About page — Liminal French — Final clean draft
*Native English pass, factual consistency fixed, redundancies cut. Structure preserved from your brief.*

---

## The gap nobody talks about (Experience)

My first experience with language learning was at school, learning English and Spanish. You can picture it: thirty French kids crammed into a classroom, a teacher explaining a grammar rule, then exercises to drill it in. It's a manageable way to teach thirty kids who mostly don't want to be there — but it's not exactly enjoyable, and it's not how anyone falls in love with a language.

I'd always liked Japanese pop culture growing up — manga, anime — but it wasn't until I actually went to Japan in 2020 that something shifted. Hearing people speak Japanese around me, I didn't just want to understand the words. I wanted to be part of the conversation.

Back in Paris, my wife and I started classic Japanese classes at the Institut Japonais. It was a solid way to get the basics of a language considered one of the hardest for French natives. But at some point, I wanted to go faster, and go deeper. I started digging through YouTube for methods and found immersion learning — comprehensible input. I dove in completely: built a daily habit, surrounded myself with Japanese content, and eventually moved to Japan for a year to live inside the language rather than just study it.

Five years after that first trip, I reached JLPT N2 (roughly CEFR B2) — and I'm still working toward fluency today. I never considered myself a "gifted" language learner. I'm not the fastest, I'm not the best. What got me there was consistency, not talent — which is exactly why I believe almost anyone can do this.

Eventually I quit a well-paying job to follow what I actually loved: learning languages, and helping others do the same. I'm still on that path myself — currently working on Portuguese, using a completely different mix of methods than the ones that worked for Japanese, because no two languages (or learners) need the exact same approach.

---

## How the jump actually works (Expertise)

Learning a language isn't rocket science. Anyone can do it. The real obstacle isn't difficulty — it's time, and knowing what to do with that time when you're starting out, or when you feel stuck.

The hardest jump is the one between a theory-first approach — grammar rules, drills — and an immersion approach: comprehensible input, real content, letting the process carry you. Theory matters, especially at the very start, to get your footing in a brand-new language. But at some point you have to let go of it to actually dive in. Babies learn their first language by hearing it all day, every day — and native speakers will tell you they speak the way they do because it *sounds* right, not because they're applying a rule. That's the jump from grammar to immersion.

It's a bit like learning to ride a bike with training wheels: reassuring at first, useful for finding your balance — but at some point, they stop helping you improve and start holding you back. Taking them off can feel uncomfortable, even a little scary. That's exactly the moment I've spent the past year and a half supporting students through, one-on-one, at every level from A1 to B2.

As a teacher, my job is to stay adaptive: some students need more structure, some need to be pushed toward immersion sooner, most need both at different moments. I know what it feels like to hit frustration, to feel like you're not progressing — I've lived it as a learner, and I've supported students through it as a teacher. That's what this platform is built on.

**Support** — I learned this the hard way, and I teach from that same experience. I'm not observing your journey from the outside; I'm on the same road, a few steps ahead.

**Methodology** — There's no single magic method. I adapt to each student: grammar, immersion, reading, conversation — different tools for different people and different moments. I'm learning Portuguese in a completely different way than I learned Japanese, because the right method depends on you, not on a fixed formula.

**Community** — Learning Japanese, I often felt alone in it. I don't want that for you. Learning alongside others — no judgment, no race, everyone at their own pace — is what keeps people going long after motivation alone would have run out.

---

## Why "Liminal" (Philosophy)

*Liminal* means threshold — the space of crossing from one side to another.

Learning a language isn't only about being understood. It's a genuine connection to an entire culture, and to the people in it — a visible sign of curiosity and respect that opens doors everywhere in the world. I lived a full year in Japan, and it remains one of the wildest experiences of my life — not because my Japanese was perfect, but because it was enough to actually have a conversation, and that changed everything about how I experienced the country and its people.

That's what Liminal is: the door you open onto a culture, the threshold you cross that changes you. It's what I'm still living through Japanese and Portuguese, and what I want to share with you through French.

In a world built for instant gratification, I think language learning has an outsized role to play. It's not hard — but it takes time, and that's exactly why it's worth so much. The things that matter most to us are the things we spend real time on: people, hobbies, habits that shape who we become. Learning a language is one of those things.

This might sound like a lot for a language-learning platform. But it's genuinely what I live through learning languages — and it's what I want to build with you here.

---

## What you get

- **A full grammar course** covering every level from A1 to B2
- **Immersion content** fully adapted to your level — a mix of culture, history, free conversation, and more, so no two lessons feel the same
- **Ongoing support** — live discussions, Q&A sessions; ask a question about French, get a real answer
- **A community** of learners on the same journey — a Discord to share wins and struggles, live sessions for free talks, guided reading practice, and studying together

---

## Notes for you before publishing
1. All factual details are now internally consistent based on what you confirmed: 2020 trip → Institut Japonais in Paris → discovered immersion via YouTube → one year living in Japan → JLPT N2/B2 after 5 years total → 1.5 years teaching FLE freelance. Double-check this reads correctly to you before it goes live — I reconstructed the sequence from your answers, so verify I didn't misplace anything.
2. "Still working toward fluency" is now explicit, so N2/B2 won't read as "already done."
3. I cut the duplicate sentence about feeling frustrated/lost (it repeated the same idea twice in a row in your draft) — let me know if you wanted that repetition for emphasis rather than by accident.
4. Consider whether you want an exact number of students taught so far, if you have one — "dozens" was in your draft but I removed it since I couldn't verify it; add back if accurate.
5. Still no invented certifications — if you hold a formal FLE qualification, this is the place to add it as a one-line credibility marker.
6. Photo/video of you: same recommendation as before, still applies.

---

## Schema.org `Person` — JSON-LD block

This is invisible metadata, not visible page text. Insert it in the `<head>` of the About page (or wherever your Astro layout injects structured data).

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Félix",
  "jobTitle": "French teacher & founder of Liminal French",
  "description": "Native French teacher and founder of Liminal French, a platform helping English speakers bridge the gap between classroom French and comprehensible-input immersion.",
  "url": "https://liminalfrench.com/about/",
  "sameAs": [
    "https://www.youtube.com/@frenchwithfelix",
    "https://www.instagram.com/frenchwithfelix/",
    "https://open.spotify.com/show/0XOsew8SJzIGaN4AbC9i2n"
  ],
  "knowsLanguage": ["fr", "en", "ja", "pt"],
  "worksFor": {
    "@type": "Organization",
    "name": "Liminal French",
    "url": "https://liminalfrench.com"
  }
}
</script>
```

### Implementation notes for Claude Code
- Drop the Spotify URL's tracking query param (`?si=...`) before publishing — it's a personal share-tracking token, not a stable canonical link, and it doesn't belong in structured data.
- Place this in `AboutLayout.astro` (or wherever the About page template lives), rendered once, not duplicated per page.
- Once you have blog articles with author bylines, each article's own JSON-LD (`Article` or `BlogPosting` type) should reference this same Person via an `author` field pointing to the same `name`/`url` — that's what actually links your expertise across every page, not just this one.
- If you later add a formal `Organization` schema for Liminal French itself (logo, description, sameAs for the brand's own socials), this `Person.worksFor` can point to that richer object instead of the inline stub above.
