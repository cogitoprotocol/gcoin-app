import { AiOutlineDollar } from "react-icons/ai";
import { BsSafe2 } from "react-icons/bs";
import {
  FaDiscord,
  FaGithub,
  FaMedium,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";
import { VscArrowSwap } from "react-icons/vsc";

export const NAV_LINKS = [
  { label: "Testnet USD", href: "/claim/", Logo: AiOutlineDollar },
  { label: "Mint", href: "/", Logo: VscArrowSwap },
  { label: "Stake", href: "/stake/", Logo: BsSafe2 },
  // { label: "Stats", href: "/stats", Logo: FaRegChartBar },
];

export const EXTERNAL_LINKS = [
  { href: "https://twitter.com/cogitoprotocol", Logo: FaTwitter },
  { href: "https://discord.gg/8xMJeGQayG", Logo: FaDiscord },
  { href: "https://t.me/joincogito", Logo: FaTelegram },
  { href: "https://github.com/cogitoprotocol", Logo: FaGithub },
  { href: "https://medium.com/@CogitoProtocol", Logo: FaMedium },
];
