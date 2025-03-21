const commonColors = {
    blue: {
      50: "#EBEFFE",
      100: "#B5C4FC",
      200: "#fff",
      300: "#5F80FA",
      400: "#486FF9",
      500: "#3761F9",
      600: "#2D4EC9",
      700: "#243EA1",
      800: "#1C317E",
      900: "#15255F"
    },
    gray: {
      900: "#502c92",
      850: "#4e2b77",
      825: "#191e2a",
      815: "#1a1f2b",
      800: "#18011f",
      785: "#421255",
      750: "#4e2b77",
      700: "#502c92",
      600: "#9c27b0",
      500: "#d1d8e2",
      400: "#A0AEC0",
      300: "#CBD5E0",
      200: "#E2E8F0",
      100: "#EDF2F7",
      50: "#F7FAFC"
    },
    green: {
      900: "#004F3A",
      800: "#00684D",
      700: "#008562",
      600: "#00A67B",
      500: "#00CD98",
      400: "#16D1A1",
      300: "#33D7AD",
      200: "#5CDFBD",
      100: "#A1ECD9",
      50: "#E6FAF5"
    },
    red: {
      50: "#FFF5F5",
      100: "#FFF8F8",
      200: "#FDE3E3",
      300: "#FAC1C0",
      400: "#F5918F",
      500: "#EF5350",
      600: "#DD4D4A",
      700: "#C74543",
      800: "#AE3C3B",
      900: "#923231"
    },
    darkTeal: {
      500: "#144241",
      300: "#3F6D6C"
    }
  };
  
  export const brand = {
    primary: commonColors.blue[500],
    altBg: `radial-gradient(94.32% 94.6% at 4.04% -44.6%,${commonColors.blue[600]}66 0%,${commonColors.gray[900]}00 100%),linear-gradient(0deg,${commonColors.gray[900]},${commonColors.gray[900]})`
  };
  
  export const colors = {
    ...commonColors,
    ...brand
  };
  