import { AiOutlineDollar } from "react-icons/ai";
import { BsSafe2 } from "react-icons/bs";
import { FaRegChartBar } from "react-icons/fa";
import { VscArrowSwap } from "react-icons/vsc";

export const NAV_LINKS = [
  { label: "Claim Testnet USD", href: "/claim", Logo: AiOutlineDollar },
  { label: "Mint", href: "/mint", Logo: VscArrowSwap },
  { label: "Stake", href: "/stake", Logo: BsSafe2 },
  { label: "Stats", href: "/stats", Logo: FaRegChartBar },
];
