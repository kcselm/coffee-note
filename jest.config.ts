import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "/node_modules/(?!(superjson|lucide-react|@radix-ui|your-esm-deps-here)/)",
  ],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1", // Adjust the path if your source folder is not `src`
  },
};

export default createJestConfig(config);
