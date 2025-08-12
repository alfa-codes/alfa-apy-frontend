import { Popup } from "pixel-retroui";
import { Button, Input } from "../ui";
import { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import SquareLoader from "react-spinners/ClimbingBoxLoader";
import colors from "tailwindcss/colors";
import { useTheme } from "../../contexts/ThemeContext";
import { clsx } from "clsx";

const DEPOSIT_STEPS = [
  "🚀 Transferring your funds to our secure canister",
  "🔍 Finding the most profitable liquidity provider",
  "💎 Executing optimal swap for maximum returns",
  "🌟 Allocating your funds to the best strategy pool",
  "📊 Updating your portfolio with fresh data",
  "🔐 Verifying transaction security",
  "🎉 Deposit almost completed! One more step to go"
];

export function Deposit({
  className,
  isOpen,
  onClose,
  onDeposit,
  onClick,
  balance,
  tokenSymbol,
  loading,
}: {
  className?: string;
  isOpen?: boolean;
  onClose: () => unknown;
  onDeposit: (value: string) => unknown;
  onClick: () => unknown;
  balance: string;
  tokenSymbol: string;
  loading?: boolean;
}) {
  const [value, setValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useTheme();

  // Сброс шага при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Автоматическое переключение шагов каждые 8 секунд
  useEffect(() => {
    if (isProcessing && currentStep < DEPOSIT_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [isProcessing, currentStep]);

  const handleDeposit = async (value: string) => {
    try {
      setIsProcessing(true);
      setCurrentStep(0);
      await onDeposit(value);
      setCurrentStep(DEPOSIT_STEPS.length - 1); // Показываем последний шаг
      setShowSuccess(true);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <Popup isOpen={!!isOpen} onClose={() => {}} className={`modal ${theme === 'dark' ? 'text-green-400 border-2 border-purple-600' : ''}`}>
        <div className="flex flex-col items-center justify-center py-12">
          <SquareLoader
            className="mx-auto mb-6"
            color={colors.amber[500]}
            loading={true}
            size={20}
          />
          <h2 className="text-[20px] font-bold mb-4">🚀 Processing Your Deposit</h2>
          <p className="text-gray-600 text-center mb-6">
            We're working hard to get your {value} {tokenSymbol} earning maximum returns!
          </p>
          <div className="text-center">
            <p className={clsx(
              "text-sm font-medium transition-all duration-500",
              theme === 'dark' ? 'text-green-400' : 'text-blue-600'
            )}>
              {DEPOSIT_STEPS[currentStep]}
            </p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-2">
                {DEPOSIT_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index <= currentStep
                        ? theme === 'dark' ? 'bg-green-400' : 'bg-blue-600'
                        : theme === 'dark' ? 'bg-purple-600/30' : 'bg-gray-300'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Popup>
    );
  }

  return (
    <>
      <Button onClick={onClick} className={className} bg={theme === 'dark' ? '#a78bfa' : undefined} textColor={theme === 'dark' ? '#22ff88' : undefined}>
        <span className="text-[20px] block mr-[5px]">📥</span> Deposit
      </Button>
      <Popup
        isOpen={!!isOpen}
        onClose={() => {
          onClose();
          setValue("");
          setInputError("");
          setShowSuccess(false);
        }}
        className={`modal ${theme === 'dark' ? 'text-green-400 border-2 border-purple-600' : ''}`}
      >
        {!showSuccess ? (
          <>
            <h2 className="text-[18px] sm:text-[20px] mb-[10px]">
              Deposit {tokenSymbol}
            </h2>
            <p className="mb-[35px] sm:mb-[45px]">
              Available balance: {balance} {tokenSymbol}
            </p>
            <div className="flex flex-col sm:flex-row">
              <div className="flex flex-col flex-1">
                <Input
                  value={value}
                  onChange={(e) => {
                    setInputError("");
                    const value = e.target.value;
                    if (!value) {
                      setInputError("Required");
                    } else if (BigNumber(value).gt(balance)) {
                      setInputError("Not enough balance");
                    }
                    setValue(e.target.value);
                  }}
                  className="flex-1 [appearance:none] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  min={0}
                />
                {inputError && (
                  <span className="h-4 mt-[10px] text-xs leading-4 text-red-600">
                    {inputError}
                  </span>
                )}
              </div>
              <Button
                disabled={!!inputError || !value}
                loading={loading}
                className="sm:ml-[20px] sm:h-[40px] w-full sm:w-auto sm:h-[42px] mt-[25px] sm:mt-0"
                onClick={() => handleDeposit(value)}
              >
                Confirm
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-[24px] font-bold mb-4">Deposit Successful!</h2>
            <p className="text-gray-600 mb-8">
              🚀 Your {value} {tokenSymbol} is now actively earning in our strategy!
            </p>
            <Button
              className="w-full max-w-[200px] mx-auto"
              onClick={() => {
                onClose();
                setShowSuccess(false);
                setValue("");
              }}
            >
              Awesome! 🎯
            </Button>
          </div>
        )}
      </Popup>
    </>
  );
}
