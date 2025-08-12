import colors from "tailwindcss/colors";
import { useEventRecords } from "../../hooks/event-records";
import { Card } from "../ui/card";
import SquareLoader from "react-spinners/ClimbingBoxLoader";
import { formatTimestamp } from "../../utils/date";
import { useAuth } from "@nfid/identitykit/react";
import { useMemo, useState } from "react";
import { EventRecord } from "../../services/event-records/service";
import { useTheme } from "../../contexts/ThemeContext";

export function EventRecordsCard() {
  const [selectedCorrelationId, setSelectedCorrelationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();
  const { theme } = useTheme();

  const { eventRecords } = useEventRecords();

  const filteredEventRecords = useMemo(() => {
    return eventRecords?.filter((record) => record.userPrincipal?.toString() === user?.principal.toString());
  }, [eventRecords, user]);

  // Группируем события по correlation_id
  const groupedEvents = useMemo(() => {
    if (!filteredEventRecords) return [];
    
    const groups = new Map<string, EventRecord[]>();
    
    filteredEventRecords.forEach(record => {
      const correlationId = record.correlation_id;
      if (!groups.has(correlationId)) {
        groups.set(correlationId, []);
      }
      groups.get(correlationId)!.push(record);
    });
    
    // Сортируем группы по ID первого события (новые сверху)
    return Array.from(groups.entries())
      .map(([correlationId, events]) => ({
        correlationId,
        events: events.sort((a, b) => Number(b.id) - Number(a.id)),
        firstEvent: events[0] // Первое событие для названия группы
      }))
      .sort((a, b) => Number(b.firstEvent.id) - Number(a.firstEvent.id));
  }, [filteredEventRecords]);

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">🧾 Events</h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
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
            </tr>
          </thead>
          {!groupedEvents.length && (
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
            {groupedEvents.map((group, i) => (
              <tr 
                key={i} 
                className={`border-t border-amber-600/10 cursor-pointer transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-[#1a1a2e] hover:border-purple-600' 
                    : 'hover:bg-amber-50'
                }`}
                onClick={() => {
                  setSelectedCorrelationId(group.correlationId);
                  setIsModalOpen(true);
                }}
              >
                <td className="py-2 px-2">
                  <div className="flex items-center gap-2">
                    <span>#{group.firstEvent.id.toString()}</span>
                    {group.events.length > 1 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        theme === 'dark'
                          ? 'bg-purple-600 text-green-400'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        +{group.events.length - 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-2">{group.firstEvent.type}</td>
                <td className="py-2 px-2">{formatTimestamp(group.firstEvent.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Модалка для отображения всех событий с одним correlation_id */}
      {isModalOpen && selectedCorrelationId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto ${
            theme === 'dark' 
              ? 'bg-[#232136] text-green-400 border-2 border-purple-600' 
              : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Events Group: {groupedEvents.find(g => g.correlationId === selectedCorrelationId)?.firstEvent.type}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`text-xl ${
                  theme === 'dark' 
                    ? 'text-green-400 hover:text-green-300' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              {groupedEvents
                .find(g => g.correlationId === selectedCorrelationId)
                ?.events.map((event, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    theme === 'dark'
                      ? 'border-purple-600 bg-[#1a1a2e] text-green-400'
                      : 'border-gray-200 bg-white text-gray-900'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">#{event.id.toString()}</span>
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <div className={theme === 'dark' ? 'text-green-400' : 'text-gray-700'}>
                      {event.type}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
