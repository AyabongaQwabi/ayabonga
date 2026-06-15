import { Helmet } from 'react-helmet-async';
import { PageShell } from '../components/layout/PageShell';
import { TransitionLink } from '../components/ui/TransitionLink';
import { absoluteUrl, SITE_ORIGIN } from '../lib/site-config';
import {
  buildJsonLdGraph,
  buildOrganizationSchema,
  buildWebSiteSchema,
  authorGraphNode,
  buildBreadcrumbSchema,
  personRef,
  organizationRef,
  websiteRef,
} from '../lib/entity-schema';

const PAGE_TITLE =
  'Qwabi Family History | AmaQithi Clan | San People of Lady Frere, Eastern Cape';
const PAGE_DESCRIPTION =
  'The Qwabi family are San (AbaThwa) people of the AmaQithi clan from Lady Frere, Glen Grey, and Cacadu in the Eastern Cape. Descendants of the Joka family who trace their roots to the banks of the White Kei River and the territory of San chief Madolo. Documented oral history and GEDCOM lineage.';
const CANONICAL = absoluteUrl('/qwabi-family');
const PAGE_DATE = '2026-06-15';

const OG_IMAGE =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/634131924_4362348684012184_2809328754212142225_n%20%281%29-n9dEY5Noh5Y0nxfTCK3TwAMABTs8KG.jpg';

const MAP_OVERVIEW = '/images/family/qwabi-qithi-territory-map.png';
const MAP_RHODANA = '/images/family/qithi-rodana-map.png';

function buildFamilyPageSchema() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Qwabi Family History', path: '/qwabi-family' },
  ]);

  const webPage = {
    '@type': 'WebPage',
    '@id': `${CANONICAL}#webpage`,
    url: CANONICAL,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    isPartOf: websiteRef(),
    about: { '@id': `${CANONICAL}#family` },
    inLanguage: 'en-ZA',
    datePublished: `${PAGE_DATE}T12:00:00+02:00`,
    dateModified: `${PAGE_DATE}T12:00:00+02:00`,
    breadcrumb: { '@id': `${CANONICAL}#breadcrumb` },
  };

  const article = {
    '@type': 'Article',
    '@id': `${CANONICAL}#article`,
    headline: 'Qwabi Family History: AmaQithi San Clan Origins in the Eastern Cape',
    description: PAGE_DESCRIPTION,
    url: CANONICAL,
    author: personRef(),
    publisher: organizationRef(),
    image: OG_IMAGE,
    mainEntityOfPage: { '@id': `${CANONICAL}#webpage` },
    inLanguage: 'en-ZA',
    datePublished: `${PAGE_DATE}T12:00:00+02:00`,
    dateModified: `${PAGE_DATE}T12:00:00+02:00`,
    articleSection: 'Family History',
    keywords:
      'Qwabi family, Qwabi surname, AmaQithi clan, Qithi clan, AmaQithi San clan, Lady Frere, Glen Grey, Eastern Cape, San people, AbaThwa, Cacadu, Chris Hani District, Hala 2, White Kei River, Agnes Lady Frere, Chief Madolo, Joka family, Qwabi Joka, Bulhoek Massacre, AbaThembu, Rhodana, Queen Nonesi, Mqithi clan, AmaQithi izibongo',
    about: { '@id': `${CANONICAL}#family` },
  };

  const familyEntity = {
    '@type': 'Thing',
    '@id': `${CANONICAL}#family`,
    name: 'Qwabi Family',
    alternateName: ['AmaQithi clan', 'Qithi clan', 'Mqithi clan', 'Joka family'],
    description:
      'The Qwabi family are San (AbaThwa) people of the AmaQithi clan from the White Kei River basin, Lady Frere, Eastern Cape. Part of the Joka family lineage. Not Thembu by origin but assimilated into the Thembu nation.',
    sameAs: [`${SITE_ORIGIN}/blog/qwabi-family-history-amaqithi`],
  };

  const placeAgnes = {
    '@type': 'Place',
    '@id': `${CANONICAL}#place-agnes`,
    name: 'Agnes',
    description:
      'Village on the banks of the White Kei River in Lady Frere, Eastern Cape. Historic homeland of the Joka family (Qwabi) and territory associated with San chief Madolo in the 1880s.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lady Frere',
      addressRegion: 'Eastern Cape',
      addressCountry: 'ZA',
    },
  };

  const placeQithi = {
    '@type': 'Place',
    '@id': `${CANONICAL}#place-qithi`,
    name: 'Qithi Village',
    alternateName: ['Mqithi Village'],
    description:
      'Village in the Lady Frere area, Eastern Cape. Named after the San leader Mqithi. Located directly adjacent to Rhodana, the Thembu Great Place established by Queen Nonesi in 1841.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lady Frere',
      addressRegion: 'Eastern Cape',
      addressCountry: 'ZA',
    },
  };

  return buildJsonLdGraph([
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    authorGraphNode(),
    webPage,
    article,
    familyEntity,
    placeAgnes,
    placeQithi,
    {
      ...breadcrumb,
      '@id': `${CANONICAL}#breadcrumb`,
    },
  ]);
}

const generations = [
  {
    gen: 'Earliest known ancestor',
    name: 'Joka',
    detail:
      'The Qwabi family belongs to the Joka family, San (AbaThwa) people from the White Kei River basin in the Lady Frere district. The earliest verified ancestor in our line is Joka, whose homestead was in or near the village of Agnes on the banks of the White Kei River. It is believed the Joka family were among the San clans who fell under the authority of Chief Madolo, who led San people in this region from around 1835 until 1856.',
  },
  {
    gen: '2nd Generation',
    name: 'Qwabi (son of Joka)',
    detail:
      'Qwabi Joka (born c. 1842) is the ancestor from whom the Qwabi surname derives. He was born in the White Kei / Agnes / Mqithi area and grew up in a period when San families were actively negotiating their place alongside Thembu chiefs in the Cacadu basin. He fathered four known children: Nosenti (born 1861), Bushman, Halile Jonas, and Molosi (Oliphant). He died in 1915.',
  },
  {
    gen: '3rd Generation',
    name: 'Bushman, Halile Jonas, Molosi (Oliphant)',
    detail:
      'Three sons of Qwabi Joka who established the main family branches. Bushman was named explicitly to preserve San identity. Halile Jonas joined the Church of God and Saints of Christ and died in the Bulhoek Massacre of 1921. Molosi was named after Chief Moorosi of the Phuti people, a close ally of the San. The name Moorosi was difficult for Xhosa speakers to pronounce and evolved into Molosi.',
  },
  {
    gen: '4th Generation',
    name: 'Bhangile, Dumile, Yanki, George, and others',
    detail:
      'Bhangile (son of Halile Jonas, 1913-2003) inherited Bushman\'s homestead in Skhwanqeni then later settled in Hala 2. Dumile (son of Molosi) was a World War 2 veteran who founded Qwabi Primary School and helped establish Hala 2. Yanki (son of Molosi) also served in World War 2.',
  },
];

