import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RateCraft — Contractor Pricing Tools",
    short_name: "RateCraft",
    description:
      "Free calculators that help contractors price jobs, control costs and protect profit.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f3",
    theme_color: "#124a8f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
