// This file is auto-generated from modern-web-design-styles.html. Do not edit directly.

export interface DesignStyle {
  name: string;
  category: string;
  previewClass: string;
  previewHtml?: string;
  title: string;
  tag: string;
  tagClass: string;
  desc: string;
  bestFor: string;
}

export interface DesignCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  styles: DesignStyle[];
}

export const designCategories: DesignCategory[] = [
  {
    "id": "raw-foundations",
    "name": "Raw Foundations",
    "icon": "⬛",
    "description": "Styles built on strong, uncompromising visual principles — clarity, contrast, intentional rawness. These are the building blocks of design philosophy.",
    "styles": [
      {
        "name": "Brutalism",
        "category": "raw-foundations",
        "previewClass": "preview-brutalism",
        "title": "Brutalism",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Embraces raw, ugly, honest aesthetics — exposed structure, clashing colours, heavy borders, no softening. Inspired by Brutalist architecture. Deliberately uncomfortable, impossible to ignore. Often uses system fonts, visible HTML scaffolding, and zero decorative polish.",
        "bestFor": "art projects, cultural commentary, anti-establishment brands, developer personal sites wanting personality."
      },
      {
        "name": "Neo-Brutalism",
        "category": "raw-foundations",
        "previewClass": "preview-neo-brutalism",
        "title": "Neo-Brutalism",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Brutalism with personality — still raw and bold but adds playful colour, thick offset box-shadows, and chunky borders. Popularised by tools like Figma and Linear. Feels intentional rather than broken. Often high-contrast with yellow, coral, or lime pops.",
        "bestFor": "SaaS tools, developer products, startup landing pages that want to stand out."
      },
      {
        "name": "Minimalism",
        "category": "raw-foundations",
        "previewClass": "preview-minimalism",
        "title": "Minimalism",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Less is more — white space as a design element, single focal points, muted palettes, and deliberate absence. Reduces visual noise to its essential core. Feels calm, confident, and premium when done well. Requires exceptional content to work — you have nowhere to hide.",
        "bestFor": "portfolios, premium products, editorial sites, high-end services."
      },
      {
        "name": "Maximalism",
        "category": "raw-foundations",
        "previewClass": "preview-maximalism",
        "title": "Maximalism",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "More of everything — patterns, colour, texture, type, animation, imagery, all at once. The complete opposite of minimalism. Demands attention and creates sensory richness. Works because the excess is intentional, not accidental. Requires skill to avoid feeling chaotic.",
        "bestFor": "music festivals, fashion brands, creative agencies, youth-focused products."
      },
      {
        "name": "Monochrome Design",
        "category": "raw-foundations",
        "previewClass": "preview-monochrome",
        "title": "Monochrome Design",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Single colour (or black/white) carried across the entire design. Communicates focus, restraint, and confidence. When everything is one colour, composition and typography carry all the weight. Forces you to find contrast through scale and form rather than hue.",
        "bestFor": "luxury brands, editorial design, photography portfolios, strong concept-first products."
      },
      {
        "name": "Hyper-Contrast Design",
        "category": "raw-foundations",
        "previewClass": "preview-hyper-contrast",
        "title": "Hyper-Contrast Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Maximum contrast as a design philosophy — pure black against pure white, dark backgrounds with blazing white text. Creates energy and legibility simultaneously. Not just for accessibility — high contrast is a bold aesthetic statement that demands presence.",
        "bestFor": "tech brands, performance-first products, any context needing high visual impact."
      },
      {
        "name": "Anti-Design",
        "category": "raw-foundations",
        "previewClass": "preview-antidesign",
        "title": "Anti-Design",
        "tag": "Experimental",
        "tagClass": "tag-experimental",
        "desc": "Deliberately breaks rules — clashing colours, unreadable layouts, deliberately bad choices made intentionally. It's design that critiques design. Born from Italian design movements of the 70s. Signals: \"we know the rules, we choose to break them.\" Requires real mastery to pull off.",
        "bestFor": "conceptual projects, art/culture brands, provocative commentary."
      },
      {
        "name": "Raw HTML Aesthetic",
        "category": "raw-foundations",
        "previewClass": "preview-raw-html",
        "title": "Raw HTML Aesthetic",
        "tag": "Experimental",
        "tagClass": "tag-experimental",
        "desc": "Unstyled or near-unstyled HTML — default serif fonts, blue links, no layout system. Makes a statement about information over presentation. Popular in certain developer circles as philosophical commentary on over-designed web. Surprisingly readable, extremely fast.",
        "bestFor": "technical blogs, developer diaries, performance-obsessed sites, commentary projects."
      },
      {
        "name": "Low-Tech Aesthetic",
        "category": "raw-foundations",
        "previewClass": "preview-low-tech",
        "title": "Low-Tech Aesthetic",
        "tag": "Experimental",
        "tagClass": "tag-experimental",
        "desc": "Celebrates simplicity and restraint — monospace text, minimal imagery, no JavaScript dependencies. Anti-bloat philosophy expressed visually. Feels human and honest. Part of the broader \"slow web\" movement that values substance over spectacle.",
        "bestFor": "personal blogs, open-source projects, sustainability-first brands."
      },
      {
        "name": "Accessibility Brutalism",
        "category": "raw-foundations",
        "previewClass": "preview-a11y-brutal",
        "title": "Accessibility Brutalism",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Combines brutalist visual language with rigorous WCAG compliance — maximum contrast, plain language, obvious affordances. Proves accessibility and strong aesthetics aren't opposites. Thick borders and raw typography naturally create accessible experiences.",
        "bestFor": "government services, public information tools, inclusive-first products."
      }
    ]
  },
  {
    "id": "typography-print",
    "name": "Typography & Print Traditions",
    "icon": "Aa",
    "description": "Design systems rooted in the discipline of print — where type was king, grid was law, and every decision had structural purpose.",
    "styles": [
      {
        "name": "Typography-Heavy Design",
        "category": "typography-print",
        "previewClass": "preview-typography",
        "title": "Typography-Heavy Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Type as the primary visual element — oversized headlines, contrasting weights, expressive letterspacing. Imagery is secondary or absent entirely. Requires mastery of font pairing, optical sizing, and reading rhythm. When done right, text itself becomes illustration.",
        "bestFor": "editorial sites, personal brands, writing-focused platforms, publications."
      },
      {
        "name": "Swiss / International Style",
        "category": "typography-print",
        "previewClass": "preview-swiss",
        "title": "Swiss / International Style",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Born in 1950s Switzerland — Helvetica, strict grids, left-aligned text, functional photography. Objective, clear, universal. Became the visual language of corporate design worldwide. Every piece has a defined reason for existing. Nothing decorative; everything communicates.",
        "bestFor": "corporate brands, institutional sites, design systems, technical documentation."
      },
      {
        "name": "Editorial Design",
        "category": "typography-print",
        "previewClass": "preview-editorial",
        "title": "Editorial Design",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Brings magazine and book sensibility to the screen — pull quotes, drop caps, rich imagery alongside text, deliberate whitespace. Storytelling through layout. Every spread feels considered. The grid is used expressively, not just structurally.",
        "bestFor": "long-form journalism, online magazines, case studies, thought leadership."
      },
      {
        "name": "Bauhaus-Inspired Design",
        "category": "typography-print",
        "previewClass": "preview-bauhaus",
        "title": "Bauhaus-Inspired Design",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Form follows function — circles, triangles, primary colours. Geometric abstraction as meaning. The Bauhaus school (1919-1933) believed beauty and utility were the same thing. Clean shapes, primary palette, geometric type. Timeless and immediately recognisable.",
        "bestFor": "design schools, architecture firms, cultural institutions, craft brands."
      },
      {
        "name": "Magazine / Editorial Layouts",
        "category": "typography-print",
        "previewClass": "preview-magazine",
        "title": "Magazine Layouts",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Multi-column grids, dominant images, varied type sizes, and colour-coded sections. Borrows directly from print magazine conventions. Creates visual hierarchy that guides readers through content at different depths. Satisfying information density without overwhelm.",
        "bestFor": "news platforms, online publications, content-heavy products."
      },
      {
        "name": "Newspaper-Style Layouts",
        "category": "typography-print",
        "previewClass": "preview-newspaper",
        "title": "Newspaper-Style Layouts",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Narrow columns, dense text, masthead typography, horizontal rule separators. Signals: trustworthy, information-first, established. Creates the feeling of authority through familiar print conventions. Often deliberately old-school as a statement of serious journalism.",
        "bestFor": "news sites, investigative journalism, archival projects."
      },
      {
        "name": "Zine-Inspired Design",
        "category": "typography-print",
        "previewClass": "preview-zine",
        "title": "Zine-Inspired Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "DIY print culture brought online — cut-and-paste aesthetics, misregistered type, photocopier textures, hand-drawn elements. Signals independence and authenticity. Sub-cultural communication style. Raw, personal, and unapologetically lo-fi.",
        "bestFor": "independent artists, activist projects, music/subculture platforms."
      },
      {
        "name": "Analog / Print-Inspired Design",
        "category": "typography-print",
        "previewClass": "preview-analog",
        "title": "Analog / Print-Inspired Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Simulates the warmth of physical print — paper textures, ink bleeds, registration marks, slightly imperfect typography. Digital design that misses physical media. Counterculture to pixel-perfect screens. Creates warmth and tactility in an inherently cold medium.",
        "bestFor": "artisan brands, independent publishers, craft-focused products."
      },
      {
        "name": "Kinetic Typography",
        "category": "typography-print",
        "previewClass": "preview-kinetic-typography",
        "title": "Kinetic Typography",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Text as animation — letters that grow, split, orbit, or pulse in sync with meaning. Type communicates through movement as well as letterform. Popularised in film titles and advertising. Online, it's used to create memorable hero sections where the words themselves perform.",
        "bestFor": "hero sections, loading states, brand films, creative agency sites."
      },
      {
        "name": "Chromatic Typography",
        "category": "typography-print",
        "previewClass": "preview-chromatic",
        "title": "Chromatic Typography",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Colour applied to type as primary visual communication — gradient fills, split-colour letterforms, outlined text with coloured fills. The colour system within the type itself carries meaning and emotion. Makes headlines feel like visual art rather than just words.",
        "bestFor": "brand launches, product announcements, creative tools, vibrant SaaS."
      },
      {
        "name": "Variable Font–Driven Design",
        "category": "typography-print",
        "previewClass": "preview-variable-font",
        "title": "Variable Font–Driven Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Uses modern variable font technology — single font files with axes for weight, width, slant, and more — to create fluid typography that morphs as you scroll or interact. Typography becomes genuinely responsive, not just sized differently.",
        "bestFor": "experimental editorial, interactive portfolios, technically ambitious projects."
      },
      {
        "name": "Monospaced Editorial Design",
        "category": "typography-print",
        "previewClass": "preview-monospaced-editorial",
        "title": "Monospaced Editorial Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Monospace typefaces used as a primary editorial voice, not just for code. Communicates precision, objectivity, and technical thinking. Pairs a terminal-native aesthetic with editorial layout conventions. Creates the feeling of reading a technical document that's been beautifully designed.",
        "bestFor": "technical blogs, developer tools, design systems documentation."
      }
    ]
  },
  {
    "id": "cultural-aesthetic",
    "name": "Cultural & Aesthetic Movements",
    "icon": "◈",
    "description": "Design styles rooted in specific cultural moments, subcultures, or artistic movements — carrying meaning beyond their visual elements.",
    "styles": [
      {
        "name": "Cyberpunk UI",
        "category": "cultural-aesthetic",
        "previewClass": "preview-cyberpunk",
        "title": "Cyberpunk UI",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Dark worlds, neon lights, tech-overcrowded cities — translated into UI. Green-on-black terminal aesthetics, glitch effects, scanning lines, HUD overlays. Inspired by Blade Runner, Ghost in the Shell, and Gibson's Neuromancer. High information density with an unsettling undercurrent.",
        "bestFor": "gaming, cybersecurity tools, sci-fi products, hacker-culture adjacent brands."
      },
      {
        "name": "Vaporwave",
        "category": "cultural-aesthetic",
        "previewClass": "preview-vaporwave",
        "title": "Vaporwave",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "A nostalgic, ironic aesthetic born in internet music culture — purple and pink gradients, Japanese text, retro 3D objects, glitch effects, and early internet imagery. Critiques consumerism through the lens of mall aesthetics and Windows 95 screensavers. Deeply ironic yet sincerely beautiful.",
        "bestFor": "music platforms, internet art, niche cultural products, nostalgia-driven campaigns."
      },
      {
        "name": "Y2K Aesthetic",
        "category": "cultural-aesthetic",
        "previewClass": "preview-y2k",
        "title": "Y2K Aesthetic",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Turn-of-millennium visual culture — chrome effects, metallic UI, bubble typography, alien greens and blues, butterflies and stars. The early internet's breathless optimism about technology. Makes a comeback every decade as genuine nostalgia replaces irony.",
        "bestFor": "fashion brands targeting Gen Z, music, pop culture-adjacent products."
      },
      {
        "name": "Memphis Design",
        "category": "cultural-aesthetic",
        "previewClass": "preview-memphis",
        "title": "Memphis Design",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "1980s Italian design movement — primary colours, geometric shapes, squiggles, dots, and zigzags all at once. Anti-minimalist, joyful chaos. Ettore Sottsass and the Memphis Group deliberately clashed aesthetics. Digital revival is everywhere from Instagram feeds to UI toolkits.",
        "bestFor": "lifestyle brands, playful apps, youth products, creative agencies."
      },
      {
        "name": "Postmodern Design",
        "category": "cultural-aesthetic",
        "previewClass": "preview-postmodern",
        "title": "Postmodern Design",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Rejection of modernist absolutes — quotes rule-breaking, mixes historical references, layers irony. David Carson's Ray Gun magazine is the iconic reference. Deconstructs the grid, plays with legibility, challenges whether design needs to communicate at all.",
        "bestFor": "contemporary art, design culture sites, experimental publishing."
      },
      {
        "name": "Retro Futurism",
        "category": "cultural-aesthetic",
        "previewClass": "preview-retro-futurism",
        "title": "Retro Futurism",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "The future as imagined in the past — Space Age optimism, chrome rockets, atomic-age lounge aesthetics. The 1950s/60s vision of tomorrow. Jet Age confidence translated into visual language. Orange and white, sleek forms, scientific optimism. Nostalgia for a future that never arrived.",
        "bestFor": "space companies, retro-tech brands, science communication, events."
      },
      {
        "name": "Futurism",
        "category": "cultural-aesthetic",
        "previewClass": "preview-futurism",
        "title": "Futurism",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Speed, technology, and tomorrow — dark backgrounds, electric blue and cyan highlights, motion trails, sharp geometry. Celebrates acceleration and innovation. Every element feels like it's moving forward. Associated with tech launches and products that position themselves as paradigm shifts.",
        "bestFor": "tech launches, EV companies, AI products, anything claiming to be the future."
      },
      {
        "name": "Techwear Aesthetic",
        "category": "cultural-aesthetic",
        "previewClass": "preview-techwear",
        "title": "Techwear Aesthetic",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Utilitarian-meets-high-performance fashion translated into UI — dark greys, subtle texture, system-font readouts, MOLLE-grid modularity. Feels functional, tactical, stripped of unnecessary decoration. The aesthetic of someone who built their own mechanical keyboard and wears Arc'teryx daily.",
        "bestFor": "productivity tools, hardware products, premium developer tooling."
      },
      {
        "name": "Arcade / Gaming UI",
        "category": "cultural-aesthetic",
        "previewClass": "preview-arcade",
        "title": "Arcade / Gaming UI",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Pixel fonts, scanlines, coin-insert prompts, HP bars, score displays — the language of the arcade translated to the web. Creates instant engagement through familiar game conventions. Leaderboards, streaks, and flashing animations are native to this style.",
        "bestFor": "gamification products, games, community platforms, learning apps."
      },
      {
        "name": "Anime-Inspired UI",
        "category": "cultural-aesthetic",
        "previewClass": "preview-anime",
        "title": "Anime-Inspired UI",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Deep purples, magical sparkles, dramatic typography, and cel-shaded illustration influences. Japanese animation aesthetic applied to interfaces. Intense emotion, dramatic colour shifts, kawaii and dark themes often co-existing. Deeply resonant with specific global communities.",
        "bestFor": "gaming, manga platforms, otaku-adjacent products, community apps."
      }
    ]
  },
  {
    "id": "morphisms",
    "name": "Morphisms & Material Styles",
    "icon": "◉",
    "description": "Styles defined by how they simulate or subvert the physicality of materials — glass, clay, soft foam, actual 3D objects.",
    "styles": [
      {
        "name": "Glassmorphism",
        "category": "morphisms",
        "previewClass": "preview-glassmorphism",
        "title": "Glassmorphism",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Frosted glass effect — backdrop blur, semi-transparent surfaces, subtle white borders. Creates depth by layering content over vivid backgrounds. Made famous by macOS Big Sur and Apple's design language. Works beautifully over gradients or images; falls flat on plain backgrounds.",
        "bestFor": "dashboards, app UIs, premium SaaS, any dark-themed product wanting depth."
      },
      {
        "name": "Neumorphism",
        "category": "morphisms",
        "previewClass": "preview-neumorphism",
        "title": "Neumorphism",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Soft 3D — elements appear to be extruded from the background through dual box shadows (light and dark). Creates a physical plastic/foam feeling. Extremely subtle and demanding — requires perfect colour matching between element and background. Gorgeous in isolation, challenging for complex UIs.",
        "bestFor": "finance apps, calculators, music players, any UI with simple, tactile controls."
      },
      {
        "name": "Claymorphism",
        "category": "morphisms",
        "previewClass": "preview-claymorphism",
        "title": "Claymorphism",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Elements that look like soft, squishy clay — inflated 3D shapes, bright pastel colours, exaggerated shadows, and inner glow highlights. Feels tactile and friendly. Think 3D Notion-style illustrations or Apple's sticker packs. Communicates approachability and playfulness.",
        "bestFor": "consumer apps, kids' products, wellness brands, playful SaaS."
      },
      {
        "name": "Skeuomorphism",
        "category": "morphisms",
        "previewClass": "preview-skeuomorphism",
        "title": "Skeuomorphism",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Digital elements that imitate physical objects — leather-bound notebooks, real wood textures, stitching on buttons. iOS 6-era design. Famously replaced by flat design but is seeing a quiet revival in specific contexts. Creates tangibility and anchors users in familiar metaphors.",
        "bestFor": "music apps, note-taking tools, luxury goods, nostalgia-driven products."
      },
      {
        "name": "Soft UI",
        "category": "morphisms",
        "previewClass": "preview-soft-ui",
        "title": "Soft UI",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "The gentler cousin of neumorphism — soft shadows, rounded corners, muted palettes, subtle gradients. Feels comfortable and approachable without the extremes. Popular in health, wellness, and productivity apps. Creates calm without being boring.",
        "bestFor": "health apps, mental wellness tools, productivity apps, anything needing calm."
      },
      {
        "name": "Morphism Design",
        "category": "morphisms",
        "previewClass": "preview-morphism",
        "title": "Morphism Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Umbrella term for design systems where surfaces have material qualities — glass, clay, soft foam, depth. Uses layering and blur to create spatial hierarchy. UI components have weight, physical presence. The interface feels like it occupies a three-dimensional space.",
        "bestFor": "premium app UIs, spatial computing interfaces, high-end dashboards."
      },
      {
        "name": "Organic / Blob UI",
        "category": "morphisms",
        "previewClass": "preview-blob",
        "title": "Organic / Blob UI",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Irregular, blob-shaped elements — fluid, amoeba-like borders and backgrounds. CSS border-radius pushed to extremes. Communicates growth, nature, and non-corporate warmth. Often paired with earthy or pastel palettes. The antithesis of the right-angle corporate web.",
        "bestFor": "sustainability brands, wellness, creative agencies, organic product companies."
      },
      {
        "name": "Liquid Motion Design",
        "category": "morphisms",
        "previewClass": "preview-liquid",
        "title": "Liquid Motion Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Fluid, morphing animations — shapes that breathe, liquify, and transform. SVG path morphing, WebGL distortion, CSS clip-path animations. Creates hypnotic, organic energy. The UI feels alive. Heavy on performance but extraordinary visual impact when executed well.",
        "bestFor": "creative agency hero sections, brand films, experimental portfolios."
      }
    ]
  },
  {
    "id": "layout-structure",
    "name": "Layout & Structure",
    "icon": "⊞",
    "description": "How space, columns, and composition are organised. The skeleton beneath the aesthetic — arguably the most important design decision of all.",
    "styles": [
      {
        "name": "Bento Grid Design",
        "category": "layout-structure",
        "previewClass": "preview-bento",
        "previewHtml": "<div class=\"bento-cell-1\"></div>\n            <div class=\"bento-cell-2\"></div>\n            <div class=\"bento-cell-3\"></div>",
        "title": "Bento Grid Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "CSS Grid layouts that break content into varied-size tiles, like a Japanese bento box. Each tile is a different feature, stat, or story — no two the same size. Popularised by Apple's product pages and Notion's marketing. Creates information density with visual interest.",
        "bestFor": "SaaS feature showcases, portfolio sections, product marketing pages."
      },
      {
        "name": "Grid-Based Design",
        "category": "layout-structure",
        "previewClass": "preview-grid-based",
        "title": "Grid-Based Design",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Strict adherence to grid systems — columns, gutters, baselines. Everything snaps to an invisible structure that creates visual order and rhythm. Underlying foundation of almost all good design, even when invisible. When the grid shows, it communicates precision and intentionality.",
        "bestFor": "any structured interface — dashboards, e-commerce, documentation."
      },
      {
        "name": "Broken Grid Layouts",
        "category": "layout-structure",
        "previewClass": "preview-broken-grid",
        "title": "Broken Grid Layouts",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Elements that deliberately escape their columns — overlapping sections, text running into images, containers that break the page edge. Signals energy, ambition, and creative confidence. Works because the underlying grid exists to be broken. Random breaking without a grid looks like a mistake.",
        "bestFor": "creative agencies, editorial sites, bold startup landing pages."
      },
      {
        "name": "Asymmetrical Layouts",
        "category": "layout-structure",
        "previewClass": "preview-asymmetric",
        "title": "Asymmetrical Layouts",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Visual balance achieved without symmetry — large elements on one side balanced by whitespace or small elements on the other. Creates dynamic tension and guides the eye. More interesting than symmetrical layouts but requires a stronger sense of visual weight.",
        "bestFor": "portfolio sites, brand pages, creative products."
      },
      {
        "name": "Modular Design Systems",
        "category": "layout-structure",
        "previewClass": "preview-modular",
        "previewHtml": "<div class=\"modular-cell\"></div>\n            <div class=\"modular-cell\"></div>\n            <div class=\"modular-cell\"></div>\n            <div class=\"modular-cell\"></div>\n            <div class=\"modular-cell\"></div>\n            <div class=\"modular-cell\"></div>",
        "title": "Modular Design Systems",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Component-driven design where every element is a reusable, configurable module. Design tokens, atomic components, variant systems. The page is composed of blocks, not designed as a whole. Essential for scalable products. The design system becomes a product in itself.",
        "bestFor": "design systems, product design teams, enterprise SaaS, scalable platforms."
      },
      {
        "name": "Card-Based Interfaces",
        "category": "layout-structure",
        "previewClass": "preview-card-based",
        "title": "Card-Based Interfaces",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Content organised into bounded, equal-weight cards. Each card is a self-contained unit of information. Popularised by Material Design and Pinterest. Enables responsive layouts naturally, supports scanning over reading, and scales gracefully from mobile to desktop.",
        "bestFor": "content feeds, e-commerce, news aggregators, dashboard widgets."
      },
      {
        "name": "Split-Screen Design",
        "category": "layout-structure",
        "previewClass": "preview-split-screen",
        "title": "Split-Screen Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Viewport divided into two equal halves — different colours, content, or perspectives. Creates immediate tension and choice. Often used for before/after, dual audiences, or contrast between problem and solution. Simple, bold, and unmistakable.",
        "bestFor": "comparison pages, dual-audience products, login/register screens."
      },
      {
        "name": "Fullscreen Hero Design",
        "category": "layout-structure",
        "previewClass": "preview-fullscreen-hero",
        "title": "Fullscreen Hero Design",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "100vh hero section that occupies the entire first screen — the most important content before a single scroll. Forces hierarchy decisions. What is the single most important thing? This layout demands an answer. Works when the hero content earns the real estate.",
        "bestFor": "brand launches, marketing pages, storytelling-driven products."
      },
      {
        "name": "Bento + Apple-Style Product Design",
        "category": "layout-structure",
        "previewClass": "preview-bento-apple",
        "previewHtml": "<div class=\"bento-apple-cell-1\"></div>\n            <div class=\"bento-apple-cell-2\"></div>\n            <div class=\"bento-apple-cell-3\"></div>",
        "title": "Bento + Apple-Style",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "The clean, product-feature-focused version of bento grid — monochrome tiles, SF Pro typography influences, generous white space, and feature-first copy. Each bento cell tells one product story with a headline and simple illustration. Premium and instantly legible.",
        "bestFor": "tech product pages, SaaS feature sections, hardware products."
      },
      {
        "name": "Architectural Layout Design",
        "category": "layout-structure",
        "previewClass": "preview-architectural",
        "title": "Architectural Layout Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Design inspired by architectural plans and blueprints — precise rules, structural lines, technical annotation. Treats the page like a built environment with structural and decorative elements clearly distinct. Often uses thin lines, technical typefaces, and measured negative space.",
        "bestFor": "architecture firms, engineering companies, luxury real estate, technical products."
      },
      {
        "name": "Collage Design",
        "category": "layout-structure",
        "previewClass": "preview-collage",
        "title": "Collage Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Elements layered, overlapped, and combined from disparate sources — photographs, textures, type, illustration, all in the same frame. Digital continuation of physical collage art. Creates richness and density. Feels handmade and curated. Every detail rewards closer inspection.",
        "bestFor": "fashion, music, cultural brands, art-direction-heavy campaigns."
      },
      {
        "name": "Isometric Design",
        "category": "layout-structure",
        "previewClass": "preview-isometric",
        "title": "Isometric Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "3D perspective achieved through a 30-degree isometric projection — no vanishing points, consistent scale at any distance. Makes complex systems comprehensible through spatial visualisation. Highly popular in SaaS illustration style. Feels technical and informative simultaneously.",
        "bestFor": "tech illustrations, infrastructure diagrams, SaaS marketing illustrations."
      }
    ]
  },
  {
    "id": "tech-digital",
    "name": "Tech & Digital-Native",
    "icon": "⌗",
    "description": "Styles born from software culture, developer aesthetics, and the specific visual languages of platforms and products.",
    "styles": [
      {
        "name": "Terminal / Hacker Aesthetic",
        "category": "tech-digital",
        "previewClass": "preview-terminal",
        "title": "Terminal / Hacker Aesthetic",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Command line culture made beautiful — green text on black, monospace fonts, prompt symbols, blinking cursors. Signals technical credibility and depth. The original developer aesthetic. Used sincerely by technical tools and ironically by brands wanting to signal engineering-first culture.",
        "bestFor": "developer tools, CLI products, security companies, open-source projects."
      },
      {
        "name": "Developer-First Design",
        "category": "tech-digital",
        "previewClass": "preview-dev-first",
        "title": "Developer-First Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Code snippets as hero elements, dark IDE-inspired aesthetics, copy buttons everywhere, syntax highlighting as visual design. Shows the product's value through the code itself. Signals: \"we built this for engineers.\" The design is proof of technical credibility.",
        "bestFor": "APIs, SDKs, developer platforms, documentation sites, DevTools."
      },
      {
        "name": "SaaS Landing Page Design",
        "category": "tech-digital",
        "previewClass": "preview-saas",
        "title": "SaaS Landing Page Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Clean, benefit-focused, conversion-optimised. Blue and white, social proof strips, feature grids, CTA buttons above the fold. So ubiquitous it's almost a genre unto itself. Instantly communicates: trustworthy software product. Works because it's a familiar pattern users understand.",
        "bestFor": "SaaS products, productivity tools, B2B software, startup MVPs."
      },
      {
        "name": "Dashboard UI Design",
        "category": "tech-digital",
        "previewClass": "preview-dashboard",
        "title": "Dashboard UI Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Dense information architecture with visual hierarchy — charts, metrics, tables, and filters all coexisting. Dark-themed dashboards communicate power and professionalism. Every pixel justifies its existence through data. The challenge is managing complexity without chaos.",
        "bestFor": "analytics tools, business intelligence, admin panels, monitoring systems."
      },
      {
        "name": "Data-Driven Design",
        "category": "tech-digital",
        "previewClass": "preview-data-driven",
        "title": "Data-Driven Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Visualisation-first — charts, graphs, and numbers as design elements rather than additions. Every visual choice serves data comprehension. Typography, colour, and layout all optimised for reading information quickly and accurately. D3.js, Recharts, and custom SVG as design medium.",
        "bestFor": "research platforms, data journalism, analytics products, reporting tools."
      },
      {
        "name": "Dark Mode Design",
        "category": "tech-digital",
        "previewClass": "preview-dark-mode",
        "title": "Dark Mode Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Not just a colour inversion — dark mode is its own design language. Deep charcoal surfaces, carefully calibrated element elevation, reduced-saturation colours, glowing accents. Reduces eye strain, saves battery on OLED screens, and creates a premium, focused feel. Now expected as a first-class experience.",
        "bestFor": "developer tools, IDEs, late-night products, any premium technical product."
      },
      {
        "name": "Flat Design",
        "category": "tech-digital",
        "previewClass": "preview-flat",
        "title": "Flat Design",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "No gradients, no shadows, no depth — purely 2D. Microsoft's Metro/Modern design language popularised it in 2010. Clean, fast-loading, icon-forward. Simple geometric shapes and saturated colours. Easy to maintain, scales well across platforms. The universal base layer of modern UI.",
        "bestFor": "any digital product. Universal baseline that everything else builds on."
      },
      {
        "name": "Material Design",
        "category": "tech-digital",
        "previewClass": "preview-material",
        "title": "Material Design",
        "tag": "Classic",
        "tagClass": "tag-classic",
        "desc": "Google's design system — surfaces as paper with ink printed on them. Z-elevation, realistic shadows, bold primary colours, floating action buttons. Opinionated, comprehensive, and universal. Material 3 continues to evolve it. The template for most consumer-facing Android and web products.",
        "bestFor": "Android apps, Google ecosystem products, enterprise web apps."
      },
      {
        "name": "Fluent Design",
        "category": "tech-digital",
        "previewClass": "preview-fluent",
        "title": "Fluent Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Microsoft's design language — Acrylic blur effects, light and depth, motion-driven reveals. Windows 11's entire visual language is Fluent. Balances translucency with legibility. Feels native and polished in Microsoft contexts. Increasingly influential on cross-platform design.",
        "bestFor": "Windows apps, Microsoft ecosystem products, productivity tools."
      },
      {
        "name": "Gradient-Heavy Design",
        "category": "tech-digital",
        "previewClass": "preview-gradient",
        "title": "Gradient-Heavy Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Expressive, multi-stop gradients as primary design elements — mesh gradients, conic gradients, animated colour shifts. Moves away from flat design's rigidity. When done well, gradients create depth, warmth, and vibrancy. When done poorly, they become generic \"AI startup\" purple soup.",
        "bestFor": "creative tools, AI products (carefully), lifestyle apps, brand hero sections."
      },
      {
        "name": "Futuristic SaaS Design",
        "category": "tech-digital",
        "previewClass": "preview-futuristic-saas",
        "title": "Futuristic SaaS Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Deep dark backgrounds, electric purple or blue accent lights, abstract 3D elements, orbit lines, and particle effects. The \"we're building the future\" aesthetic. Signals ambition and innovation. Vercel, Linear, and many AI companies live here. Feels like science fiction becoming product.",
        "bestFor": "AI/ML tools, infrastructure products, next-gen platform companies."
      },
      {
        "name": "Noise / Grain Texture Design",
        "category": "tech-digital",
        "previewClass": "preview-noise",
        "title": "Noise / Grain Texture Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "SVG noise filters or CSS grain overlays add film-like texture to digital surfaces. Counteracts the sterile perfection of flat design. Adds warmth, tangibility, and visual interest. Used subtly, it elevates; used heavily, it creates atmosphere. Popular across premium and artistic contexts.",
        "bestFor": "creative brands, portfolios, premium products wanting organic warmth."
      }
    ]
  },
  {
    "id": "motion-interaction",
    "name": "Motion & Interaction",
    "icon": "◐",
    "description": "Design where movement isn't decoration — it's communication. How things move tells users what they do.",
    "styles": [
      {
        "name": "Motion-First Design",
        "category": "motion-interaction",
        "previewClass": "preview-motion-first",
        "title": "Motion-First Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Animation defined before visuals — movement and timing are the primary design decisions. Static screenshots don't represent the design; the experience only exists in motion. Requires designing in time, not just space. Creates memorable first impressions that static competitors can't replicate.",
        "bestFor": "creative agencies, storytelling products, brand experiences, interactive portfolios."
      },
      {
        "name": "Microinteraction Design",
        "category": "motion-interaction",
        "previewClass": "preview-microinteraction",
        "title": "Microinteraction Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Tiny animations that respond to specific user actions — button presses that ripple, likes that burst, checkmarks that draw themselves. Dan Saffer's foundational concept. Creates delight and feedback at the granular level. The difference between a product that feels alive and one that feels dead.",
        "bestFor": "consumer apps, social products, anything where emotional connection matters."
      },
      {
        "name": "Immersive Storytelling",
        "category": "motion-interaction",
        "previewClass": "preview-immersive",
        "title": "Immersive Storytelling",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Full-screen, multimedia narrative experiences — the page becomes a cinema. Combines video, audio, scroll-triggered animation, and typography into a single coherent story. The user is a reader and a participant. The New York Times' Snowfall article invented this category in 2012.",
        "bestFor": "investigative journalism, brand films, annual reports, product stories."
      },
      {
        "name": "Scrollytelling",
        "category": "motion-interaction",
        "previewClass": "preview-scrollytelling",
        "title": "Scrollytelling",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Scroll position drives narrative — as you scroll, the story unfolds through text reveals, animation triggers, and perspective changes. Converts reading into active participation. Requires careful choreography: too much and it's frustrating, too little and it's pointless.",
        "bestFor": "editorial features, data journalism, onboarding flows, annual reports."
      },
      {
        "name": "Cinematic Web Design",
        "category": "motion-interaction",
        "previewClass": "preview-cinematic",
        "title": "Cinematic Web Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Film language applied to web — letterboxing, title cards, dramatic lighting, scene transitions. The page feels like a film experience. Wide-aspect ratios, atmospheric video, deliberate pacing. Borrows cinematography conventions to create narrative gravity and emotional weight.",
        "bestFor": "film studios, luxury brands, narrative products, experience-driven companies."
      },
      {
        "name": "Parallax Design",
        "category": "motion-interaction",
        "previewClass": "preview-parallax",
        "title": "Parallax Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Foreground and background elements scroll at different speeds, creating depth perception. Simple but effective when used intentionally. Overused in the 2010s, now more restrained. Modern parallax is subtle — a slight depth shift rather than dramatic layer separation.",
        "bestFor": "hero sections, product showcases, storytelling pages with landscape imagery."
      },
      {
        "name": "Interaction-Heavy Design",
        "category": "motion-interaction",
        "previewClass": "preview-interaction",
        "title": "Interaction-Heavy Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Every element responds to user input — hover, click, touch, drag all produce distinct feedback. The interface is participatory, not passive. Creates a sense of physical agency in a digital medium. Requires careful performance management and accessibility consideration.",
        "bestFor": "portfolio sites, creative tools, demo experiences, educational apps."
      },
      {
        "name": "Oversized Cursor Design",
        "category": "motion-interaction",
        "previewClass": "preview-cursor",
        "title": "Oversized Cursor Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Custom cursors that replace the default pointer — large circles, crosshairs, branded shapes. The cursor itself becomes part of the experience. Often scales, changes colour, or morphs based on context. Creates immediate distinction and signals that the experience has been thought through in detail.",
        "bestFor": "creative agency sites, portfolio pages, interactive art experiences."
      },
      {
        "name": "Cursor-Reactive Design",
        "category": "motion-interaction",
        "previewClass": "preview-cursor-reactive",
        "title": "Cursor-Reactive Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Elements that respond to cursor position — gradient backgrounds that shift toward the cursor, text that follows mouse movement, particles that avoid or pursue. Creates a feeling of physical presence in digital space. JavaScript-heavy but creates unforgettable experiences.",
        "bestFor": "creative portfolios, award-site-style experiences, brand activations."
      },
      {
        "name": "Motion Graphics–Inspired UI",
        "category": "motion-interaction",
        "previewClass": "preview-motion-graphics",
        "title": "Motion Graphics–Inspired UI",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "After Effects and Cinema 4D aesthetic translated to CSS and WebGL — shapes that orbit, transform, and compose themselves. Treats every page element as an animation keyframe. Borrows broadcast design language (station IDs, title sequences) for web contexts. Creates memorable brand moments.",
        "bestFor": "broadcasting companies, creative studios, brand hero sections."
      }
    ]
  },
  {
    "id": "art-generative",
    "name": "Art & Generative Design",
    "icon": "∿",
    "description": "Where code becomes art and algorithms generate the aesthetic. Design that couldn't exist without computation.",
    "styles": [
      {
        "name": "3D Web Design",
        "category": "art-generative",
        "previewClass": "preview-3d",
        "title": "3D Web Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "CSS 3D transforms, WebGL models, and Three.js scenes embedded directly in web pages. Products displayed as rotatable 3D objects, abstract 3D environments as hero backgrounds. Creates a dimension that flat design can't achieve. GPU-intensive but increasingly accessible.",
        "bestFor": "product showcases, hardware companies, gaming, premium tech brands."
      },
      {
        "name": "WebGL / Three.js Experiences",
        "category": "art-generative",
        "previewClass": "preview-webgl",
        "title": "WebGL / Three.js Experiences",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "GPU-rendered 3D scenes in the browser — particle systems, shader art, interactive 3D environments. The most technically ambitious category of web design. Creates experiences impossible in CSS. Award-winning sites at Awwwards live here. Requires significant engineering investment.",
        "bestFor": "creative developer portfolios, luxury products, high-investment brand experiences."
      },
      {
        "name": "Generative Design",
        "category": "art-generative",
        "previewClass": "preview-generative",
        "title": "Generative Design",
        "tag": "Experimental",
        "tagClass": "tag-experimental",
        "desc": "Algorithms generate the visual output — no two instances are the same. Perlin noise, L-systems, particle physics, reaction-diffusion all create organic, rule-based patterns. Processing and p5.js brought this to web. Design as a system that runs, not just a file that renders.",
        "bestFor": "digital art, NFT platforms, generative branding, creative portfolios."
      },
      {
        "name": "Parametric Design",
        "category": "art-generative",
        "previewClass": "preview-parametric",
        "title": "Parametric Design",
        "tag": "Experimental",
        "tagClass": "tag-experimental",
        "desc": "Shape and form defined by adjustable parameters — change one value and the entire system responds. Borrowed from architecture (Zaha Hadid) and industrial design. In web, creates UI where the visual system adapts to data or user input. The design is a function, not an image.",
        "bestFor": "architecture firms, computational design tools, data-responsive interfaces."
      },
      {
        "name": "Abstract Geometry Design",
        "category": "art-generative",
        "previewClass": "preview-abstract",
        "title": "Abstract Geometry Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Geometric shapes as primary visual language — circles, polygons, morphing paths used as atmospheric elements rather than illustrations. Creates visual sophistication without representation. The shapes carry mood through colour and motion rather than recognisable form.",
        "bestFor": "technology brands, financial products, serious B2B wanting visual sophistication."
      },
      {
        "name": "AI-Generated Visual Design",
        "category": "art-generative",
        "previewClass": "preview-ai-visual",
        "title": "AI-Generated Visual Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Midjourney, DALL-E, and Stable Diffusion imagery as design elements — dreamlike, surreal, or photo-realistic imagery generated from prompts. Creates visual styles impossible through traditional photography or illustration. Raises questions of authenticity. Use carefully and transparently.",
        "bestFor": "concept exploration, niche products, editorial illustration, experimental campaigns."
      },
      {
        "name": "Illustration-Heavy Design",
        "category": "art-generative",
        "previewClass": "preview-illustration",
        "title": "Illustration-Heavy Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Custom illustration as the primary visual system rather than photography or UI components. Creates immediate personality, explains complex concepts visually, and builds distinct brand identity. Expensive but powerful. Stripe's illustrations are the iconic reference. Every brand gets to own its visual world.",
        "bestFor": "consumer products, FinTech, any brand wanting distinctive visual ownership."
      },
      {
        "name": "Computational Design",
        "category": "art-generative",
        "previewClass": "preview-computational",
        "title": "Computational Design",
        "tag": "Experimental",
        "tagClass": "tag-experimental",
        "desc": "Design processes where code is the design tool — p5.js sketches, Processing compositions, algorithmic typography. The designer writes programs rather than drawing. Output is determined by logic, not manual composition. The computer's decisions are part of the aesthetic.",
        "bestFor": "research projects, creative coding exhibitions, digital art platforms."
      },
      {
        "name": "Experimental Web Design",
        "category": "art-generative",
        "previewClass": "preview-experimental",
        "title": "Experimental Web Design",
        "tag": "Experimental",
        "tagClass": "tag-experimental",
        "desc": "Treats the browser as an artistic medium with no constraints — unconventional navigation, non-linear content, interface as art. Bruno Simon's portfolio (a 3D driving game) is the canonical example. Pushes CSS, WebGL, and interaction design beyond their conventional limits.",
        "bestFor": "creative developer portfolios, interactive art, concept demonstrations."
      }
    ]
  },
  {
    "id": "retro-nostalgic",
    "name": "Retro & Nostalgic",
    "icon": "⌚",
    "description": "The web looking back at itself — early internet aesthetics, analog warmth, and designs that reference the physical past.",
    "styles": [
      {
        "name": "Retro Web / Web 1.0 Revival",
        "category": "retro-nostalgic",
        "previewClass": "preview-retro-web",
        "title": "Retro Web / Web 1.0 Revival",
        "tag": "Experimental",
        "tagClass": "tag-experimental",
        "desc": "Geocities-era aesthetics earnestly revived — tiling backgrounds, blinking text, visitor counters, Comic Sans, animated GIFs, dark blue backgrounds with yellow text. The early web's chaotic democracy and personal expression celebrated without irony. Profoundly human compared to polished modern design.",
        "bestFor": ""
      },
      {
        "name": "Indie Web Aesthetic",
        "category": "retro-nostalgic",
        "previewClass": "preview-indie-web",
        "title": "Indie Web Aesthetic",
        "tag": "Experimental",
        "tagClass": "tag-experimental",
        "desc": "Personal, idiosyncratic, deliberately non-commercial web design. Hand-coded pages, RSS feeds, webmention support. Part of the small-web movement that values ownership and individuality over engagement metrics. The antithesis of growth-hacking UX. Deeply authentic and increasingly rare.",
        "bestFor": ""
      },
      {
        "name": "Minimal Monospace Design",
        "category": "retro-nostalgic",
        "previewClass": "preview-monospace",
        "title": "Minimal Monospace Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Monospace typography as a full design system — courier-like fonts for body copy, headers, and UI elements. Creates technical precision and readability. Often paired with stark colour palettes. The technical writer's aesthetic. Signals thoughtfulness and discomfort with decoration.",
        "bestFor": ""
      },
      {
        "name": "Museum / Exhibition Style Design",
        "category": "retro-nostalgic",
        "previewClass": "preview-museum",
        "title": "Museum / Exhibition Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "The visual language of the museum wall — white space as breathing room, object numbers and catalogue references, understated sans-serifs, deliberate pacing. Content treated as an exhibit. Communicates cultural authority and curation. Nothing competes with the work itself.",
        "bestFor": ""
      },
      {
        "name": "Digital Magazine Aesthetic",
        "category": "retro-nostalgic",
        "previewClass": "preview-digital-magazine",
        "title": "Digital Magazine Aesthetic",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Print magazine sensibility translated to screen — volume numbers, issue dates, strong colour blocking, editorial photography. Communicates seriousness and regularity. Readers know what to expect with each issue. The structure and rhythm of publishing as a design choice.",
        "bestFor": ""
      },
      {
        "name": "Luxury Brand Design",
        "category": "retro-nostalgic",
        "previewClass": "preview-luxury",
        "title": "Luxury Brand Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Dark backgrounds, gold or warm-white typography, extreme white space, slow loading by design, single-product focus. Less information is more expensive. The Rolls-Royce of web design — everything moves deliberately. Never shouts. Creates desire through restraint and implication.",
        "bestFor": ""
      },
      {
        "name": "High-Fashion Web Design",
        "category": "retro-nostalgic",
        "previewClass": "preview-high-fashion",
        "title": "High-Fashion Web Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Season codes, editorial photography, stark serif type, unexpected layout choices. Eschews usability conventions for aesthetic ones. Balenciaga's website is famously difficult to use — intentionally. Fashion design prioritises feeling over function in ways that would be catastrophic in SaaS but perfect for culture.",
        "bestFor": ""
      },
      {
        "name": "Luxury Minimalism",
        "category": "retro-nostalgic",
        "previewClass": "preview-luxury-minimal",
        "title": "Luxury Minimalism",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Minimalism with expensive taste — off-white backgrounds, gold hairline rules, serif headings, generous tracking in headlines. Communicates: \"we don't need to try.\" Every element is exquisitely placed. Often used by wealth management, premium real estate, and heritage fashion brands.",
        "bestFor": ""
      },
      {
        "name": "Scandinavian Minimalism",
        "category": "retro-nostalgic",
        "previewClass": "preview-scandi",
        "title": "Scandinavian Minimalism",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Warm minimalism inspired by Nordic design — off-whites, natural textures, carefully considered negative space, functional beauty. Hygge and lagom translated to pixels. Feels lived-in rather than sterile. Human warmth within minimalist constraints. Think IKEA's digital presence.",
        "bestFor": ""
      }
    ]
  },
  {
    "id": "systems-design",
    "name": "Systems & Principles-Based Design",
    "icon": "◫",
    "description": "Design as a repeatable system — concerned with the rules that generate good outcomes rather than individual visual choices.",
    "styles": [
      {
        "name": "Accessibility-First Design",
        "category": "systems-design",
        "previewClass": "preview-a11y",
        "title": "Accessibility-First Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "WCAG compliance as design foundation — 4.5:1 contrast ratios, semantic HTML, focus indicators, screen reader support. Not a limitation: accessibility constraints often produce better design for everyone. The curb cut effect: ramps help wheelchair users, cyclists, and parents with prams alike.",
        "bestFor": "public services, healthcare, financial tools, and frankly all products."
      },
      {
        "name": "Performance-First Design",
        "category": "systems-design",
        "previewClass": "preview-perf-first",
        "title": "Performance-First Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Every aesthetic decision evaluated against its performance cost. Images compressed to minimal viable quality. Fonts subset. Animations CSS-only. No third-party scripts unless essential. Creates design that functions beautifully on 3G — particularly relevant for African mobile-first contexts where data is expensive.",
        "bestFor": "Africa-market products, rural-accessible tools, any global product with diverse connectivity."
      },
      {
        "name": "Mobile-First Design",
        "category": "systems-design",
        "previewClass": "preview-mobile-first",
        "title": "Mobile-First Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Designed for small screens first, expanded to large. Forces prioritisation — you can't put everything on a 375px screen, so you discover what actually matters. In South Africa, where most users access the web on mobile, this isn't a methodology choice — it's a reality requirement.",
        "bestFor": "all African-market products. Most consumer apps globally. The default starting point."
      },
      {
        "name": "Grid-Based Design",
        "category": "systems-design",
        "previewClass": "preview-grid-based",
        "title": "Swiss Brutalism",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "The unlikely fusion of Swiss grid precision and brutal rawness — strict structural underlying grids combined with aggressive typography and harsh contrasts. Uses Helvetica at brutal scale, red and black primaries, visible column structure. Discipline and aggression in the same breath.",
        "bestFor": "design publications, cultural institutions wanting gravitas and edge."
      },
      {
        "name": "Industrial Design Aesthetic",
        "category": "systems-design",
        "previewClass": "preview-industrial",
        "title": "Industrial Design Aesthetic",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Machine aesthetics applied to UI — warning stripes, metal textures, utility typography, structural grid patterns. Communicates durability, precision, and power. Common in manufacturing, engineering, and logistics software. Function expressed so clearly it becomes beauty.",
        "bestFor": "manufacturing software, engineering tools, logistics platforms, hardware brands."
      },
      {
        "name": "Layered Depth Design",
        "category": "systems-design",
        "previewClass": "preview-layered-depth",
        "title": "Layered Depth Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Z-axis used as a primary design tool — foreground, midground, background clearly differentiated through colour, blur, and opacity. Creates visual hierarchy through spatial depth rather than just size. The page has physical presence. Important information lives at the front.",
        "bestFor": "complex dashboards, multi-layer applications, premium product experiences."
      },
      {
        "name": "Postmodern Design",
        "category": "systems-design",
        "previewClass": "preview-postmodern",
        "title": "Art Direction–Driven Design",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "Every section of the page has its own visual language, directed by an art director rather than constrained to a design system. Creates editorial variety — scrolling through feels like flipping through a portfolio. Requires strong central vision to prevent incoherence.",
        "bestFor": "agency websites, annual reports, editorial projects, brand showcases."
      }
    ]
  },
  {
    "id": "future-native",
    "name": "Future & AI-Native Design",
    "icon": "⬡",
    "description": "The frontier — design systems being invented right now for new paradigms: spatial computing, AI agents, and conversational interfaces.",
    "styles": [
      {
        "name": "AI-Agent Interface Design",
        "category": "future-native",
        "previewClass": "preview-ai-agent",
        "title": "AI-Agent Interface Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Interfaces designed around AI agents that act — not just answer. Progress indicators for multi-step tasks, tool call visualisation, uncertainty communication, and intervention points where humans take back control. New challenges: how do you show a computer thinking? This design language is still being invented.",
        "bestFor": "AI workflow tools, coding assistants, autonomous agents, LLM-powered products."
      },
      {
        "name": "Conversational UI Design",
        "category": "future-native",
        "previewClass": "preview-conversational",
        "title": "Conversational UI Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Chat as primary interaction model — bubbles, typing indicators, message threading, quick reply suggestions. Design around dialogue rather than forms and buttons. Reduces UI surface area massively. Challenges: discoverability, history, and the moment conversation is worse than a button.",
        "bestFor": "chatbots, AI assistants, customer service, voice interfaces."
      },
      {
        "name": "Spatial Computing UI",
        "category": "future-native",
        "previewClass": "preview-spatial-computing",
        "title": "Spatial Computing UI",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "visionOS and AR/VR design conventions — windows that float in physical space, translucent panels, eye-tracked interactions, depth and occlusion as design elements. Apple Vision Pro established a new visual language. The design constraints of 3D space differ fundamentally from 2D screens.",
        "bestFor": "Apple Vision Pro apps, AR applications, future-forward product exploration."
      },
      {
        "name": "AI-native UX Design",
        "category": "future-native",
        "previewClass": "preview-ai-native",
        "title": "AI-Native UX Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Products built from the ground up around AI capabilities — not AI bolted onto existing UX. Interfaces that adapt to individual users, context-aware defaults, natural language everywhere. Challenges every UX assumption built over 40 years. The biggest design shift since the touchscreen.",
        "bestFor": "AI-first products, next-generation SaaS, any product category being rebuilt with LLMs."
      },
      {
        "name": "High-Tech Futurism",
        "category": "future-native",
        "previewClass": "preview-high-tech",
        "title": "High-Tech Futurism",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Deeply dark UIs, electric cyan accents, particle systems, thin scanning lines, and radial UI elements. Military HUD meets consumer interface. Creates the feeling of operating advanced systems. Associated with defence tech, quantum computing, and next-gen infrastructure companies.",
        "bestFor": "frontier tech companies, advanced engineering tools, science-fiction becoming product."
      },
      {
        "name": "Narrative Product Design",
        "category": "future-native",
        "previewClass": "preview-narrative",
        "title": "Narrative Product Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "The product itself tells its story — feature discovery through narrative, onboarding as a journey, contextual storytelling at the point of value. Combines UX with content strategy. Users understand why they're doing something, not just how. Deep context delivered exactly when needed.",
        "bestFor": "complex products with steep learning curves, innovative tools, mission-driven companies."
      },
      {
        "name": "Interactive Documentary Style",
        "category": "future-native",
        "previewClass": "preview-interactive-doc",
        "title": "Interactive Documentary Style",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Long-form multimedia exploration of a single topic — chapter navigation, embedded video, data visualisations, and text interwoven. The user controls their depth of engagement. National Geographic, ProPublica, and The Guardian define this space. Web journalism at its highest craft.",
        "bestFor": "investigative journalism, in-depth brand stories, complex topic explainers."
      },
      {
        "name": "Creative Developer Aesthetic",
        "category": "future-native",
        "previewClass": "preview-creative-dev",
        "title": "Creative Developer Aesthetic",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "The visual language of developers who are also artists — code snippets as design elements, dark IDEs as aesthetic context, function calls as typography. The craft of engineering displayed as proudly as the product. Personal brand design for people who build things.",
        "bestFor": "developer portfolios, engineering blogs, OSS project sites, technical personal brands."
      },
      {
        "name": "Interactive Portfolio Design",
        "category": "future-native",
        "previewClass": "preview-interactive-portfolio",
        "title": "Interactive Portfolio Design",
        "tag": "Emerging",
        "tagClass": "tag-emerging",
        "desc": "Portfolios that demonstrate skill through the experience itself — a designer's portfolio that is beautifully designed, a developer's portfolio that does something technically impressive. The best portfolio proves the brief before you read a single case study.",
        "bestFor": "designers, developers, creative professionals whose work is their proof."
      },
      {
        "name": "Startup Modernism",
        "category": "future-native",
        "previewClass": "preview-startup",
        "title": "Startup Modernism",
        "tag": "Modern",
        "tagClass": "tag-modern",
        "desc": "The clean, optimistic visual language of venture-backed software companies — friendly illustrations, product screenshots, testimonial rows, clear benefit-driven copy. Polished but approachable. Communicates: serious product, accessible team. The dominant aesthetic of Y Combinator demo days.",
        "bestFor": "early-stage startups, VC pitch materials, product-market-fit stage companies."
      }
    ]
  }
];
