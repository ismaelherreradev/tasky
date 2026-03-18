import type { Metadata } from "next";
import { SiteConfig } from "~/config/site";
import { env } from "~/env";

interface CreateMetadataOptions {
  title?: string;
  description?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  noIndex?: boolean;
  canonical?: string;
}

export function createMetadata({
  title,
  description = SiteConfig.description,
  image,
  type = "website",
  publishedTime,
  authors,
  noIndex = false,
  canonical,
}: CreateMetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} | ${SiteConfig.title}` : SiteConfig.title;

  const defaultImage = {
    url: "/tasky.png",
    width: 1200,
    height: 630,
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    alt: title || SiteConfig.title,
  };

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const ogImage = image || defaultImage;

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: pageTitle,
    description,
    icons: [
      {
        url: "/tasky.svg",
        href: "/tasky.svg",
      },
      {
        rel: "icon",
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        url: "/tasky.svg",
      },
      {
        rel: "apple-touch-icon",
        url: "/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
    manifest: "/site.webmanifest",
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    ...(canonical && {
      alternates: {
        canonical,
      },
    }),
    openGraph: {
      title: pageTitle,
      description,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      url: canonical || "/",
      siteName: SiteConfig.title,
      images: [ogImage],
      locale: "en_US",
      type,
      ...(type === "article" && {
        publishedTime,
        authors,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage.url],
    },
  };
}

export function createPageMetadata(
  {
    title,
    description,
    path,
    image,
    noIndex,
  }: {
    title: string;
    description?: string;
    path?: string;
    image?: CreateMetadataOptions["image"];
    noIndex?: boolean;
  } = { title: "" },
): Metadata {
  return createMetadata({
    title,
    description,
    image,
    noIndex,
    canonical: path ? `${env.NEXT_PUBLIC_APP_URL}${path}` : undefined,
  });
}

export function createArticleMetadata(
  {
    title,
    description,
    path,
    image,
    publishedTime,
    authors,
  }: {
    title: string;
    description?: string;
    path?: string;
    image?: CreateMetadataOptions["image"];
    publishedTime?: string;
    authors?: string[];
  } = { title: "" },
): Metadata {
  return createMetadata({
    title,
    description,
    image,
    type: "article",
    publishedTime,
    authors,
    canonical: path ? `${env.NEXT_PUBLIC_APP_URL}${path}` : undefined,
  });
}

export const defaultMetadata: Metadata = createMetadata();
