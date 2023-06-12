import ClientOnly from "components/common/ClientOnly";
import Section from "components/common/Section";
import AddAssetButton from "./AddAssetButton";
import ClaimForm from "./ClaimForm";
import ClaimFormSkeleton from "./ClaimFormSkeleton";

export default function ClaimPage() {
  return (
    <>
      <Section className="w-full max-w-md flex flex-col gap-4">
        <h1 className="text-3xl">Testnet USD</h1>

        <p className="text-sm">
          You can claim some Testnet USD for minting GCOIN.
        </p>

        <ClientOnly fallback={<ClaimFormSkeleton />}>
          <ClaimForm />
        </ClientOnly>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          <AddAssetButton />
        </div>
      </Section>
    </>
  );
}
