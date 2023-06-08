import dotenv from "dotenv";

import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import { getContractAddresses } from "./lib/wagmi";

dotenv.config({ path: `.env.local`, override: true });

const deployments = getContractAddresses();
console.log(`Using ${process.env.NEXT_PUBLIC_NETWORK} contracts`, deployments);

export default defineConfig({
  out: "lib/wagmiHooks.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "../gcoin",
      deployments,
    }),
    react(),
  ],
});
