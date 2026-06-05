import { globalTypographyDefinitions } from "@/lib/global-typography";

export type SiteCopyFormat = "plain" | "html" | "mdx" | "choice";

export type SiteCopyDefinition = {
  key: string;
  label: string;
  group: string;
  format: SiteCopyFormat;
  defaultValue: string;
  /** For `format: "choice"` (global typography dropdowns). */
  choices?: { value: string; label: string }[];
};

/** Central list: keys, labels, groups, formats, and built-in defaults (DB overrides on save). */
export const SITE_COPY_DEFINITIONS: SiteCopyDefinition[] = [
  // —— Home SEO ——
  {
    group: "Home — SEO",
    key: "home.meta_title",
    label: "Page title (browser tab / search)",
    format: "plain",
    defaultValue: "Recchi Studio — Cute nature-inspired apparel",
  },
  {
    group: "Home — SEO",
    key: "home.meta_description",
    label: "Meta description (search & social preview)",
    format: "plain",
    defaultValue:
      "Express yourself with cute, nature-inspired patterns. Shop tees, crop tops, and more from Recchi Studio.",
  },

  // —— Home hero ——
  {
    group: "Home — hero",
    key: "home.hero.eyebrow",
    label: "Eyebrow line",
    format: "plain",
    defaultValue: "Express yourself",
  },
  {
    group: "Home — hero",
    key: "home.hero.rotate_prefix",
    label: "Headline — text before the rotating word",
    format: "plain",
    defaultValue: "Show your true colours. Be ",
  },
  {
    group: "Home — hero",
    key: "home.hero.rotate_words",
    label: "Rotating words (one per line)",
    format: "plain",
    defaultValue: "cute.\nelegant.\nunique.\nyourself.",
  },
  {
    group: "Home — hero",
    key: "home.hero.body_html",
    label: "Intro paragraph under the headline",
    format: "html",
    defaultValue:
      "<p>Each of our patterns are specially created to make you love what you wear. Match shirts with your loved ones or express your unique self by selecting the patterns that appeal to you.</p>",
  },
  {
    group: "Home — hero",
    key: "home.hero.cta_catalog",
    label: "Primary button (catalog)",
    format: "plain",
    defaultValue: "Browse catalog",
  },
  {
    group: "Home — hero",
    key: "home.hero.image_url",
    label: "Hero image",
    format: "plain",
    defaultValue:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1100&q=80",
  },
  {
    group: "Home — hero",
    key: "home.hero.image_alt",
    label: "Hero image alt text",
    format: "plain",
    defaultValue: "Soft folded fabrics suggesting colour and pattern from the collection",
  },

  // —— Home collection strip ——
  {
    group: "Home — collection",
    key: "home.collection.eyebrow",
    label: "Eyebrow",
    format: "plain",
    defaultValue: "Collection",
  },
  {
    group: "Home — collection",
    key: "home.collection.title",
    label: "Section title",
    format: "plain",
    defaultValue: "Styles",
  },
  {
    group: "Home — collection",
    key: "home.collection.blurb",
    label: "Blurb",
    format: "plain",
    defaultValue: "Fresh drops in the catalog — tees, crop tops, shorts, and more.",
  },
  {
    group: "Home — collection",
    key: "home.collection.cta_view_all",
    label: "“View all” link text",
    format: "plain",
    defaultValue: "View all products",
  },
  {
    group: "Home — collection",
    key: "home.collection.empty_html",
    label: "Message when no products are listed",
    format: "html",
    defaultValue: "<p>No products are available right now. Please check back soon.</p>",
  },

  // —— Home banner ——
  {
    group: "Home — banner",
    key: "home.banner.image_url",
    label: "Banner image",
    format: "plain",
    defaultValue:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2400&q=80",
  },
  {
    group: "Home — banner",
    key: "home.banner.image_alt",
    label: "Banner image alt text",
    format: "plain",
    defaultValue: "Apparel display suggesting patterns and colour from the collection",
  },

  // —— Home story + features ——
  {
    group: "Home — story",
    key: "home.story.eyebrow",
    label: "Eyebrow",
    format: "plain",
    defaultValue: "Our story",
  },
  {
    group: "Home — story",
    key: "home.story.title",
    label: "Title",
    format: "plain",
    defaultValue: "About",
  },
  {
    group: "Home — story",
    key: "home.story.tagline",
    label: "Tagline",
    format: "plain",
    defaultValue: "Cute. Classy. Elegant. Unique.",
  },
  {
    group: "Home — story",
    key: "home.story.body_html",
    label: "Body",
    format: "html",
    defaultValue:
      "<p>We design patterns that feel joyful and wearable — so you can express yourself without sacrificing comfort. Thank you for supporting a small creative studio.</p>",
  },
  ...[1, 2, 3].flatMap((n) => [
    {
      group: "Home — feature cards",
      key: `home.feature.${n}.title`,
      label: `Feature ${n} title`,
      format: "plain" as const,
      defaultValue: ["100% Cotton", "Uniquely designed", "Nature inspired"][n - 1]!,
    },
    {
      group: "Home — feature cards",
      key: `home.feature.${n}.body`,
      label: `Feature ${n} body`,
      format: "plain" as const,
      defaultValue: [
        "Natural fibres that feel easy on your skin, wash after wash.",
        "Original artwork — not generic templates — so your look feels personal.",
        "Birds, plants, and colour cues from the outdoors, translated into wearable prints.",
      ][n - 1]!,
    },
  ]),
  {
    group: "Home — closing",
    key: "home.closing.image_url",
    label: "Closing image",
    format: "plain",
    defaultValue: "/images/home-closing.png",
  },
  {
    group: "Home — closing",
    key: "home.closing.image_alt",
    label: "Closing image description",
    format: "plain",
    defaultValue: "Person in a green field wearing Recchi Studio",
  },
  {
    group: "Home — closing",
    key: "home.closing",
    label: "Closing message",
    format: "plain",
    defaultValue: "Thank you for showing an interest in my small business!",
  },

  // —— Catalog ——
  {
    group: "Catalog",
    key: "catalog.meta_title",
    label: "Page title (browser tab)",
    format: "plain",
    defaultValue: "Catalog",
  },
  {
    group: "Catalog",
    key: "catalog.meta_description",
    label: "Short page description",
    format: "plain",
    defaultValue:
      "Browse Recchi Studio — filter by collection, search, sort by price, and page through the catalog.",
  },
  {
    group: "Catalog",
    key: "catalog.header.eyebrow",
    label: "Header eyebrow",
    format: "plain",
    defaultValue: "Browse",
  },
  {
    group: "Catalog",
    key: "catalog.header.title",
    label: "Page title",
    format: "plain",
    defaultValue: "Catalog",
  },
  {
    group: "Catalog",
    key: "catalog.header.blurb",
    label: "Intro blurb",
    format: "plain",
    defaultValue:
      "Filter by collection, search the catalog, sort by price or name, and page through when you have dozens of pieces.",
  },
  {
    group: "Catalog",
    key: "catalog.search_placeholder",
    label: "Search field placeholder",
    format: "plain",
    defaultValue: "Search by name or description…",
  },

  // —— Header ——
  {
    group: "Site header",
    key: "header.nav.about",
    label: "Nav — About",
    format: "plain",
    defaultValue: "About",
  },
  {
    group: "Site header",
    key: "header.nav.shipping",
    label: "Nav — Shipping",
    format: "plain",
    defaultValue: "Shipping",
  },
  {
    group: "Site header",
    key: "header.nav.contact",
    label: "Nav — Contact",
    format: "plain",
    defaultValue: "Contact",
  },
  {
    group: "Site header",
    key: "header.nav.catalog",
    label: "Nav — Catalog (desktop + mobile)",
    format: "plain",
    defaultValue: "Catalog",
  },
  {
    group: "Site header",
    key: "header.nav.policies",
    label: "Mobile menu — Policies",
    format: "plain",
    defaultValue: "Policies",
  },
  {
    group: "Site header",
    key: "header.nav.home",
    label: "Mobile menu — Home",
    format: "plain",
    defaultValue: "Home",
  },
  {
    group: "Site header",
    key: "header.menu_button",
    label: "Mobile menu button",
    format: "plain",
    defaultValue: "Menu",
  },

  // —— Footer ——
  {
    group: "Footer",
    key: "footer.brand_title",
    label: "Brand line next to mark",
    format: "plain",
    defaultValue: "Recchi Studio",
  },
  {
    group: "Footer",
    key: "footer.brand_blurb",
    label: "Brand blurb",
    format: "plain",
    defaultValue:
      "Express yourself with cute and nature-inspired patterns — each piece is made to feel joyful on you.",
  },
  {
    group: "Footer",
    key: "footer.section_pages",
    label: "Column heading — pages",
    format: "plain",
    defaultValue: "Pages",
  },
  {
    group: "Footer",
    key: "footer.section_styles",
    label: "Column heading — styles",
    format: "plain",
    defaultValue: "Styles",
  },
  {
    group: "Footer",
    key: "footer.section_catalog",
    label: "Column heading — catalog",
    format: "plain",
    defaultValue: "Catalog",
  },
  {
    group: "Footer",
    key: "footer.nav.shipping",
    label: "Link — Shipping and Returns",
    format: "plain",
    defaultValue: "Shipping and Returns",
  },
  {
    group: "Footer",
    key: "footer.nav.policies",
    label: "Link — Store Policies",
    format: "plain",
    defaultValue: "Store Policies",
  },
  {
    group: "Footer",
    key: "footer.nav.about",
    label: "Link — About Us",
    format: "plain",
    defaultValue: "About Us",
  },
  {
    group: "Footer",
    key: "footer.nav.contact",
    label: "Link — Contact Us",
    format: "plain",
    defaultValue: "Contact Us",
  },
  {
    group: "Footer",
    key: "footer.style.birds",
    label: "Style link — Birds",
    format: "plain",
    defaultValue: "Birds",
  },
  {
    group: "Footer",
    key: "footer.style.flamingos",
    label: "Style link — Flamingos",
    format: "plain",
    defaultValue: "Flamingos",
  },
  {
    group: "Footer",
    key: "footer.style.cats",
    label: "Style link — Cats",
    format: "plain",
    defaultValue: "Cats",
  },
  {
    group: "Footer",
    key: "footer.style.other",
    label: "Style link — Other",
    format: "plain",
    defaultValue: "Other",
  },
  {
    group: "Footer",
    key: "footer.catalog_blurb",
    label: "Catalog column blurb",
    format: "plain",
    defaultValue: "Browse tees, crop tops, shorts, and more. Secure checkout.",
  },
  {
    group: "Footer",
    key: "footer.catalog_cta",
    label: "Catalog column link text",
    format: "plain",
    defaultValue: "Open catalog →",
  },
  {
    group: "Footer",
    key: "footer.copyright",
    label: "Copyright line (year is added automatically before this text)",
    format: "plain",
    defaultValue: "Recchi Studio. All rights reserved.",
  },

  // —— About ——
  {
    group: "About page",
    key: "about.meta_title",
    label: "Page title (browser tab)",
    format: "plain",
    defaultValue: "About",
  },
  {
    group: "About page",
    key: "about.meta_description",
    label: "Short page description",
    format: "plain",
    defaultValue:
      "Recchi Studio designs cute, nature-inspired patterns for people who want to love what they wear.",
  },
  {
    group: "About page",
    key: "about.intro.eyebrow",
    label: "Intro eyebrow",
    format: "plain",
    defaultValue: "My Studio",
  },
  {
    group: "About page",
    key: "about.intro.title",
    label: "Intro title",
    format: "plain",
    defaultValue: "Cute, classy, and a little wild",
  },
  {
    group: "About page",
    key: "about.intro.description",
    label: "Intro paragraph",
    format: "plain",
    defaultValue:
      "We are a small creative studio focused on patterns that feel joyful on fabric — birds, plants, colour, and personality.",
  },
  {
    group: "About — story",
    key: "about.body.image_url",
    label: "Story image",
    format: "plain",
    defaultValue: "/images/about-story.png",
  },
  {
    group: "About — story",
    key: "about.body.image_alt",
    label: "Story image description",
    format: "plain",
    defaultValue: "Hiker by an alpine lake in the mountains",
  },
  {
    group: "About — story",
    key: "about.body_html",
    label: "Story text",
    format: "html",
    defaultValue:
      "<p>Each print is developed to look great on tees, crop tops, shorts, and whatever you want to live in. Whether you are matching with someone you love or building a wardrobe that feels like you, we hope these patterns make getting dressed a little brighter.</p><p>Thank you for supporting independent design. When you browse here, you are helping us keep experimenting with new motifs, palettes, and silhouettes.</p>",
  },
  ...[1, 2, 3].flatMap((n) => [
    {
      group: "About — highlights",
      key: `about.feature.${n}.title`,
      label: `Highlight ${n} title`,
      format: "plain" as const,
      defaultValue: ["100% Cotton", "Original artwork", "Nature inspired"][n - 1]!,
    },
    {
      group: "About — highlights",
      key: `about.feature.${n}.body`,
      label: `Highlight ${n} body`,
      format: "plain" as const,
      defaultValue: [
        "Natural fibres, made to wash and wear.",
        "Prints you will not find on generic templates.",
        "Motifs rooted in the outdoors.",
      ][n - 1]!,
    },
  ]),
  {
    group: "About page",
    key: "about.cta_catalog",
    label: "Primary button",
    format: "plain",
    defaultValue: "Browse the catalog",
  },
  {
    group: "About page",
    key: "about.cta_contact",
    label: "Secondary button",
    format: "plain",
    defaultValue: "Get in touch",
  },

  // —— Contact ——
  {
    group: "Contact page",
    key: "contact.meta_title",
    label: "Page title (browser tab)",
    format: "plain",
    defaultValue: "Contact",
  },
  {
    group: "Contact page",
    key: "contact.meta_description",
    label: "Short page description",
    format: "plain",
    defaultValue: "Reach Recchi Studio for order questions, collaborations, or wholesale inquiries.",
  },
  {
    group: "Contact page",
    key: "contact.intro.eyebrow",
    label: "Intro eyebrow",
    format: "plain",
    defaultValue: "Hello",
  },
  {
    group: "Contact page",
    key: "contact.intro.title",
    label: "Intro title",
    format: "plain",
    defaultValue: "We would love to hear from you",
  },
  {
    group: "Contact page",
    key: "contact.intro.description",
    label: "Intro paragraph",
    format: "plain",
    defaultValue: "Send a message below and we will get back to you as soon as we can.",
  },
  {
    group: "Contact page",
    key: "contact.sidebar.direct_heading",
    label: "Sidebar — “Direct” heading",
    format: "plain",
    defaultValue: "Direct",
  },
  {
    group: "Contact page",
    key: "contact.sidebar.image_url",
    label: "Sidebar image",
    format: "plain",
    defaultValue:
      "https://images.unsplash.com/photo-1515378796134-1487dff0ccd1?auto=format&fit=crop&w=900&q=80",
  },
  {
    group: "Contact page",
    key: "contact.sidebar.image_alt",
    label: "Sidebar image alt text",
    format: "plain",
    defaultValue: "Creative workspace at Recchi Studio",
  },
  {
    group: "Contact page",
    key: "contact.sidebar.note_html",
    label: "Extra note (optional)",
    format: "html",
    defaultValue: "",
  },
  {
    group: "Contact page",
    key: "contact.form.heading",
    label: "Form card heading",
    format: "plain",
    defaultValue: "Message",
  },
  {
    group: "Contact page",
    key: "contact.footer_html",
    label: "Text below the form",
    format: "html",
    defaultValue:
      "<p>Shopping questions? Start in the <a href=\"/catalog\">catalog</a> or <a href=\"/shipping\">shipping</a> page.</p>",
  },

  {
    group: "Legal — policies page",
    key: "policies.meta_title",
    label: "Page title (browser tab)",
    format: "plain",
    defaultValue: "Store policies",
  },
  {
    group: "Legal — policies page",
    key: "policies.meta_description",
    label: "Short page description",
    format: "plain",
    defaultValue: "Terms of service, privacy, and how we use your information at Recchi Studio.",
  },
  {
    group: "Legal — shipping page",
    key: "shipping.meta_title",
    label: "Page title (browser tab)",
    format: "plain",
    defaultValue: "Shipping & Returns",
  },
  {
    group: "Legal — shipping page",
    key: "shipping.meta_description",
    label: "Short page description",
    format: "plain",
    defaultValue: "Free shipping in Canada and the US. How we ship orders, timelines, and returns at Recchi Studio.",
  },

  // —— Legal MDX (stored in DB; seed copies from files on first insert only) ——
  {
    group: "Legal — MDX",
    key: "legal.policies_mdx",
    label: "Full policy text",
    format: "mdx",
    defaultValue: "",
  },
  {
    group: "Legal — MDX",
    key: "legal.shipping_mdx",
    label: "Full shipping page text",
    format: "mdx",
    defaultValue: "",
  },

  ...globalTypographyDefinitions().map(
    (d) =>
      ({
        group: d.group,
        key: d.key,
        label: d.label,
        format: "choice" as const,
        defaultValue: "inherit",
        choices: [...d.options],
      }) satisfies SiteCopyDefinition,
  ),
];

const DEF_BY_KEY = new Map(SITE_COPY_DEFINITIONS.map((d) => [d.key, d]));

export function siteCopyDefinition(key: string): SiteCopyDefinition | undefined {
  return DEF_BY_KEY.get(key);
}

export function siteCopyDefinitionOrThrow(key: string): SiteCopyDefinition {
  const d = DEF_BY_KEY.get(key);
  if (!d) throw new Error(`Unknown site copy key: ${key}`);
  return d;
}

export function siteCopyGroupsInOrder(): string[] {
  const seen: string[] = [];
  for (const d of SITE_COPY_DEFINITIONS) {
    if (!seen.includes(d.group)) seen.push(d.group);
  }
  return seen;
}
