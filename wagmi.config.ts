import dotenv from "dotenv";

import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import localhostContracts from "./lib/contracts/localhost.json";
import sepoliaContracts from "./lib/contracts/sepolia.json";

dotenv.config({ path: `.env.local`, override: true });

let deployments = localhostContracts;
if (process.env.NEXT_PUBLIC_NETWORK === "sepolia") {
  deployments = sepoliaContracts;
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
