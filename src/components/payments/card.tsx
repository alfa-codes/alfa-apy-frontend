import colors from "tailwindcss/colors";
import { Card } from "../ui/card";
import SquareLoader from "react-spinners/ClimbingBoxLoader";
import { useEventRecords } from "../../hooks/event-records";
import { formatTimestamp } from "../../utils/date";
import { useMemo, useState } from "react";
import { EventRecord } from "../../services/event-records/service";
import { useTheme } from "../../contexts/ThemeContext";
import { clsx } from "clsx";

const formatPrincipal = (principal: string | undefined): string => {
  if (!principal) return "N/A";
  if (principal.length <= 14) return principal;
  return `${principal.slice(0, 7)}...${principal.slice(-7)}`;
};

export function PaymentsCard() {
  const { eventRecords } = useEventRecords();
  const [selectedCorrelationId, setSelectedCorrelationId] = useState<string | null>(null);
  const { theme } = useTheme();

  // Группируем события по correlation_id
  const groupedEvents = useMemo(() => {
    if (!eventRecords) return [];
    
    const groups = new Map<string, EventRecord[]>();
    
    eventRecords.forEach(event => {
      const correlationId = event.correlation_id;
      if (!groups.has(correlationId)) {
        groups.set(correlationId, []);
      }
      groups.get(correlationId)!.push(event);
    });
    
    return Array.from(groups.entries())
      .map(([correlationId, events]) => ({
        correlationId,
        events: events.sort((a, b) => Number(b.id) - Number(a.id)),
        firstEvent: events[0] // Первое событие для названия группы
      }))
      .sort((a, b) => Number(b.firstEvent.id) - Number(a.firstEvent.id));
  }, [eventRecords]);

  return (
    <>
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">🧾 Events</h3>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {!groupedEvents.length && (
            <div className="flex justify-center items-center h-32">
              <SquareLoader
                className="mx-auto"
                color={colors.amber[500]}
                loading={true}
                size={20}
              />
            </div>
          )}
          {groupedEvents.length > 0 && (
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
                    Principal
                  </th>
                  <th className="text-left py-2 px-2 text-gray-600 font-medium">
                    Date
                  </th>
                  <th className="text-left py-2 px-2 text-gray-600 font-medium">
                    Events
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupedEvents.map((group, i) => (
                  <tr 
                    key={i} 
                    className={clsx(
                      "border-t border-amber-600/10 cursor-pointer transition-colors",
                      theme === 'dark' 
                        ? "hover:bg-[#2d2b3d] border-purple-600/20" 
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => setSelectedCorrelationId(group.correlationId)}
                  >
                    <td className="py-2 px-2">#{group.firstEvent.id}</td>
                    <td className="py-2 px-2">{group.firstEvent.type}</td>
                    <td className="py-2 px-2">{formatPrincipal(group.firstEvent.userPrincipal?.toString())}</td>
                    <td className="py-2 px-2">{formatTimestamp(group.firstEvent.timestamp)}</td>
                    <td className="py-2 px-2">
                      {group.events.length > 1 && (
                        <span className={clsx(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          theme === 'dark' 
                            ? "bg-purple-600 text-green-400" 
                            : "bg-purple-100 text-purple-800"
                        )}>
                          +{group.events.length - 1}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Модальное окно для отображения группы событий */}
      {selectedCorrelationId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={clsx(
            "max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto rounded-lg shadow-xl",
            theme === 'dark' ? "bg-[#1a1a2e] border-2 border-purple-600" : "bg-white"
          )}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  Events Group: {groupedEvents.find(g => g.correlationId === selectedCorrelationId)?.firstEvent.type}
                </h3>
                <button
                  onClick={() => setSelectedCorrelationId(null)}
                  className={clsx(
                    "text-2xl font-bold hover:opacity-70 transition-opacity",
                    theme === 'dark' ? "text-green-400" : "text-gray-600"
                  )}
                >
                  ×
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={clsx(
                      "border-b",
                      theme === 'dark' ? "border-purple-600/40" : "border-gray-200"
                    )}>
                      <th className="text-left py-3 px-4 font-medium">ID</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Principal</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedEvents
                      .find(g => g.correlationId === selectedCorrelationId)
                      ?.events.map((event, index) => (
                        <tr 
                          key={index}
                          className={clsx(
                            "border-b cursor-pointer transition-colors",
                            theme === 'dark' 
                              ? "border-purple-600/20 hover:bg-[#2d2b3d]" 
                              : "border-gray-100 hover:bg-gray-50"
                          )}
                        >
                          <td className="py-3 px-4">#{event.id}</td>
                          <td className="py-3 px-4">{event.type}</td>
                          <td className="py-3 px-4">{formatPrincipal(event.userPrincipal?.toString())}</td>
                          <td className="py-3 px-4">{formatTimestamp(event.timestamp)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
