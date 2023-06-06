import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { localhost } from "@wagmi/core/chains";
import { configureChains, createConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import localhostContracts from "./contracts/localhost.json";

const config = configureChains(
  [localhost],
  [
    alchemyProvider({ apiKey: "pCSDyMOuFkzLuUW3FFxpDkl2OHWB-ndx" }),
    infuraProvider({ apiKey: "dfe878e9f9764f57ad1bb851fe7e5919" }),
    publicProvider(),
  ]
);

export const chains = config.chains;

const { connectors } = getDefaultWallets({
  appName: "Cogito Protocol",
  projectId: "b94729529dfb46397675ba33aa64cb0a",
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient: config.publicClient,
});

export const getContractAddresses = () => {
  let contracts = localhostContracts;
  // if (process.env.GCOIN_CHAIN === 'sepolia') {}
  // else if (process.env.GCOIN_CHAIN === 'mainnet') {}

  return contracts as {
    [x: string]: `0x${string}`;
  };
};
