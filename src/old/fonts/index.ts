import localFont from "next/font/local";

export const recursive = localFont({
  src: [
    {
      path: "./recursive/Recursive_VF_1.085--subset-GF_latin_basic.woff2",
      weight: "300...800",
      style: "normal",
    },
  ],
  variable: "--rec-var",
  display: "swap",
  preload: true,
});
