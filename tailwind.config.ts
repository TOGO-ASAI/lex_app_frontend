import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: "#FF7F00",
        "orange-white": "#F6F2EF",
        grey: {
          dark: "#1A1A1A",
          medium: "#232323",
          light: "#303030",
        },
      },
    },
  },
};
