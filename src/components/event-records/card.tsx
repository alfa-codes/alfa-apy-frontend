import colors from "tailwindcss/colors";
import { useEventRecords } from "../../hooks/event-records";
import { Card } from "../ui/card";
import SquareLoader from "react-spinners/ClimbingBoxLoader";
import { formatTimestamp } from "../../utils/date";

export function EventRecordsCard() {
  const { eventRecords } = useEventRecords();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold mb-4">🧾 Events</h3>
        <a href="#" className="hover:underline text-sm">
          More →
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">
                ID
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">
                Type
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">
                Date
              </th>
              {/* <th className="text-left py-2 px-2 text-gray-600 font-medium">
                Amount
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">
                Pair
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">
                From
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">
                To
              </th> */}
            </tr>
          </thead>
          {!eventRecords && (
            <tbody>
              <div className="flex justify-center items-center h-full">
                <SquareLoader
                  className="mx-auto"
                  color={colors.amber[500]}
                  loading={true}
                  size={20}
                />
              </div>
            </tbody>
          )}
          <tbody>
            {eventRecords?.map((record, i) => (
              <tr key={i} className="border-t border-amber-600/10">
                <td className="py-2 px-2">#{record.id.toString()}</td>
                <td className="py-2 px-2">{record.type}</td>
                <td className="py-2 px-2">{formatTimestamp(record.timestamp)}</td>
                {/* <td className="py-2 px-2">{record.amount}</td> */}
                {/* <td className="py-2 px-2">{record.token}</td> */}
                {/* <td className="py-2 px-2">{record.from}</td> */}
                {/* <td className="py-2 px-2">{record.to}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
