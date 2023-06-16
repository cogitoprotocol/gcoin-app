import { useEffect, useState } from "react";
import { Block } from "viem";
import { useBlockNumber, usePublicClient } from "wagmi";

export const useLatestBlock = () => {
  const publicClient = usePublicClient();
  const blockNumber = useBlockNumber();
  const [block, setBlock] = useState<Block>();

  useEffect(() => {
    (async () => {
      const _block = await publicClient.getBlock();
      setBlock(_block);
    })();
  }, [publicClient, blockNumber.data]);

  return block;
};

export const useBlockTimestamp = () => {
  const block = useLatestBlock();

  if (block) {
    return Number(block.timestamp);
  }

  return 0;
};
