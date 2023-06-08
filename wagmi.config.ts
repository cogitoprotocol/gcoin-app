import dotenv from "dotenv";

import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";

dotenv.config({ path: `.env.local`, override: true });

let deployments;
if (process.env.NEXT_PUBLIC_NETWORK === "sepolia") {
  deployments = require("./lib/contracts/sepolia.json");
} else {
  try {
    deployments = require("./lib/contracts/localhost.json");
  } catch (error) {
    console.error("Localhost contracts not found!");
    process.exit(1);
  }
}
// else if (process.env.NEXT_PUBLIC_NETWORK === 'mainnet') {}
console.log(`Using ${process.env.NEXT_PUBLIC_NETWORK} contracts`, deployments);

export default defineConfig({
  out: "lib/wagmiHooks.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "../gcoin",
      deployments: deployments as {
        [x: string]: `0x${string}`;
      },
    }),
    react(),
  ],
});
