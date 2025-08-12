# Strategy History Service

Сервис для получения исторических данных стратегий через метод `get_strategies_history` из canister `wcqxd-aaaaa-aaaah-qqe3a-cai`.

## Описание

`StrategyHistoryService` предоставляет методы для:
- Получения данных для построения графиков стратегий
- Получения последних снэпшотов стратегий
- Получения количества снэпшотов для стратегии

## Использование

### Базовое использование

```typescript
import { strategyHistoryService } from '../../services/strategies/strategy-history.service';

// Получить данные для графика
const chartData = await strategyHistoryService.getStrategyChartData(
  [1, 2], // ID стратегий
  '24h'   // Период
);
```

### Использование с хуком

```typescript
import { useStrategyHistory } from '../../hooks';

function StrategyComponent({ strategyId }: { strategyId: number }) {
  const { chartData, isLoading, error, refetch } = useStrategyHistory({
    strategyIds: [strategyId],
    period: '24h',
    autoFetch: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <LineChart data={chartData} />
  );
}
```

## API

### StrategyHistoryService

#### getStrategyChartData(strategyIds: number[], period: PeriodKey)

Получает исторические данные стратегий для построения графика.

**Параметры:**
- `strategyIds` - массив ID стратегий
- `period` - период данных: `"24h"`, `"1m"`, `"1y"`, `"all"`

**Возвращает:**
```typescript
Promise<StrategyChartData[]>
```

#### getLatestSnapshot(strategyId: number)

Получает последний снэпшот стратегии.

**Параметры:**
- `strategyId` - ID стратегии

**Возвращает:**
```typescript
Promise<any | null>
```

#### getSnapshotsCount(strategyId: number)

Получает количество снэпшотов для стратегии.

**Параметры:**
- `strategyId` - ID стратегии

**Возвращает:**
```typescript
Promise<bigint>
```

### useStrategyHistory Hook

Хук для React компонентов, предоставляющий состояние и методы для работы с историей стратегий.

**Параметры:**
```typescript
{
  strategyIds: number[];
  period: "24h" | "1m" | "1y" | "all";
  autoFetch?: boolean;
}
```

**Возвращает:**
```typescript
{
  chartData: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
}
```

## Типы данных

### ChartDataPoint
```typescript
interface ChartDataPoint {
  x: number; // timestamp
  y: number; // total balance value
}
```

### StrategyChartData
```typescript
interface StrategyChartData {
  strategyId: number;
  data: ChartDataPoint[];
}
```

### ChartPeriod
```typescript
interface ChartPeriod {
  "24h": { length: number; interval: number };
  "1m": { length: number; interval: number };
  "1y": { length: number; interval: number };
  all: { length: number; interval: number };
}
```

## Периоды данных

- **24h**: 24 точки, интервал 1 час
- **1m**: 30 точек, интервал 1 день
- **1y**: 12 точек, интервал 1 месяц
- **all**: 24 точки, интервал 1 месяц

## Обработка ошибок

Сервис автоматически обрабатывает ошибки и возвращает понятные сообщения. В случае ошибки:

1. Логируется детальная информация в консоль
2. Возвращается сообщение об ошибке
3. Предоставляется возможность повторить запрос

## Тестирование

Для запуска тестов:

```bash
npm test strategy-history.service.spec.ts
```

## Зависимости

- `@dfinity/agent` - для работы с Internet Computer
- `@dfinity/candid` - для типов IDL
- React хуки (для `useStrategyHistory`)
