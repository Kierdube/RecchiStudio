import {
  buildGoogleFontsStylesheetUrl,
  GOOGLE_FONT_CATALOG,
  type GoogleFontDefinition,
} from "@/lib/google-fonts";

type GoogleFontsLoaderProps = {
  fonts: readonly GoogleFontDefinition[];
};

export function GoogleFontsLoader({ fonts }: GoogleFontsLoaderProps) {
  const href = buildGoogleFontsStylesheetUrl(fonts);
  if (!href) return null;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={href} />
    </>
  );
}

/** Load every curated Google font (admin previews). */
export function GoogleFontsLoaderAll() {
  return <GoogleFontsLoader fonts={GOOGLE_FONT_CATALOG} />;
}
