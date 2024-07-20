import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: "#FF6F07",
        "orange-white": "#F6F2EF",
        grey: {
          dark: "#1B191A",
          medium: "#232323",
          light: "#303030",
        },
      },
    },
  },
};
