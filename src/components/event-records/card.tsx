import colors from "tailwindcss/colors";
import { useEventRecords } from "../../hooks/event-records";
import { Card } from "../ui/card";
import SquareLoader from "react-spinners/ClimbingBoxLoader";
import { formatTimestamp } from "../../utils/date";
import { useAuth } from "@nfid/identitykit/react";
import { useMemo, useState } from "react";
import { EventRecord } from "../../services/event-records/service";
import { useTheme } from "../../contexts/ThemeContext";
import { eventDetailsService, EventDetails } from "../../services/event-records/event-details.service";

export function EventRecordsCard() {
  const [selectedCorrelationId, setSelectedCorrelationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isRetryModalOpen, setIsRetryModalOpen] = useState(false);

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
        firstEvent: events[0], // Первое событие для названия группы
        firstEventSummary: eventDetailsService.extractEventDetails(events[0].event).summary,
        hasFailedEvent: events.some(event => event.type.includes('Failed'))
      }))
      .sort((a, b) => Number(b.firstEvent.id) - Number(a.firstEvent.id));
  }, [filteredEventRecords]);

  // Функция для отображения деталей события
  const renderEventDetails = (event: EventRecord) => {
    return (
      <div className={`border rounded-lg p-4 ${
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
                Summary
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">
                Date
              </th>
              <th className="text-left py-2 px-2 text-gray-600 font-medium">
                Actions
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
                <td className="py-2 px-2">{group.firstEventSummary}</td>
                <td className="py-2 px-2">{formatTimestamp(group.firstEvent.timestamp)}</td>
                <td className="py-2 px-2">
                  {group.hasFailedEvent && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRetryModalOpen(true);
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        theme === 'dark'
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      🔄 Retry
                    </button>
                  )}
                </td>
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
                Events Group: {groupedEvents.find(g => g.correlationId === selectedCorrelationId)?.firstEventSummary}
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
                  <div key={index}>
                    {renderEventDetails(event)}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Модалка для отображения деталей конкретного события */}
      {isEventDetailsOpen && selectedEvent && eventDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto ${
            theme === 'dark' 
              ? 'bg-[#232136] text-green-400 border-2 border-purple-600' 
              : 'bg-white text-gray-900'
          }`}>
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
                  <div className="flex justify-between">
                    <span className="font-medium">Event Type:</span>
                    <span className="font-mono text-xs break-all">{selectedEvent.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модалка Retry для failed событий */}
      {isRetryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${
            theme === 'dark' 
              ? 'bg-[#232136] text-green-400 border-2 border-red-600' 
              : 'bg-white text-gray-900 border-2 border-red-500'
          }`}>
            <div className="text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold mb-4">Retry Feature</h3>
              <p className={`text-sm mb-6 ${
                theme === 'dark' ? 'text-green-300' : 'text-gray-600'
              }`}>
                We are working on this automatic retry feature. Please contact us - we will help you recover your assets.
              </p>
              <button
                onClick={() => setIsRetryModalOpen(false)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
