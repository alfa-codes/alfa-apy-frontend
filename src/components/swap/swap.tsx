import { useAuth } from "@nfid/identitykit/react";
import { Button } from "../ui";
import { Input } from "./input";
import clsx from "clsx";
import { useBalances, useSwap, useSwapSlippage, useTokens } from "../../hooks";
import { SlippageModal } from "./slippage";
import { useEffect, useRef, useState } from "react";
import SquareLoader from "react-spinners/ClimbingBoxLoader";
import colors from "tailwindcss/colors";
import debounce from "lodash.debounce";

export function Swap({ className }: { className?: string }) {
  const { user } = useAuth();
  const { tokens, loading } = useTokens();
  const { balances, refetchBalanceByCanister } = useBalances();
  const [slippageModalOpened, setSlippageModalOpened] = useState(false);
  const [fromToken, setFromToken] = useState<string>(
    "ryjl3-tyaaa-aaaaa-aaaba-cai"
  );
  const [toToken, setToToken] = useState<string>("etik7-oiaaa-aaaar-qagia-cai");
  const [amount, setAmount] = useState("");
  const throttledSetAmount = useRef(
    debounce((value: string) => {
      setAmount(value); // Throttled update
    }, 1000)
  ).current;

  useEffect(() => {
    return () => throttledSetAmount.cancel(); // Cleanup to prevent memory leaks
  }, []);

  const { setSlippage, slippage } = useSwapSlippage();
  const { isQuoteLoading, liquidityError, swap, quote, quoteTimer } = useSwap({
    fromToken,
    toToken,
    amount,
    slippage,
    onSuccess: () => {
      refetchBalanceByCanister(tokens.find((t) => t.ledger === fromToken)!);
      refetchBalanceByCanister(tokens.find((t) => t.ledger === toToken)!);
    },
  });

  useEffect(() => {
    if (tokens.length) {
      refetchBalanceByCanister(tokens.find((t) => t.ledger === fromToken)!);
    }
  }, [fromToken, tokens, refetchBalanceByCanister]);

  useEffect(() => {
    if (tokens.length) {
      refetchBalanceByCanister(tokens.find((t) => t.ledger === toToken)!);
    }
  }, [toToken, tokens, refetchBalanceByCanister]);

  if (loading || !tokens.length)
    return (
      <SquareLoader
        className="mx-auto"
        color={colors.amber[500]}
        loading={true}
        size={20}
      />
    );

  const dropdownOptions = tokens.map((el) => ({
    icon: el.logo[0] || "",
    label: el.symbol,
    value: el.ledger,
  }));

  const fromBalance = balances[fromToken];
  console.log("fromBalance", fromBalance);
  const toBalance = balances[toToken];
  console.log("toBalance", toBalance);

  const targetAmount = quote?.getTargetAmountPrettifiedWithSymbol();
  console.log("targetAmount", targetAmount);
  const sourceUsdAmount = quote?.getSourceAmountUSD();
  const targetUsdAmount = quote?.getTargetAmountUSD();

  return (
    <>
      <div className={clsx("flex flex-col", className)}>
        <div className="mb-[5px] flex justify-end text-[25px] mb-[10px]">
          <div
            className="cursor-pointer"
            onClick={() => setSlippageModalOpened(true)}
          >
            ⚙️
          </div>
        </div>
        <Input
          tokens={dropdownOptions}
          token={dropdownOptions.find((o) => o.value === fromToken)!}
          className="flex justify-center"
          balance={fromBalance?.balance ?? "0.00"}
          usdValue={sourceUsdAmount ?? "0.00"}
          onTokenChange={setFromToken}
          onChange={(e) => {
            throttledSetAmount(e.target.value);
          }}
          disabled={isQuoteLoading}
        />
        {liquidityError && (
          <div className="h-4 mt-[10px] text-xs leading-4 text-red-600">
            {liquidityError?.message}
          </div>
        )}
        <div className="text-[30px] mx-auto my-[10px]">↕️</div>
        <Input
          value={targetAmount ? targetAmount.split(" ")[0] : "0.00"}
          tokens={dropdownOptions}
          token={dropdownOptions.find((o) => o.value === toToken)!}
          disabled
          className="flex justify-center"
          balance={toBalance?.balance ?? "0.00"}
          usdValue={targetUsdAmount ?? "0.00"}
          onTokenChange={setToToken}
        />
        {amount && quote && (
          <div className="flex items-center justify-between mt-6 text-xs text-gray-500">
            {quote?.getQuoteRate()} ({quoteTimer} sec)
          </div>
        )}
        <Button
          onClick={swap}
          className="mt-[30px]"
          disabled={!user || isQuoteLoading || !amount || !quote}
        >
          {user
            ? !amount
              ? "Enter an amount"
              : isQuoteLoading
              ? "Fetching quotes 1 of 2"
              : "Swap tokens"
            : "Connect wallet"}
        </Button>
      </div>
      <SlippageModal
        isOpen={slippageModalOpened}
        onClose={() => setSlippageModalOpened(false)}
        onSlippageChange={(slippage) => setSlippage(parseFloat(slippage))}
      />
    </>
  );
}