const faqs = [
  {
    q: 'Who are the Qwabi family?',
    a: 'The Qwabi family are a South African family of San (AbaThwa) descent, belonging to the AmaQithi clan. They trace their roots to the Joka family from the banks of the White Kei River in the Lady Frere, Glen Grey, and Cacadu district of the Eastern Cape. They are not Thembu by origin but have assimilated into the AbaThembu nation over generations. Today the Qwabi surname is concentrated in the Chris Hani District, with branches in Hala 2, Queenstown, and Ndlovukazi (Lesseyton).',
  },
  {
    q: 'Where does the Qwabi surname come from?',
    a: 'The Qwabi surname comes from an ancestor named Qwabi, son of Joka, born around 1842 near the village of Agnes on the White Kei River in Lady Frere. The Q click consonant in "Qwabi" is a linguistic marker of San (Khoisan) heritage, not a Bantu-origin name. Click consonants in Xhosa and Zulu were absorbed from Khoisan languages through centuries of contact and intermarriage.',
  },
  {
    q: 'Are the Qwabi family San people?',
    a: 'Yes. The Qwabi family are San (AbaThwa) people by origin. Their ancestor Joka lived on the White Kei River in territory associated with San chief Madolo. The name "Bushman" was deliberately given to one of Qwabi Joka\'s sons as an act of identity preservation. The AmaQithi clan name itself carries a San phonetic root. The family assimilated into the AbaThembu nation over time but their San origin is documented in oral history, place names, and the linguistic roots of their clan name.',
  },
  {
    q: 'What is the AmaQithi clan?',
    a: 'The AmaQithi (also written as amaQithi or Mqithi clan) are a San clan whose village, Qithi, is located in the Lady Frere area directly adjacent to Rhodana, the Thembu Great Place established by Queen Nonesi in 1841. The AmaQithi are not Thembu by origin. Qithi is a San leader whose lineage is still under research. The clan name contains a palatal click consonant indigenous to Khoisan languages. The AmaQithi assimilated into the Thembu and served as rainmakers, frontier scouts, and elite marksmen. Their presence at Qithi Village predates the Thembu settlement at Rhodana.',
  },
  {
    q: 'What are the AmaQithi clan praises (izibongo)?',
    a: 'The AmaQithi izibongo (clan call names) are: Ndinga, Mnono, Rhadu, Mlebe, Nomsobodwana, Sopitsho Ngqolomsila, Yemyem, Nkomo ayizali izala ngokuzaliswa, Xa ingazali, izala ngokumiselwa. NgamaQithi amahle neenzipho zawo. Izinto ezingahlal\'esitulweni, zihlala esitulweni sodaka. The AmaQithi do not use the Thembu call names Vela bambhentsele, Zondwa, or MThembu as their primary izibongo because those belong to the AbaThembu clan. However, because the AmaQithi have assimilated into the Thembu nation, it is not frowned upon to also call Thembu clan names when reciting izibongo.',
  },
  {
    q: 'Who was Chief Madolo and what is his connection to the Qwabi family?',
    a: 'Chief Madolo (also known as Madura or Madoor) was one of the most powerful San leaders in the Eastern Cape. Around 1835 he led his people to the Glen Grey area near Lady Frere, the same territory where the Joka family (Qwabi ancestors) lived. In 1839, missionary James Read established a Bushman School on the White Kei River where fifteen San families lived by 1842, the same year Qwabi Joka was born. It is believed the Joka family were among the San clans under Madolo\'s leadership or living in close proximity to his people in the Agnes / White Kei River area.',
  },
  {
    q: 'Why was Molosi named after Chief Moorosi?',
    a: 'Qwabi Joka named his son Molosi (also written Molose) after Chief Moorosi of the Phuti people. Moorosi was one of the greatest allies the San ever had. He had San ancestry on his mother\'s side, had two San wives, witnessed San artists painting in caves, and his fighters used the Xhosa word for Bushman ("Moroa") as the password to access his mountain stronghold during Moorosi\'s War of 1879. San bowmen fought alongside Moorosi\'s forces during that war. Because Xhosa speakers could not easily pronounce "Moorosi" or "Morosi", the name became Molosi in family use.',
  },
  {
    q: 'Is Qithi a Thembu chief or a San chief?',
    a: 'Qithi is a San chief, not a Thembu chief. Contrary to some accounts that describe the AmaQithi as a Thembu clan descended from a Thembu ancestor named Qithi son of Ntande, the historical and linguistic evidence points clearly to San origin. The name Qithi contains a palatal click consonant that is not native to Bantu languages. The Qithi village sits directly next to Rhodana, where the Thembu only arrived in 1841. The AmaQithi predate the Thembu at that location. The true lineage of the San chief Qithi/Mqithi is still under active research.',
  },
  {
    q: 'Where do the Qwabi family live today?',
    a: 'The Qwabi family is concentrated in the Chris Hani District of the Eastern Cape. Primary family branches live in Hala 2 (near Lady Frere), Queenstown, and Ndlovukazi (Lesseyton). There is also a village named Qwabi in the Bulhoek area near Queenstown. Individual Qwabi family members are spread across South Africa, including Gauteng and the Western Cape.',
  },
  {
    q: 'Who founded Qwabi Primary School?',
    a: 'Qwabi Primary School in Lady Frere was founded by Dumile Qwabi, a World War 2 veteran and son of Molosi (Oliphant) Qwabi. Dumile was among the first residents of Hala 2 and was granted land there by Paramount Chief Kaiser Matanzima.',
  },
  {
    q: 'What happened to Halile Jonas Qwabi?',
    a: 'Halile Jonas Qwabi was a devout member of the Church of God and Saints of Christ (AmaSirayeli). He died in the Bulhoek Massacre of 1921. He is buried in a mass grave, and the apartheid government erased civil death registrations for the victims. His son Bhangile was later known throughout Hala 2 as "Sirayeli" in memory of his father\'s faith.',
  },
  {
    q: 'Is the Qwabi family related to Qwabi Hotels?',
    a: 'No. The Qwabi family are a South African family from Lady Frere in the Eastern Cape, with San origins in the AmaQithi clan. Qwabi Hotels and Game Reserve is a commercial business. It shares the name but has no known connection to the Qwabi family lineage documented here.',
  },
];

