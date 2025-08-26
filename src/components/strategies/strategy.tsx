import {
  useBalances,
  useDeposit,
  // usePools,
  useTokens,
  useWithdraw,
} from "../../hooks";
import { Card, Icon, Icons } from "../ui";
import { TokensLogos } from "./tokens-logos";
import { getStrategyTokenLogos, getTokenLogo } from "./utils";
import { useEffect, useState } from "react";
import { Deposit } from "./deposit";
import { Withdraw } from "./withdraw";
import { useAgent, useAuth } from "@nfid/identitykit/react";
import { motion } from "framer-motion";
import BigNumber from "bignumber.js";
import { LineChart } from "../charts/line-chart";
import { Button } from "../ui";
import { Tabs } from "../ui/tabs";
import clsx from "clsx";
import { ConnectWallet } from "../connect-wallet";
import { PaymentsCard } from "../payments";
import { Strategy as StrategyResponse } from "../../services/strategies/strategy-service";
import { useTheme } from "../../contexts/ThemeContext";
import { strategyHistoryService, ChartDataPoint } from "../../services/strategies/strategy-history.service";
import { useDispatch } from "react-redux";
import { refreshUserBalance, refreshStrategyEvents } from "../../store/slices/strategies";
import { Dispatch } from "../../store/store";

