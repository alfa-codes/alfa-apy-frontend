import colors from "tailwindcss/colors";
import SquareLoader from "react-spinners/ClimbingBoxLoader";
import { Button, Card, Input, Icon, Icons } from "../ui";
import { useTokens } from "../../hooks";
import { useState } from "react";
import { Strategy } from "./strategy";
import { TokensLogos } from "./tokens-logos";
import { getStrategyTokenLogos, getProfitLevel } from "./utils";
import { motion } from "framer-motion";
import { useAuth } from "@nfid/identitykit/react";
import { UserStats } from "../profile";
import { useStrategies } from "../../hooks/strategies";
import { useTheme } from "../../contexts/ThemeContext";
import { useBalances } from "../../hooks/balances";
import { useNavigate } from "react-router-dom";

interface PlatformStats {
  totalTvl: bigint;
  maxApy: number;
  totalStrategies: number;
  deposited: number;
  totalUsers: number;
}

export function Strategies() {
  const { strategies } = useStrategies();
  const { tokens } = useTokens();
  const { balances } = useBalances();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [selectedStrategy, setSelectedStrategy] = useState<number>();
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserStrategies, setShowUserStrategies] = useState(false);
  const navigate = useNavigate();

  // Calculate platform stats
  const platformStats: PlatformStats | undefined = strategies?.reduce(
    (acc, strategy) => {
      const currentPool = strategy.currentPool;
      if (currentPool) {
        console.log("strategy deposited", strategy.initialDeposit);
        return {
          ...acc,
          totalTvl: acc.totalTvl + strategy.tvl,
          maxApy: Math.max(acc.maxApy, strategy.apy),
          deposited: acc.deposited + strategy.initialDeposit.reduce(
            (acc, [, value]) =>
              acc + Number(value) / 10 ** strategy.pools[0].token0.decimals * (strategy.pools[0].price0 ?? 0),
            0
          ),
          totalUsers: acc.totalUsers + strategy.userShares.length,
        };
      }
      
      return acc;
    },
    {
      totalTvl: 0n,
      maxApy: 0,
      totalStrategies: strategies?.length || 0,
      deposited: 0,
      totalUsers: 0,
    }
  );
  
  if (!strategies || !tokens.length) {
    return (
      <SquareLoader
        className="mx-auto"
        color={colors.amber[500]}
        loading={true}
        size={20}
      />
    );
  }

  if (selectedStrategy) {
    const strategy = strategies.find((s) => s.id === selectedStrategy)!;

    console.log("b", balances?.[strategy.id]);

    return (
      <Strategy
        value={strategy}
        onBack={() => setSelectedStrategy(undefined)}
      />
    );
  }

  const filteredStrategies = strategies?.filter(strategy => 
    strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.pools[0].token0.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.pools[0].token1.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserStrategies = showUserStrategies 
    ? strategies?.filter(strategy => 
        strategy.userShares.some(([principal]) => principal.toString() === user?.principal.toString())
      )
    : filteredStrategies;

  return (
    <motion.div
      key="3"
      className="grid gap-y-[35px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {user && (
        <>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>
            <Icon name={Icons.user} className="text-green-400" size="md" />
            Your Stats
          </h3>
          <UserStats />
        </>
      )}
      <>
        <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>
          <Icon name={Icons.chartLine} className="text-green-400" size="md" />
          Platform Stats
        </h3>
        <Card className="p-[20px]" light={!!user}>
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h3 className={`text-sm flex items-center justify-center gap-1 ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'}`}>
                <Icon name={Icons.boxUsd} size="sm" />
                DEPOSITED
              </h3>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>
                ${(platformStats?.deposited ?? 0 / 10 ** 8).toFixed(2) ?? "0"}
              </p>
            </div>
            <div className="text-center flex-1">
              <h3 className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'}`}>TOTAL USERS</h3>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>
                {platformStats?.totalUsers.toLocaleString() ?? "0"}
              </p>
            </div>
            <div className="text-center flex-1">
              <h3 className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'}`}>HIGHEST APY</h3>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>
                {Number(platformStats?.maxApy ?? 0).toFixed(2)}%
              </p>
            </div>
            <div className="text-center flex-1">
              <h3 className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'}`}>STRATEGIES</h3>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>
                {platformStats?.totalStrategies ?? 0}
              </p>
            </div>
          </div>
        </Card>
      </>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Platform Stats */}

        {/* TVL Chart */}
        {/* <Card className="overflow-hidden mb-[50px]">
          <div className="flex flex-row items-center justify-between px-4 pt-2 pb-0 mb-0">
            <div className="text-2xl font-mono">APR Change</div>
            <div className="flex gap-2">
              {(["24h", "1m", "1y", "all"] as const).map((p) => (
                <Button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="!h-[24px] !min-w-[40px] !px-2 text-xs"
                  bg={period === p ? "#fbbf24" : "#fef3c7"}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
          <LineChart
            period={period}
            series={[
              { name: "IcpSwap", data: icpSwap, color: "#a855f7" },
              { name: "KongSwap", data: kongSwap, color: "#22c55e" },
            ]}
          />
        </Card> */}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col items-center md:items-end md:flex-row justify-between justify-end md:justify-between mb-[10px]">
        <div className="flex items-center mb-[20px] md:mb-0 gap-4">
          {(user ? ["All", "My strategies"] : ([] as const)).map((p) => (
            <Button
              key={p}
              onClick={() => {
                setShowUserStrategies(p === "My strategies");
              }}
              className="!h-[24px] !min-w-[40px] !px-2 text-xs"
              bg={
                theme === 'dark'
                  ? (p === "My strategies" 
                      ? (showUserStrategies ? colors.purple[600] : colors.gray[700]) 
                      : (showUserStrategies ? colors.gray[700] : colors.purple[600]))
                  : (p === "My strategies" 
                      ? (showUserStrategies ? "#fbbf24" : "#fef3c7") 
                      : (showUserStrategies ? "#fef3c7" : "#fbbf24"))
              }
            >
              {p}
            </Button>
          ))}
        </div>
        <Input
          type="text"
          placeholder="Search by name or token..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md h-[35px] text-[14px]"
        />
      </div>

      {/* Strategies List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[35px] gap-8">
        {(showUserStrategies
          ? filteredUserStrategies
          : filteredStrategies
        )?.map((s) => {
          const logos = getStrategyTokenLogos(s, tokens);
          const currentPool = s.currentPool;
          const isDisabled = !currentPool;

          return (
            <Card
              key={s.id}
              className="p-[20px] relative hover:shadow-lg transition-shadow duration-200"
              bg={theme === 'dark' ? '#181825' : colors.amber[200]}
              shadowColor={theme === 'dark' ? '#a78bfa' : colors.amber[600]}
              style={theme === 'dark' ? { border: '2px solid #a78bfa' } : {}}
            >
              {/* First row - Logo, Name, Description, TVL */}
              <div className="flex items-start gap-6">
                <div className="w-[100px]">
                  <TokensLogos logos={logos} />
                </div>
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[20px] font-semibold">
                      {s.name}
                    </h3>
                    <span
                      className={
                        "px-2 py-0.5 rounded text-sm " +
                        getProfitLevel(s)
                      }
                    >
                      {getProfitLevel(s).toUpperCase()}
                    </span>
                  </div>
                  <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'}`}>
                    {s.description || "Earn rewards by providing liquidity"}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'}`}>TVL</p>
                  <p className={`text-lg font-medium ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>${s.initialDeposit.reduce((acc, [, value]) => acc + Number(value) / 10 ** s.pools[0].token0.decimals * (s.pools[0].price0 ?? 0), 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Second row - APY and Button */}
              <div className={`flex justify-center items-center gap-20 mt-6 pt-6 border-t ${theme === 'dark' ? 'border-purple-600/20' : 'border-amber-600/20'}`}>
                <div className="flex items-baseline gap-2">
                  <span className="gradient-text text-[30px] font-bold">
                    {Number(s.apy).toFixed(2)}%
                  </span>
                  <span className={`${theme === 'dark' ? 'text-green-300' : 'text-gray-600'}`}>APY</span>
                </div>

                <Button
                  className="w-[120px] h-[36px] text-sm"
                  onClick={() => {
                    if (!isDisabled) {
                      setSelectedStrategy(s.id);
                      navigate(`/strategies/${s.id}`);
                    }
                  }}
                  disabled={isDisabled}
                >
                  {isDisabled ? "Soon..." : "Jump into!"}
                </Button>
              </div>

              {/* Third row - Additional info */}
              <div
                className={
                  (user
                    ? "grid grid-cols-2 md:grid-cols-4"
                    : "grid grid-cols-2") +
                  ` gap-x-8 mt-6 pt-6 border-t ${theme === 'dark' ? 'border-purple-600/20' : 'border-amber-600/20'} text-sm justify-items-stretch text-center`
                }
              >
                <div>
                  <span className={`block ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'}`}>Platform:</span>
                  <p className={`font-medium ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>
                    {/* TODO: Fix this */}
                    {Array.from(["KongSwap", "IcpSwap"]).join(", ")}
                  </p>
                </div>
                <div>
                  {/* TODO: Fix this */}
                  <span className={`block ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'}`}>Deposit Token:</span>
                  <p className={`font-medium ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>{s.pools[0]?.token0.symbol}</p>
                </div>
                {user && (
                  <>
                    <div>
                      <span className={`block ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'}`}>Deposited:</span>
                      <p className={`font-medium ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>
                        ${s.initialDeposit.filter(([principal]) => principal.toString() === user?.principal.toString()).reduce((acc, [, value]) => acc + Number(value) / 10 ** s.pools[0].token0.decimals * (s.pools[0].price0 ?? 0), 0).toFixed(2)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}