export default function QwabiFamily() {
  return (
    <PageShell>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={CANONICAL} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta property="og:site_name" content="Ayabonga Qwabi" />
        <meta property="article:published_time" content={`${PAGE_DATE}T12:00:00+02:00`} />
        <meta property="article:author" content="Ayabonga Qwabi" />
        <meta property="article:section" content="Family History" />
        <meta property="article:tag" content="Qwabi family" />
        <meta property="article:tag" content="AmaQithi" />
        <meta property="article:tag" content="AmaQithi clan" />
        <meta property="article:tag" content="Qithi clan" />
        <meta property="article:tag" content="Lady Frere" />
        <meta property="article:tag" content="Eastern Cape" />
        <meta property="article:tag" content="San people" />
        <meta property="article:tag" content="AbaThwa" />
        <meta property="article:tag" content="Glen Grey" />
        <meta property="article:tag" content="Cacadu" />
        <meta property="article:tag" content="White Kei River" />
        <meta property="article:tag" content="Chief Madolo" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <meta name="twitter:site" content="@ayabongaqwabi" />
        <meta name="twitter:creator" content="@ayabongaqwabi" />

        <meta
          name="keywords"
          content="Qwabi family, Qwabi family history, Qwabi surname, Qwabi origin, Joka family Lady Frere, AmaQithi clan, AmaQithi San clan, Qithi clan Eastern Cape, Mqithi clan, AmaQithi izibongo, Lady Frere family history, Glen Grey Eastern Cape, Cacadu Eastern Cape, White Kei River, Agnes Lady Frere, Chief Madolo San, San people Eastern Cape, AbaThwa Eastern Cape, San assimilation Thembu, Rhodana Queen Nonesi, Qithi Village Lady Frere, Chris Hani District family, Hala 2 Lady Frere, Qwabi Eastern Cape, Bulhoek Massacre, Bhangile Qwabi, Dumile Qwabi, Halile Jonas Qwabi, Molosi Qwabi, Yanki Qwabi, Bushman Qwabi, Qwabi Primary School"
        />
        <meta name="geo.region" content="ZA-EC" />
        <meta name="geo.placename" content="Lady Frere, Eastern Cape, South Africa" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />

        <script type="application/ld+json">
          {JSON.stringify(buildFamilyPageSchema())}
        </script>
      </Helmet>

      <main id="main-content">

        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden bg-[var(--navy)] px-6 pb-20 pt-28 md:pb-28 md:pt-36"
          aria-labelledby="qwabi-family-heading"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 select-none font-display text-[18vw] font-semibold leading-none text-transparent"
            style={{ WebkitTextStroke: '1px rgba(255,215,0,0.05)', userSelect: 'none' }}
          >
            QWABI
          </div>

          <div className="relative z-10 mx-auto max-w-4xl">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap gap-2 text-sm text-[var(--text-muted)]">
                <li>
                  <TransitionLink
                    to="/"
                    className="hover:text-[var(--warm-white)] transition-colors"
                  >
                    Home
                  </TransitionLink>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-[var(--gold)]">
                  Qwabi Family History
                </li>
              </ol>
            </nav>

            <p className="mb-4 font-technical text-sm uppercase tracking-widest text-[var(--gold)]">
              Family History &middot; Eastern Cape &middot; South Africa
            </p>

            <h1
              id="qwabi-family-heading"
              className="font-display text-4xl font-semibold leading-tight text-[var(--warm-white)] md:text-5xl lg:text-6xl"
            >
              The Qwabi Family
            </h1>

            <p className="mt-4 font-display text-xl font-medium leading-snug text-[var(--gold)] opacity-90 md:text-2xl">
              AmaQithi Clan, San People of Lady Frere and the White Kei River
            </p>

            <p className="mt-6 max-w-2xl font-technical text-lg leading-relaxed text-[var(--text-muted)]">
              The Qwabi family are San (AbaThwa) people of the AmaQithi clan, from the banks of
              the White Kei River in Lady Frere, Glen Grey, and Cacadu in the Eastern Cape. Part
              of the Joka family lineage, their roots predate the Thembu settlement of the region.
              This page documents verified oral history, GEDCOM lineage, and historical evidence
              for anyone researching the Qwabi surname, the AmaQithi clan, or San history in the
              Eastern Cape.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                'Qwabi surname',
                'Joka family',
                'AmaQithi clan',
                'Lady Frere / Cacadu',
                'White Kei River',
                'San / AbaThwa',
                'Chief Madolo',
                'Chris Hani District',
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-[var(--gold)]/30 px-3 py-1 font-technical text-xs text-[var(--gold)]/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── OVERVIEW MAP ── */}
        <section
          className="bg-[var(--navy-dark)] px-6 py-14 md:py-20"
          aria-labelledby="map-overview-heading"
        >
          <div className="mx-auto max-w-4xl">
            <h2
              id="map-overview-heading"
              className="mb-3 font-display text-2xl font-semibold text-[var(--gold)] md:text-3xl"
            >
              Ancestral territory: Agnes, Qithi, and Rhodana
            </h2>
            <p className="mb-8 max-w-2xl font-technical text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
              This map shows the key sites of Qwabi and AmaQithi history in the Lady Frere area.
              Agnes (top left) marks the White Kei River homeland of the Joka family and Chief
              Madolo's people. Qithi Village (centre) is the ancestral San settlement adjacent to
              the Thembu Great Place at Rhodana (bottom). Mkapusi marks the Qwabi homestead.
            </p>
            <div className="overflow-hidden rounded-sm border border-[var(--warm-white)]/10">
              <img
                src={MAP_OVERVIEW}
                alt="Map of Lady Frere showing Agnes (Chief Madolo and Joka family homeland), Qithi Village (AmaQithi San settlement), Mkapusi (Qwabi homestead), and Rhodana (Queen Nonesi Thembu Great Place)"
                className="w-full object-cover"
                loading="lazy"
                width={600}
                height={500}
              />
            </div>
            <p className="mt-3 font-technical text-xs text-[var(--text-muted)]/60">
              Pins: Agnes / Chief Madolo territory (top left), Mkapusi / Qwabi home (top),
              Qithi Village (centre), Qwabi Descendants settlement (centre-right), Qithi Village
              next to Queen Nonesi's Great Place (lower centre), Rhodana (bottom).
            </p>
          </div>
        </section>

        {/* ── WHO ARE THE QWABI FAMILY ── */}
        <section
          className="bg-[var(--warm-white)] py-20 text-[var(--navy)] md:py-28"
          aria-labelledby="who-are-qwabi"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2
              id="who-are-qwabi"
              className="mb-6 font-display text-3xl font-semibold md:text-4xl"
            >
              Who are the Qwabi family?
            </h2>

            <div className="space-y-5 font-technical text-base leading-relaxed text-[var(--navy)]/80 md:text-lg">
              <p>
                The <strong>Qwabi family</strong> are a South African family of{' '}
                <strong>San (AbaThwa)</strong> descent, belonging to the{' '}
                <strong>AmaQithi clan</strong>. Their roots lie in the{' '}
                <strong>Joka family</strong>, San people from the banks of the{' '}
                <strong>White Kei River</strong> in the <strong>Lady Frere, Glen Grey, and
                Cacadu</strong> district of the Eastern Cape.
              </p>

              <p>
                The earliest confirmed ancestor is <strong>Joka</strong>, whose homestead was in
                or near the village of <strong>Agnes</strong> on the White Kei River. Historical
                records place San families under and around Chief Madolo in this exact area from
                the 1830s through the 1850s. The Joka family is believed to be among the San
                clans who lived under or alongside Madolo's authority during that period.
              </p>

              <p>
                From Joka came <strong>Qwabi Joka</strong> (born c. 1842), the ancestor from
                whom the Qwabi surname is taken. His children, grandchildren, and descendants
                form the Qwabi family as it exists today, spread across the Chris Hani District,
                with concentrations in <strong>Hala 2</strong>, <strong>Queenstown</strong>, and{' '}
                <strong>Ndlovukazi (Lesseyton)</strong>.
              </p>

              <p>
                The Qwabi family are <strong>not Thembu by origin</strong>. They are San people
                who, like the broader AmaQithi clan, assimilated into the AbaThembu nation over
                generations of coexistence, intermarriage, and political integration in the
                Cacadu basin.
              </p>

              <div className="my-8 border-l-4 border-[var(--navy)] pl-6">
                <p className="font-technical text-sm italic text-[var(--navy)]/60 md:text-base">
                  "At about this time a number of Thembu groups living on the White Kei, including
                  'Jumba', father of the Thembu chief, 'Umgudhluwa', were on comparatively friendly
                  terms with San 'families and clans' living in that area."
                </p>
                <p className="mt-2 font-technical text-xs text-[var(--navy)]/50">
                  Silayi (subject of Chief Jumba), recorded by Sir Walter Stanford (Macquarrie
                  1962:31)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CHIEF MADOLO + WHITE KEI ORIGINS ── */}
        <section
          className="bg-[var(--navy)] py-20 text-[var(--warm-white)] md:py-28"
          aria-labelledby="madolo-origins"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2
              id="madolo-origins"
              className="mb-6 font-display text-3xl font-semibold md:text-4xl"
            >
              Origins: the White Kei River and Chief Madolo
            </h2>

            <div className="space-y-5 font-technical text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
              <p>
                The White Kei River (also known as the <strong>Cacadu River</strong>) was one of
                the last strongholds of autonomous San life in the Eastern Cape. In approximately{' '}
                <strong>1835</strong>, the San chief <strong>Madolo</strong> (also known as Madura
                or Madoor) relocated his people from the Klipplaats and Upper Black Kei rivers to
                the <strong>Glen Grey area near Lady Frere</strong>, north of the Black Kei.
              </p>

              <p>
                In <strong>1839</strong>, missionary James Read established a Bushman School on
                the White Kei River. By <strong>1842</strong>, fifteen San families lived there.
                Madolo attended services at the chapel but never personally converted. This
                settlement, and the village of <strong>Agnes</strong> on the White Kei banks, was
                the heartland of San life in the Lady Frere area during the years when{' '}
                <strong>Qwabi Joka was born and raised (c. 1842)</strong>.
              </p>

              <p>
                The Joka family is believed to be part of the San clans who lived under or in
                proximity to Madolo's authority. Around <strong>1850</strong>, colonial pressure
                and conflict with Thembu settlers forced Madolo and the remaining San to retreat
                to caves along the White Kei, and by <strong>1856</strong> Madolo and the remnant
                of his tribe withdrew into the Maloti-Drakensberg mountains, disappearing from
                the historical record. The families who remained, including the Joka family,
                assimilated into the local Thembu and Xhosa populations.
              </p>

              <div className="my-6 grid gap-4 rounded-sm border border-[var(--warm-white)]/10 bg-[var(--navy-dark)]/60 p-6 md:grid-cols-3">
                {[
                  { year: 'c. 1835', event: 'Chief Madolo relocates San clans to Glen Grey / Lady Frere area' },
                  { year: '1839', event: 'Bushman School established on the White Kei River by missionary James Read' },
                  { year: 'c. 1842', event: 'Qwabi Joka born near Agnes / White Kei River, Lady Frere' },
                  { year: '1846', event: 'Madolo leads 200 followers (San, Khoe, Mfengu, Thembu) as British levies in the War of the Axe' },
                  { year: 'c. 1850', event: 'Madolo forced to retreat to caves on the White Kei; San and Thembu relations intensify' },
                  { year: '1856', event: 'Madolo and remaining San withdraw to the Maloti-Drakensberg; those who remain assimilate' },
                ].map((item) => (
                  <div key={item.year} className="border-l-2 border-[var(--gold)]/30 pl-4">
                    <p className="mb-1 font-technical text-xs font-semibold text-[var(--gold)]">
                      {item.year}
                    </p>
                    <p className="font-technical text-sm text-[var(--text-muted)]">{item.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── AMAQITHI CLAN ── */}
        <section
          className="bg-[var(--warm-white)] py-20 text-[var(--navy)] md:py-28"
          aria-labelledby="amaqithi-clan"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2
              id="amaqithi-clan"
              className="mb-6 font-display text-3xl font-semibold md:text-4xl"
            >
              The AmaQithi clan: San people who became part of the Thembu nation
            </h2>

            <div className="space-y-5 font-technical text-base leading-relaxed text-[var(--navy)]/80 md:text-lg">
              <p>
                The <strong>AmaQithi</strong> (also written amaQithi, Qithi clan, or Mqithi clan)
                are a San (AbaThwa) clan whose ancestral village, <strong>Qithi</strong>, is
                located in the Lady Frere area of the Eastern Cape, directly adjacent to{' '}
                <strong>Rhodana</strong>, the Thembu Great Place established by Queen Nonesi in
                1841.
              </p>

              <p>
                The AmaQithi are <strong>not a Thembu clan by origin</strong>. Contrary to
                accounts that describe Qithi as a son of Ntande and therefore a Thembu ancestor,
                the evidence points elsewhere. The name <em>Qithi</em> contains the palatal click
                consonant <strong>Q</strong>, which is indigenous to Khoisan (San) languages, not
                Bantu languages. The Nguni peoples absorbed click consonants through centuries of
                deep contact with Khoisan peoples. A Thembu ancestor with an authentic Bantu name
                would not carry a Q click. The name "Mqithi" is described by researchers as a
                "linguistic fossil" that combines a standard Xhosa personal prefix with a
                traditional San phonetic root.
              </p>

              <p>
                The true lineage of the San chief <strong>Qithi (Mqithi)</strong> is still under
                active research. What is documented is that by the time Queen Nonesi moved the
                Thembu Great Place to Rhodana in <strong>1841</strong>, a San leader named Mqithi
                was already there. His clan was granted land at <strong>Qithi Village</strong>,
                positioned directly next to the Thembu royal residence, a placement that indicated
                high rank comparable to a senior counselor.
              </p>

              <p>
                The AmaQithi served the Thembu in specialized roles that drew on their unique
                knowledge as First People of the land: rainmakers during droughts, frontier
                scouts using their knowledge of the terrain, elite marksmen during conflicts like
                the War of Mlanjeni (1850-1853), and herbalists providing medicinal knowledge
                from local flora.
              </p>

              <p>
                The <strong>Rhodana / Qithi relationship</strong> is visible on the map today.
                Qithi Village sits at the boundary of what became Rodana Village, and the Rodana
                Clinic and Rodana PJS School are located immediately adjacent to the historic
                Qithi site, confirming that these two communities, one San in origin, one Thembu,
                grew up literally side by side.
              </p>
            </div>

            {/* Rhodana Map */}
            <div className="mt-12 overflow-hidden rounded-sm border border-[var(--navy)]/10">
              <img
                src={MAP_RHODANA}
                alt="Satellite map showing Qithi Village directly adjacent to Rodana Village, Rodana Clinic, and Rodana PJS School in the Lady Frere area, confirming the San AmaQithi presence next to the Thembu Great Place"
                className="w-full object-cover"
                loading="lazy"
                width={570}
                height={520}
              />
            </div>
            <p className="mt-3 font-technical text-xs text-[var(--navy)]/50">
              Qithi Village (top centre) sits directly adjacent to Rodana Clinic and Rodana
              Village (centre and bottom), the site of the Thembu Great Place under Queen Nonesi.
              The San presence at Qithi predates the Thembu arrival at Rhodana in 1841.
            </p>

            {/* Izibongo */}
            <div className="mt-12 rounded-sm border border-[var(--navy)]/10 bg-[var(--navy)]/[0.03] p-8">
              <h3 className="mb-4 font-display text-xl font-semibold text-[var(--navy)]">
                AmaQithi izibongo (clan call names / praises)
              </h3>
              <p className="mb-4 font-technical text-sm text-[var(--navy)]/60">
                These are the traditional izibongo (praises) of the AmaQithi clan, recited in
                Xhosa. They are the call names that identify the clan and distinguish it from
                the AbaThembu izibongo.
              </p>
              <blockquote className="border-l-4 border-[var(--navy)]/30 pl-6 font-technical text-base italic leading-relaxed text-[var(--navy)]/80 md:text-lg">
                <p>
                  Ndinga, Mnono, Rhadu, Mlebe, Nomsobodwana, Sopitsho Ngqolomsila, Yemyem,
                  Nkomo ayizali izala ngokuzaliswa, Xa ingazali, izala ngokumiselwa.
                  NgamaQithi amahle neenzipho zawo. Izinto ezingahlal'esitulweni, zihlala
                  esitulweni sodaka.
                </p>
              </blockquote>
              <div className="mt-6 rounded-sm bg-[var(--navy)]/5 p-5">
                <p className="mb-2 font-technical text-xs font-semibold uppercase tracking-widest text-[var(--navy)]/50">
                  Note on Thembu call names
                </p>
                <p className="font-technical text-sm leading-relaxed text-[var(--navy)]/70">
                  The AmaQithi do not use <em>Vela bambhentsele</em>, <em>Zondwa</em>, or{' '}
                  <em>MThembu</em> as their primary izibongo. These belong to the AbaThembu clan.
                  Vela bambhentsele is the praise of Bhomovi, given to him because he was allowed
                  to choose a Sotho woman of his liking (it means "the one the women lust after").
                  Zondwa is a Thembu descendant and chief. MThembu is the clan name itself.
                  Because the AmaQithi have assimilated into the Thembu nation, it is not frowned
                  upon to also call Thembu clan names when reciting izibongo.
                </p>
              </div>
            </div>

            {/* Other AmaQithi families */}
            <div className="mt-12">
              <h3 className="mb-4 font-display text-xl font-semibold text-[var(--navy)]">
                AmaQithi families beyond the Qwabi line
              </h3>
              <p className="mb-6 font-technical text-sm leading-relaxed text-[var(--navy)]/70 md:text-base">
                The AmaQithi clan extends beyond the Qwabi family. Multiple AmaQithi family
                branches are documented across the Eastern Cape and Free State.
              </p>

              <div className="space-y-5 font-technical text-sm leading-relaxed text-[var(--navy)]/70 md:text-base">
                <p>
                  <strong className="text-[var(--navy)]">Lady Frere and Cala region:</strong>{' '}
                  AmaQithi families are found in Lower Seplan, Qugqwaru, Bholoto, Tsembeyi,
                  Hala 2, and Ngcuka. Surnames associated with Qithi families in this area
                  include Tshabe, Mbaba, Ngubo, Shumana, Khethelo, and Mhlungulwa.
                </p>
                <p>
                  <strong className="text-[var(--navy)]">Ngcobo:</strong> AmaQithi families
                  trace their origin to the Rhodana area. One documented lineage records that
                  Manimani left Lady Frere (Rhodana) and settled in Maqwathini, Engcobo. The
                  Nkosikho Manimani line in Engcobo Kumadanga traces back through Sinduwamba,
                  Sipenisi, Poto, Manimani, Phonye, and Dolo. AmaQithi villages in Ngcobo
                  include Gubenxa, Lucwecwe, Lahlangubo, eMadladleni, Gqutyini, Zadungeni, and
                  Qumanco. Surnames: Mgengwana, Ntulo, Limba, Gobelo, Titi, Kula, Msebe,
                  Skampula, Matho, Tyhokolo, and Fanakho.
                </p>
                <p>
                  <strong className="text-[var(--navy)]">Cofimvaba:</strong> The original
                  Qithi family history records that the first Qithi people to arrive in the
                  area were Ngcongolo and his brother Mafilika, who came from Cofimvaba
                  (Shobeni) and settled on the red wall on top of the white hill where the
                  Cacadu basin begins. AmaQithi surnames in Cofimvaba include Ngqela, Bambatha,
                  Mtshabe, Skeyi, Sokutapa, and Ndaleni.
                </p>
                <p>
                  <strong className="text-[var(--navy)]">Free State:</strong> AmaQithi families
                  from Mcambalala in Luxeni (Lady Frere) settled in the Free State. Surnames
                  include Plata and Mfumba.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── LINEAGE ── */}
        <section
          className="bg-[var(--navy-dark)] py-20 text-[var(--warm-white)] md:py-28"
          aria-labelledby="qwabi-lineage"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2
              id="qwabi-lineage"
              className="mb-4 font-display text-3xl font-semibold md:text-4xl"
            >
              Documented Qwabi family lineage
            </h2>
            <p className="mb-12 max-w-2xl font-technical text-base text-[var(--text-muted)] md:text-lg">
              Verified through GEDCOM records, oral history from family elder Monwabisi Qwabi,
              civil registration archives, and historical documentation of the White Kei San
              communities.
            </p>

            <div className="space-y-6">
              {generations.map((g, i) => (
                <div key={i} className="border-l-2 border-[var(--gold)]/40 pl-6">
                  <p className="mb-1 font-technical text-xs uppercase tracking-widest text-[var(--gold)]/70">
                    {g.gen}
                  </p>
                  <h3 className="mb-2 font-display text-xl font-semibold text-[var(--warm-white)]">
                    {g.name}
                  </h3>
                  <p className="font-technical text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                    {g.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-sm border border-[var(--gold)]/20 bg-[var(--navy)]/60 p-6">
              <h3 className="mb-3 font-display text-lg font-semibold text-[var(--gold)]">
                Full ancestor tree (Joka to present)
              </h3>
              <p className="mb-4 font-technical text-sm text-[var(--text-muted)]">
                The complete GEDCOM-verified descendant tree is published in the detailed family
                history article. It covers all known branches: the House of Bhangile (Hala 2),
                the House of Dumile (Hala 2 / Lady Frere), the House of Yanki (Queenstown and
                beyond), the House of George, and the Bushman line.
              </p>
              <TransitionLink
                to="/blog/qwabi-family-history-amaqithi"
                className="inline-block font-technical text-sm font-medium text-[var(--gold)] underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                Read the full Qwabi family history article
              </TransitionLink>
            </div>
          </div>
        </section>

        {/* ── MOLOSI / MOOROSI ── */}
        <section
          className="bg-[var(--warm-white)] py-20 text-[var(--navy)] md:py-28"
          aria-labelledby="molosi-moorosi"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2
              id="molosi-moorosi"
              className="mb-6 font-display text-3xl font-semibold md:text-4xl"
            >
              Molosi, Bushman, and the naming tradition
            </h2>

            <div className="space-y-5 font-technical text-base leading-relaxed text-[var(--navy)]/80 md:text-lg">
              <p>
                The names Qwabi Joka gave his sons were not accidents. They were deliberate
                statements about who the family was and where they came from.
              </p>

              <p>
                His son <strong>Bushman (Boesman)</strong> was named directly for what the
                family was: San people. In 19th-century Eastern Cape usage, "Bushman" was the
                colonial and Afrikaans term for the San (AbaThwa). Giving a child this name in
                that era was an act of identity preservation, not shame.
              </p>

              <p>
                His son <strong>Molosi</strong> was named after <strong>Chief Moorosi</strong>
                of the Phuti people. Moorosi was one of the greatest San allies in Southern
                African history. He had San ancestry on his mother's side, had two San wives,
                witnessed San rock painters at work, and during <strong>Moorosi's War of 1879</strong>,
                San fighters armed with bows and arrows fought alongside his forces. The password
                used by Phuti warriors to access Moorosi's mountain stronghold during the
                eight-month siege was <em>"Moroa"</em>, the Xhosa word for Bushman. When
                Moorosi fell in November 1879, the San lost their most powerful protector.
              </p>

              <p>
                Because Xhosa speakers found "Moorosi" or "Morosi" difficult to pronounce, the
                name evolved in family use to <strong>Molosi</strong>. He was also nicknamed{' '}
                <strong>Oliphant (elephant)</strong> by the Boer family his mother worked for,
                reportedly because he was short, very strong, and had bow legs. Molosi fathered
                the largest branch of the Qwabi family, including Dumile, Yanki, Varhile, George,
                and others.
              </p>
            </div>
          </div>
        </section>

        {/* ── KEY FIGURES ── */}
        <section
          className="bg-[var(--navy)] py-20 text-[var(--warm-white)] md:py-28"
          aria-labelledby="key-figures"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2
              id="key-figures"
              className="mb-12 font-display text-3xl font-semibold md:text-4xl"
            >
              Notable figures in Qwabi family history
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  name: 'Qwabi Joka (born c. 1842, died 1915)',
                  desc: 'The founding patriarch of the Qwabi surname. Son of Joka, born near the village of Agnes on the White Kei River in Lady Frere, in the territory of San chief Madolo. Fathered Nosenti (born 1861), Bushman, Halile Jonas, and Molosi. Died 1915.',
                },
                {
                  name: 'Bushman (Boesman) Qwabi',
                  desc: "Named 'Bushman' by his father Qwabi Joka to preserve the family's San identity. Youngest of the three sons. Had only daughters, so asked his brother Halile Jonas to send his son Bhangile to manage his homestead in Skhwanqeni. Worked in Steynsburg around 1915-1919.",
                },
                {
                  name: 'Halile Jonas Qwabi',
                  desc: "Son of Qwabi Joka. A devout member of the Church of God and Saints of Christ (AmaSirayeli). Died in the Bulhoek Massacre of 1921, buried in a mass grave. The apartheid government erased civil death registrations for the victims. His son Bhangile carried his legacy as 'Sirayeli' in Hala 2.",
                },
                {
                  name: 'Molosi (Oliphant) Qwabi',
                  desc: "Son of Qwabi Joka, named after Chief Moorosi of the Phuti people (San ally). Nicknamed 'Oliphant' (elephant) for his strength and bow-legged build. Fathered the largest branch: Dumile, Yanki, Varhile, George, Kholiwe, Nobhayisekile, Roro William, Bennet, Caroline, and others.",
                },
                {
                  name: 'Bhangile Qwabi (1913-2003)',
                  desc: "Son of Halile Jonas. Born in Glen Grey. Inherited Bushman's homestead in Skhwanqeni around 1958. After losing four children to pneumonia, relocated to Hala 2 near Lady Frere. Known throughout Hala 2 as 'Sirayeli' after his father's faith. Died 2003 in Lady Frere.",
                },
                {
                  name: 'Dumile Qwabi',
                  desc: 'Son of Molosi. World War 2 veteran. Founded Qwabi Primary School in Lady Frere. Among the first settlers of Hala 2, granted land by Paramount Chief Kaiser Matanzima. Helped Bhangile\'s family relocate to Hala 2. His children: Malungelo, Poto, Mziwamadoda, Queen, Malungisa, and Yamkela.',
                },
                {
                  name: 'Yanki Qwabi',
                  desc: 'Son of Molosi. World War 2 veteran. Married Agnes Evelina Ntlabati on 30 December 1947 in Queenstown. Fathered ten children: Zolelwa, Tenjiwe, Lindiwe, Neliswa, Sipho Rosin, Fumanekile, Boniswa, Mzukisi, Ntobeko, and Nomaphelo.',
                },
              ].map((p) => (
                <div
                  key={p.name}
                  className="rounded-sm border border-[var(--warm-white)]/10 p-6"
                >
                  <h3 className="mb-3 font-display text-lg font-semibold text-[var(--gold)]">
                    {p.name}
                  </h3>
                  <p className="font-technical text-sm leading-relaxed text-[var(--text-muted)]">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GEOGRAPHY ── */}
        <section
          className="bg-[var(--warm-white)] py-20 text-[var(--navy)] md:py-28"
          aria-labelledby="qwabi-geography"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2
              id="qwabi-geography"
              className="mb-6 font-display text-3xl font-semibold md:text-4xl"
            >
              Qwabi family locations in the Eastern Cape
            </h2>

            <p className="mb-10 font-technical text-base leading-relaxed text-[var(--navy)]/70 md:text-lg">
              The Qwabi family's documented geographic footprint spans several villages and
              districts in the Eastern Cape, all within or adjacent to the Chris Hani District.
            </p>

            <div className="space-y-6">
              {[
                {
                  place: 'Agnes, White Kei River (Lady Frere)',
                  detail:
                    'The original homeland of the Joka family, the Qwabi ancestors. Agnes is a village on the banks of the White Kei River in Lady Frere. It was the territory of San chief Madolo and his people from around 1835. Qwabi Joka was born here around 1842.',
                },
                {
                  place: 'Mkapusi (Lady Frere)',
                  detail:
                    'The Qwabi family homestead in the Lady Frere area. The map shows Mkapusi as the "Home of Qwabi and Other Qithis", close to Qithi Village and the White Kei River cluster.',
                },
                {
                  place: 'Qithi Village (Lady Frere)',
                  detail:
                    'The ancestral village of the AmaQithi clan, named after the San leader Mqithi. Located directly adjacent to Rhodana, the Thembu Great Place. The Qwabi family, as AmaQithi, trace their clan origins to this village. Qithi Village predates the Thembu settlement at Rhodana (1841).',
                },
                {
                  place: 'Hala 2 (near Lady Frere)',
                  detail:
                    "Established with significant contributions from Dumile Qwabi. The House of Bhangile and the House of Dumile live primarily here. Bhangile's family relocated from Skhwanqeni after hardship. Bhangile died here in 2003.",
                },
                {
                  place: 'Skhwanqeni (Eskwanqeni)',
                  detail:
                    "The homestead village of Bushman Qwabi, in close proximity to Qithi Village. Bhangile Qwabi lived here from around 1958 until relocating to Hala 2. The Gudu family (related through Qwabi Joka's brother's line) still live here, as do some Gudu descendants in Steynsburg.",
                },
                {
                  place: 'Ndlovukazi (Lesseyton)',
                  detail:
                    'Home to a branch of the Qwabi family. Caroline Qwabi was born and died here. Some family members continue to live in this area.',
                },
                {
                  place: 'Queenstown',
                  detail:
                    'Several Qwabi family marriages are recorded in Queenstown: George Qwabi (1939), Amoria Qwabi (1942), and Yanki Qwabi (1947). Branches of the Yanki and Roro William Qwabi lines remain here.',
                },
                {
                  place: 'Qwabi Village, Bulhoek',
                  detail:
                    'A village named Qwabi exists in the Bulhoek area near Queenstown in the Chris Hani District. Its ancestral connection to the Qwabi family lineage is under ongoing research.',
                },
                {
                  place: 'Steynsburg',
                  detail:
                    'The Qwabi family worked in Steynsburg around 1915-1919. Mashiya Qwabi (son of Bushman) died there in November 1919 at age four. One Qwabi family member later settled there permanently and changed his surname to Pini.',
                },
              ].map((loc) => (
                <div
                  key={loc.place}
                  className="border-b border-[var(--navy)]/10 pb-6 last:border-0 last:pb-0"
                >
                  <h3 className="mb-2 font-display text-lg font-semibold text-[var(--navy)]">
                    {loc.place}
                  </h3>
                  <p className="font-technical text-sm leading-relaxed text-[var(--navy)]/70 md:text-base">
                    {loc.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MILITARY ── */}
        <section
          className="bg-[var(--navy-dark)] py-20 text-[var(--warm-white)] md:py-24"
          aria-labelledby="qwabi-military"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2
              id="qwabi-military"
              className="mb-6 font-display text-3xl font-semibold md:text-4xl"
            >
              Military tradition in the Qwabi family
            </h2>

            <p className="mb-8 max-w-2xl font-technical text-base leading-relaxed text-[var(--text-muted)] md:text-lg">
              The Qwabi family has a documented tradition of military service across multiple
              generations and conflicts, consistent with the broader San alliance history in the
              region.
            </p>

            <ul className="space-y-5 font-technical text-base text-[var(--text-muted)]">
              <li className="flex gap-4">
                <span className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-[var(--gold)]" />
                <span>
                  <strong className="text-[var(--warm-white)]">Chief Madolo</strong> led 200
                  followers, a mixed force of San, Khoe, Mfengu, and Thembu, as British levies
                  during the War of the Axe (1846). The Joka family, as San people under or near
                  Madolo's authority, lived through this era of frontier conflict.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-[var(--gold)]" />
                <span>
                  <strong className="text-[var(--warm-white)]">Qwabi Joka</strong> participated
                  in frontier conflicts of the late 1800s. He named his son{' '}
                  <strong className="text-[var(--warm-white)]">Molosi</strong> after Chief
                  Moorosi, under whom San bowmen fought against British colonial forces in
                  Moorosi's War (1879).
                </span>
              </li>
              <li className="flex gap-4">
                <span className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-[var(--gold)]" />
                <span>
                  <strong className="text-[var(--warm-white)]">Dumile Qwabi</strong> and{' '}
                  <strong className="text-[var(--warm-white)]">Yanki Qwabi</strong> (sons of
                  Molosi) both served in World War 2. Dumile returned to found Qwabi Primary
                  School and help establish the Hala 2 community.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-[var(--gold)]" />
                <span>
                  <strong className="text-[var(--warm-white)]">Molosi (Oliphant) Qwabi</strong>{' '}
                  also served as a soldier.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-[var(--gold)]" />
                <span>
                  In more recent generations,{' '}
                  <strong className="text-[var(--warm-white)]">Monwabisi Qwabi</strong>, the
                  late <strong className="text-[var(--warm-white)]">Rosin Qwabi</strong>, and{' '}
                  <strong className="text-[var(--warm-white)]">Xolile Qwabi</strong> continued
                  the family tradition of military service.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          className="bg-[var(--warm-white)] py-20 text-[var(--navy)] md:py-28"
          aria-labelledby="qwabi-faq"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2
              id="qwabi-faq"
              className="mb-12 font-display text-3xl font-semibold md:text-4xl"
            >
              Frequently asked questions about the Qwabi family and AmaQithi clan
            </h2>

            <dl className="space-y-8">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="border-b border-[var(--navy)]/10 pb-8 last:border-0 last:pb-0"
                >
                  <dt className="mb-3 font-display text-lg font-semibold text-[var(--navy)] md:text-xl">
                    {faq.q}
                  </dt>
                  <dd className="font-technical text-base leading-relaxed text-[var(--navy)]/75">
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── CONTRIBUTE ── */}
        <section
          className="bg-[var(--navy)] py-16 text-[var(--warm-white)] md:py-20"
          aria-labelledby="contribute-heading"
        >
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2
              id="contribute-heading"
              className="mb-4 font-display text-2xl font-semibold text-[var(--gold)] md:text-3xl"
            >
              Are you a Qwabi family member or AmaQithi descendant?
            </h2>
            <p className="mx-auto mb-8 max-w-xl font-technical text-base leading-relaxed text-[var(--text-muted)]">
              This record is a living document. If you have photos, oral histories, corrections,
              or additional genealogical records for the Qwabi family or AmaQithi clan, please
              reach out. The goal is a complete, verified record for our children and
              grandchildren.
            </p>
            <a
              href="mailto:aya@qwabi.co.za?subject=Qwabi%20Family%20History%20Contribution"
              className="inline-block rounded-sm border border-[var(--gold)] px-8 py-3 font-technical text-sm font-medium text-[var(--gold)] transition-colors hover:bg-[var(--gold)] hover:text-[var(--navy)]"
            >
              Contact us about the Qwabi family or AmaQithi clan
            </a>

            <div className="mt-10 border-t border-[var(--warm-white)]/10 pt-8">
              <p className="mb-3 font-technical text-xs uppercase tracking-widest text-[var(--text-muted)]">
                Key search terms
              </p>
              <p className="font-technical text-xs leading-relaxed text-[var(--text-muted)]/50">
                Qwabi family history Eastern Cape · Qwabi surname origin · Joka family Lady Frere
                · AmaQithi clan · AmaQithi San clan · Qithi clan Eastern Cape · AmaQithi izibongo
                · Mqithi clan · Qithi Village Lady Frere · Rhodana Qithi history · AmaQithi
                AbaThwa San · White Kei River San people · Agnes Lady Frere San · Chief Madolo
                San Eastern Cape · Qwabi Joka family history · Bushman Qwabi · Molosi Qwabi
                Oliphant · Moorosi War San fighters · Halile Jonas Qwabi Bulhoek Massacre ·
                Bhangile Qwabi Sirayeli · Dumile Qwabi Qwabi Primary School · Yanki Qwabi ·
                Hala 2 Lady Frere · Chris Hani District Qwabi · Qwabi village Bulhoek ·
                AmaQithi families Ngcobo Cofimvaba Free State
              </p>
            </div>
          </div>
        </section>

      </main>
    </PageShell>
  );
}
