"use client";

import Section from "@/components/common/Section";
import DepositForm from "./DepositForm";

export default function DepositSection() {
  return (
    <Section className="w-full max-w-md mb-8">
      <h1 className="w-full text-3xl">Deposit GCOIN</h1>

      <p className="text-sm">
        Stake your GCOIN for a fixed duration to earn CGV rewards. The longer
        you stake, the more rewards you receive. Deposits are locked until the
        specified date.
      </p>

      <DepositForm />
    </Section>
  );
}
