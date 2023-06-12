import { formatNumber, formatNumberUSD } from "lib/numbers";
import { useTreasuryData } from "./data";

export default function TreasuryReservesTable() {
  const { items, sum } = useTreasuryData();

  return (
    <table className="w-full text-lg">
      <thead>
        <tr>
          <th className="text-left py-3">Asset</th>
          <th className="text-right py-3">Quantity</th>
          <th className="text-right py-3">Value</th>
          <th className="text-right py-3">Percent</th>
        </tr>
      </thead>
      <tbody className="text-lg">
        {items.map(({ name, qty, usd, percent }) => {
          return (
            <tr key={name}>
              <td className="text-left py-0.5">{name}</td>
              <td className="text-right py-0.5">{formatNumber(qty)}</td>
              <td className="text-right py-0.5">{formatNumberUSD(usd)}</td>
              <td className="text-right py-0.5">
                {(percent * 100).toFixed(2)}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
