import AddAssetButton from "components/common/AddAssetButton";
import Section from "components/common/Section";
import { USDC_DECIMALS } from "lib/constants";
import { usdTestAddress } from "lib/wagmiHooks";
import ClaimForm from "./ClaimForm";

export default function ClaimPage() {
  return (
    <>
      <Section className="p-8 w-full max-w-md flex flex-col gap-4">
        <h1 className="text-3xl">Testnet USD</h1>

        <p className="text-sm">
          You can claim some Testnet USD for minting GCOIN.
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
