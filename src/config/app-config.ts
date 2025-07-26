import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Finisterre Gardenz",
  version: packageJson.version,
  copyright: `© ${currentYear}, Finisterre Gardenz.`,
  meta: {
    title: "Finisterre Gardenz Dashboard",
    description: "Test",
  },
};
