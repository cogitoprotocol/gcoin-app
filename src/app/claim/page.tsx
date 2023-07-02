import AddAssetButton from "components/common/AddAssetButton";
import Section from "components/common/Section";
import { USDC_DECIMALS } from "lib/constants";
import { usdTestAddress } from "lib/wagmiHooks";
import Link from "next/link";
import ClaimForm from "./ClaimForm";

export default function ClaimPage() {
  return (
    <>
      <Section className="p-8 w-full max-w-md flex flex-col gap-4">
        <h1 className="text-3xl">Testnet USD</h1>

        <p className="text-sm">
          To claim Testnet USD, which is required to mint GCOIN, you need to
          have Sepolia ETH to pay the transaction fee. Head over to{" "}
          <Link
            target="_blank"
            href="https://sepolia-faucet.pk910.de/"
            className="text-accent hover:text-accent-active"
          >
            this faucet
          </Link>{" "}
          to mine Sepolia ETH. Remember to change your network to Sepolia
          Testnet.
        </p>

        <ClaimForm />

        <div className="text-sm text-gray-600 dark:text-gray-300">
          <AddAssetButton
            address={usdTestAddress}
            symbol="USDTest"
            decimals={USDC_DECIMALS}
          />
        </div>
      </Section>
    </>
  );
}
