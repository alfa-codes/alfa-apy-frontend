import colors from "tailwindcss/colors";
import { Card } from "../ui/card";
import SquareLoader from "react-spinners/ClimbingBoxLoader";
import { useEventRecords } from "../../hooks/event-records";
import { formatTimestamp } from "../../utils/date";
import { useMemo, useState } from "react";
import { EventRecord } from "../../services/event-records/service";
import { useTheme } from "../../contexts/ThemeContext";
import { clsx } from "clsx";
import { eventDetailsService, EventDetails } from "../../services/event-records/event-details.service";

export function PaymentsCard() {
  const { eventRecords } = useEventRecords();
  const [selectedCorrelationId, setSelectedCorrelationId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
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
        firstEvent: events[0], // Первое событие для названия группы
        firstEventSummary: eventDetailsService.extractEventDetails(events[0].event).summary
      }))
      .sort((a, b) => Number(b.firstEvent.id) - Number(a.firstEvent.id));
  }, [eventRecords]);

  // Функция для отображения деталей события
  const renderEventDetails = (event: EventRecord) => {
    return (
      <div className={clsx(
        "border rounded-lg p-4 cursor-pointer transition-colors",
        theme === 'dark'
          ? 'border-purple-600 bg-[#1a1a2e] text-green-400 hover:bg-[#2d2b3d]'
          : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
      )}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">#{event.id.toString()}</span>
          <span className={`text-sm ${
            theme === 'dark' ? 'text-green-300' : 'text-gray-500'
          }`}>
            {formatTimestamp(event.timestamp)}
          </span>
        </div>
        <div className={theme === 'dark' ? 'text-green-400' : 'text-gray-700'}>
          {eventDetailsService.extractEventDetails(event.event).summary}
        </div>
        <button
          onClick={() => {
            setSelectedEvent(event);
            // Извлекаем детали события
            const details = eventDetailsService.extractEventDetails(event.event);
            setEventDetails(details);
            setIsEventDetailsOpen(true);
          }}
          className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-purple-600 text-green-400 hover:bg-purple-700'
              : 'bg-amber-500 text-white hover:bg-amber-600'
          }`}
        >
          🔍 View Event Details
        </button>
      </div>
    );
  };

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
                    Summary
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
                    <td className="py-2 px-2">{group.firstEventSummary}</td>
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
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedCorrelationId(null)}
        >
          <div 
            className={clsx(
              "max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto rounded-lg shadow-xl",
              theme === 'dark' ? "bg-[#1a1a2e] border-2 border-purple-600" : "bg-white"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  Events Group: {groupedEvents.find(g => g.correlationId === selectedCorrelationId)?.firstEventSummary}
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
              
              <div className="space-y-3">
                {groupedEvents
                  .find(g => g.correlationId === selectedCorrelationId)
                  ?.events.map((event, index) => (
                    <div key={index}>
                      {renderEventDetails(event)}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модалка для отображения деталей конкретного события */}
      {isEventDetailsOpen && selectedEvent && eventDetails && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsEventDetailsOpen(false)}
        >
          <div 
            className={`rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto ${
              theme === 'dark' 
                ? 'bg-[#232136] text-green-400 border-2 border-purple-600' 
                : 'bg-white text-gray-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                🔍 Event Details: #{selectedEvent.id.toString()}
              </h3>
              <button
                onClick={() => setIsEventDetailsOpen(false)}
                className={`text-xl ${
                  theme === 'dark' 
                    ? 'text-green-400 hover:text-green-300' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-gray-50'
              }`}>
                <h4 className="font-semibold mb-3 text-lg">📋 Event Summary</h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-green-300' : 'text-gray-600'
                }`}>
                  {eventDetails.summary}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-gray-50'
              }`}>
                <h4 className="font-semibold mb-3 text-lg">🔧 Event Parameters</h4>
                <div className="space-y-3">
                  {eventDetails.fields.map((field, index) => (
                    <div key={index} className="flex justify-between items-start py-2 border-b border-gray-600/20">
                      <div className="flex-1">
                        <span className="font-medium">{field.name}</span>
                        {field.description && (
                          <div className={`text-xs mt-1 ${
                            theme === 'dark' ? 'text-green-300' : 'text-gray-500'
                          }`}>
                            {field.description}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`font-mono text-sm px-2 py-1 rounded ${
                          theme === 'dark' ? 'bg-purple-600/20 text-green-400' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {field.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-gray-50'
              }`}>
                <h4 className="font-semibold mb-3 text-lg">📊 Basic Information</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Event ID:</span>
                    <span className="font-mono">#{selectedEvent.id.toString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Summary:</span>
                    <span className="font-mono text-sm">{eventDetails.summary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Timestamp:</span>
                    <span className="font-mono">{formatTimestamp(selectedEvent.timestamp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Correlation ID:</span>
                    <span className="font-mono text-xs break-all">{selectedEvent.correlation_id}</span>
                  </div>
                  {selectedEvent.userPrincipal && (
                    <div className="flex justify-between">
                      <span className="font-medium">User Principal:</span>
                      <span className="font-mono text-xs break-all">{selectedEvent.userPrincipal.toString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
