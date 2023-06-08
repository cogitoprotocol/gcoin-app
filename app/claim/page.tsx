import ClientOnly from "@/components/common/ClientOnly";
import Section from "@/components/common/Section";
import AddAssetButton from "./AddAssetButton";
import ClaimForm from "./ClaimForm";
import ClaimFormSkeleton from "./ClaimFormSkeleton";

export default function ClaimPage() {
  return (
    <>
      <Section className="w-full max-w-md mb-8">
        <h1 className="w-full text-3xl">Testnet USD</h1>

        <ClientOnly fallback={<ClaimFormSkeleton />}>
          <ClaimForm />
        </ClientOnly>

        <div className="w-full text-zinc-300 text-sm">
          <AddAssetButton />
        </div>
      </Section>
    </>
  );
}