export function Strategy({
  value,
  onBack,
  // balance,
}: {
  value: StrategyResponse;
  onBack: () => unknown;
  balance?: {
    user_shares: number;
    total_shares: number;
    initial_deposit: number;
    // usd_balance: number;
    // price: string;
    // amount_0: number;
    // amount_1: number;
  };
}) {
  const { user } = useAuth();
  const agent = useAgent({ host: "https://ic0.app" });
  const { tokens } = useTokens();
  const dispatch = useDispatch<Dispatch>();
  const logos = tokens ? getStrategyTokenLogos(value, tokens) : []; //TODO
  // const { resetPools } = usePools(value.pools.map((p) => p.token0.symbol));
  const currentPool = value.pools.find((p) => p.id === value.currentPool);
  const tokenAddress = currentPool?.token0.ledger;
  const token = tokens.length
    ? tokens.find((t) => t.ledger === tokenAddress)!
    : undefined;
  const { balances, refetchBalanceByCanister } = useBalances();
  const tokenBalance = token ? balances[token.ledger] : undefined;
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [isUpdatingData, setIsUpdatingData] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (token && !tokenBalance) refetchBalanceByCanister(token);
  }, [token, refetchBalanceByCanister, tokenBalance]);

  const { deposit, isDepositing } = useDeposit();
  const { withdraw, isWithdrawing } = useWithdraw();

  // Вычисляем доступную сумму для вывода на основе депозита пользователя
  const amountToWithdraw = user && value.getUserInitialDeposit 
    ? value.getUserInitialDeposit(user.principal).toString()
    : "0";

  // Логируем для отладки
  console.log("amountToWithdraw calculation:", {
    user: user?.principal.toString(),
    getUserInitialDeposit: value.getUserInitialDeposit,
    result: amountToWithdraw
  });

  const [period, setPeriod] = useState<"24h" | "1w" | "1m">("24h");

  // Цвет для графика APY
  const chartColor = "#a855f7"; // Purple for APY

  // Простой запрос данных один раз
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);



  // Загружаем данные один раз при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingChart(true);
        const strategyChartData = await strategyHistoryService.getStrategyChartData(
          [value.id],
          period
        );
        
        if (strategyChartData.length > 0) {
          setChartData(strategyChartData[0].data);
        }
              } catch {
          // Просто логируем ошибку, не устанавливаем состояние
        } finally {
        setIsLoadingChart(false);
      }
    };

    loadData();
  }, [period]); // Перезагружаем при изменении периода

  const chartSeries = [
    {
      name: "",
      data: chartData,
      color: chartColor,
    },
  ];

  // New Details Card with Tabs
  const [detailsTab, setDetailsTab] = useState<"tokens" | "providers">(
    "tokens"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 gap-y-[25px] max-w-[1400px] mx-auto"
    >
      {/* Back button row */}
      <div>
        <button
          onClick={() => {
            onBack();
          }}
          className={`transition-colors text-[20px] ml-[20px] font-mono shadow-lg
            ${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-gray-600 hover:text-gray-800'}
          `}
        >
          ← Back
        </button>
      </div>

      {/* Strategy name and logo row */}
      <div className="flex items-center gap-4">
        <TokensLogos logos={logos} size={48} />
        <div>
          <h1 className="text-2xl font-bold">{value.name}</h1>
          <p className="text-gray-600">{value.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-3">
        {/* TVL Chart */}
        <Card className="overflow-hidden">
          <div className="flex flex-row items-center justify-between px-4 pt-2 pb-0 mb-0">
                          <div className="text-lg font-mono">
                APY Change
              </div>
            <div className="flex gap-4">
              {(["24h", "1w", "1m"] as const).map((p) => (
                <Button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="!h-[24px] !min-w-[40px] !px-2 text-xs"
                  bg={
                    theme === 'dark'
                      ? (period === p ? '#a78bfa' : '#232136')
                      : (period === p ? '#fbbf24' : '#fef3c7')
                  }
                  textColor={theme === 'dark' ? '#22ff88' : undefined}
                  shadowColor={theme === 'dark' ? '#a78bfa' : undefined}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
          {isLoadingChart && !isUpdatingData && chartData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500">No chart data available</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            <>

              <LineChart
                period={period}
                series={chartSeries}
                key={`${value.id}-${period}`}
              />
            </>
          )}
        </Card>
        {/* Right column - Deposit/Withdraw */}
        <div className="grid grid-cols-1 gap-8">
          {/* User Balance Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name={Icons.moneyWithWings} className="text-green-400" size="md" />
              Your Position
              {isUpdatingData && (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span className="text-sm text-gray-500">Updating...</span>
                </div>
              )}
            </h3>
            {user && tokenBalance ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">Available to Deposit</p>
                    <div className="flex items-center gap-2">
                      <TokensLogos logos={[token?.logo?.[0] ?? ""]} size={24} />
                      {isUpdatingData ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                          <span className="text-gray-500">Updating...</span>
                        </div>
                      ) : (
                        <p className="text-lg font-medium">
                          {tokenBalance?.balance ?? "0"} {token?.symbol}
                          <span className="text-gray-500 text-sm ml-2">
                            {isUpdatingData ? (
                              <span className="text-gray-400">Updating...</span>
                            ) : (
                              `($${tokenBalance?.usdBalance ?? "0"})`
                            )}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">Your Deposit</p>
                    <div className="flex items-center gap-2">
                      <TokensLogos logos={[logos[0]]} size={24} />
                      {isUpdatingData ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                          <span className="text-gray-500">Updating...</span>
                        </div>
                      ) : (
                        <p className="text-lg font-medium">
                          {value.getUserInitialDeposit(user!.principal)}
                          
                          {/* ${balance?.usd_balance.toFixed(2) ?? "0.00"} */}
                          {/* "0.00" */}
                        </p>
                      )}
                    </div>
                  </div>


                </div>
                {/* Deposit/Withdraw Buttons */}
                <div>
                  <div className="flex flex-col gap-6 md:items-end md:content-center">
                    <Deposit
                      className="md:w-[150px]"
                      loading={isDepositing || isUpdatingData}
                      isOpen={depositOpen}
                      onClose={() => {
                        setDepositOpen(false);
                      }}
                      onClick={() => {
                        setDepositOpen(true);
                      }}
                      onDeposit={async (amount) => {
                        try {
                          setIsUpdatingData(true);
                          
                          await deposit({
                            amount: BigInt(
                              BigNumber(amount)
                                .multipliedBy(Math.pow(10, token!.decimals))
                                .toString()
                            ),
                            strategyId: value.id,
                            ledger: tokenAddress as string,
                            principal: user!.principal,
                            agent: agent!,
                          });
                          
                          // Обновляем данные после успешного депозита
                          dispatch(refreshUserBalance({ user: user!.principal, strategyId: value.id }));
                          
                          // Обновляем события стратегии
                          dispatch(refreshStrategyEvents(value.id));
                          
                          // Сбрасываем состояние обновления через небольшую задержку
                          setTimeout(() => {
                            setIsUpdatingData(false);
                          }, 1000);
                        } catch (e: unknown) {
                          setIsUpdatingData(false);
                          if (e instanceof Error) {
                            alert(e.message);
                          } else {
                            alert('An unknown error occurred');
                          }
                        }
                      }}
                      balance={tokenBalance?.balance ?? "0"}
                      tokenSymbol={token?.symbol ?? ""}
                    />
                    <Withdraw
                      className="md:w-[150px]"
                      isOpen={withdrawOpen}
                      onClose={() => {
                        setWithdrawOpen(false);
                      }}
                      onClick={() => {
                        setWithdrawOpen(true);
                      }}
                      onWithdraw={async (percent) => {
                        try {
                          setIsUpdatingData(true);
                          
                          await withdraw({
                            amount: BigInt(percent),
                            strategyId: value.id,
                            ledger: tokenAddress as string,
                            principal: user!.principal,
                            agent: agent!,
                          });
                          
                          // Обновляем данные после успешного вывода
                          dispatch(refreshUserBalance({ user: user!.principal, strategyId: value.id }));
                          
                          // Обновляем события стратегии
                          dispatch(refreshStrategyEvents(value.id));
                          
                          // Сбрасываем состояние обновления через небольшую задержку
                          setTimeout(() => {
                            setIsUpdatingData(false);
                          }, 1000);
                        } catch (e: unknown) {
                          setIsUpdatingData(false);
                          if (e instanceof Error) {
                            alert(e.message);
                          } else {
                            alert('An unknown error occurred');
                          }
                        }
                      }}
                      available={amountToWithdraw}
                      tokenSymbol={token?.symbol ?? ""}
                      loading={isWithdrawing || isUpdatingData}
                      disabled={Number(amountToWithdraw) === 0}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 justify-center items-center py-8">
                <p className="text-gray-600 mb-4">
                  Connect your wallet to deposit
                </p>
                <ConnectWallet />
              </div>
            )}
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-3">
        {/* Combined Stats Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Icon name={Icons.chartLine} className="mr-2 text-green-400" size="md" />
            Strategy Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600">Users in Pool</p>
              <p className="text-lg font-medium">{value.userShares.length}</p>
            </div>
            <div>
              <p className="text-gray-600">APY</p>
              <p className="text-lg font-medium">
                {Number(value.apy).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600">USD APY</p>
              <p className="text-lg font-medium">
                {Number(value.usd_apy).toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Pools Table */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 px-6 pt-6 flex items-center">
            <Icon name={Icons.chartNetwork} className="mr-2 text-green-400" size="md" />
            Pools
          </h3>
          <div className="overflow-x-auto pb-6">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 text-gray-600 font-medium"></th>
                  <th className="text-left py-2 text-gray-600 font-medium">
                    Pair
                  </th>
                  <th className="text-left py-2 text-gray-600 font-medium">
                    Provider
                  </th>
                  <th className="text-left py-2 text-gray-600 font-medium">
                    TVL
                  </th>
                  <th className="text-left py-2 text-gray-600 font-medium">
                    APY
                  </th>
                </tr>
              </thead>
              <tbody>
                {value.pools.map((p, i) => (
                  <tr
                    key={i}
                    className={clsx(
                      "border-t",
                      {
                        "bg-amber-300": p.isActive && theme !== 'dark',
                        "bg-[#232136] border-purple-600/40": theme === 'dark',
                        "bg-[#393552] border-purple-400": theme === 'dark' && p.isActive,
                        "border-amber-600/10": theme !== 'dark',
                      }
                    )}
                  >
                    <td
                      className={clsx("py-4", { ["rounded-l-lg"]: p.isActive })}
                    >
                      <TokensLogos
                        size={30}
                        logos={[getTokenLogo(p.token0.symbol, tokens), getTokenLogo(p.token1.symbol, tokens)]}
                      />
                    </td>
                    <td className="py-4">
                      <span className="font-medium">
                        {p.token0.symbol}/{p.token1.symbol}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="font-medium">{(p).provider}</span>
                    </td>
                    <td className="py-4">${Number(p.tvl).toLocaleString()}</td>
                    <td
                      className={clsx("py-4 font-medium", {
                        ["rounded-r-lg"]: p.isActive,
                      })}
                    >
                      {Number(p.apy).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(300px,_1fr)_2fr] gap-8">
        {/* New Details Card with Tabs */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Icon name={Icons.viewblocks} className="mr-2 text-green-400" size="md" />
            Details
          </h3>
          <Tabs
            tabs={[
              { id: "tokens", label: "Tokens", icon: <Icon name={Icons.boxUsd} className="text-green-400" size="sm" /> },
              { id: "providers", label: "Providers", icon: <Icon name={Icons.bank} className="text-green-400" size="sm" /> },
            ]}
            activeTab={detailsTab}
            onTabChange={(tabId) =>
              setDetailsTab(tabId as "tokens" | "providers")
            }
            className="mb-6"
          />
          {detailsTab === "tokens" && (
            <div className="flex flex-col md:flex-row gap-6">
              {logos.slice(0, 2).map((logo, idx) => {
                const token =  idx === 0 ? currentPool?.token0 : currentPool?.token1;
                const price = idx === 0 ? currentPool?.price0 : currentPool?.price1;
                const tokenSymbol = token?.symbol;
                const tokenObj = tokens.find((t) => t.symbol === tokenSymbol);
                return (
                  <div
                    key={tokenSymbol}
                    className={clsx(
                      "flex items-center gap-4 p-4 rounded-lg shadow",
                      theme === 'dark' ? 'bg-[#232136] border-2 border-purple-600 text-green-400' : 'bg-white/40'
                    )}
                  >
                    <TokensLogos logos={[logo]} size={40} />
                    <div>
                      <div className="font-bold text-lg">{tokenSymbol}</div>
                      <div className={clsx("text-sm", theme === 'dark' ? 'text-green-300' : 'text-gray-600')}>
                        {tokenObj?.name ?? ""}
                      </div>
                      <div className={clsx("text-base mt-1", theme === 'dark' ? 'text-green-400' : 'text-black')}>
                        { price ? `$${price.toFixed(2)}` : "N/A"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {detailsTab === "providers" && (
            <div className="flex flex-col gap-6">
              {Array.from(
                new Set(value.pools.map((p) => p.provider).filter(Boolean))
              ).map((provider) => (
                <div
                  key={provider.toString()}
                  className={clsx(
                    "flex items-center gap-4 p-4 rounded-lg shadow",
                    theme === 'dark' ? 'bg-[#232136] border-2 border-purple-600 text-green-400' : 'bg-white/40'
                  )}
                >
                  <span
                    className={clsx(
                      "flex items-center justify-center rounded-full w-10 h-10 text-2xl",
                      theme === 'dark' ? 'bg-purple-600 text-green-400' : 'bg-gray-300'
                    )}
                  >
                    <Icon name={Icons.bank} className="text-green-400" size="lg" />
                  </span>
                  <div>
                    <div className="font-bold text-lg">
                      <a
                        href="https://www.kongswap.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={theme === 'dark' ? 'text-green-400 hover:underline' : 'text-blue-700 hover:underline'}
                      >
                        {provider.toString()}
                      </a>
                    </div>
                    <div className={clsx("text-sm mb-2", theme === 'dark' ? 'text-green-300' : 'text-gray-600')}>
                      {provider.toString() === "KongSwap"
                        ? "KongSwap is a decentralized AMM on ICP."
                        : provider.toString() === "ICPSwap"
                        ? "IcpSwap is a leading DEX on ICP."
                        : "No description."}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <PaymentsCard isUpdating={isUpdatingData} />
      </div>
    </motion.div>
  );
}
