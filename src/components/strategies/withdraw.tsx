import { Popup } from "pixel-retroui";
import { Button, Icon, Icons } from "../ui";
import { useState, useEffect } from "react";
import SquareLoader from "react-spinners/ClimbingBoxLoader";
import colors from "tailwindcss/colors";
import { useTheme } from "../../contexts/ThemeContext";
import { clsx } from "clsx";

const WITHDRAW_STEPS = [
  "Securely transferring your liquidity from provider",
  "Finding the most favorable swap rates for you",
  "Converting your position to base tokens",
  "Processing your withdrawal request",
  "Updating your account with latest data",
  "Verifying withdrawal security",
  "Withdrawal almost completed! Transfer your funds to your wallet"
];

export function Withdraw({
  className,
  isOpen,
  onClose,
  onWithdraw,
  onClick,
  available,
  tokenSymbol,
  loading,
  disabled,
}: {
  className?: string;
  isOpen?: boolean;
  onClose: () => unknown;
  onWithdraw: (value: number) => unknown;
  onClick: () => unknown;
  available: string;
  tokenSymbol: string;
  loading?: boolean;
  disabled?: boolean;
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
    if (isProcessing && currentStep < WITHDRAW_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [isProcessing, currentStep]);

  const handleWithdraw = async (value: string) => {
    try {
      setIsProcessing(true);
      setCurrentStep(0);
      await onWithdraw(Number(value));
      setCurrentStep(WITHDRAW_STEPS.length - 1); // Показываем последний шаг
      setShowSuccess(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setInputError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputError("");
    const newValue = e.target.value.replace('%', '');
    if (!newValue) {
      setInputError("Required");
    } else if (Number(newValue) > 100) {
      setInputError("Cannot withdraw more than 100%");
    } else if (Number(newValue) <= 0) {
      setInputError("Must be greater than 0");
    }
    setValue(newValue);
  };

  if (isProcessing) {
    return (
      <Popup isOpen={!!isOpen} onClose={() => {}} className={`modal ${theme === 'dark' ? 'bg-[#232136] text-green-400 border-2 border-purple-600' : ''}`}>
        <div className="flex flex-col items-center justify-center py-12">
          <SquareLoader
            className="mx-auto mb-6"
            color={colors.amber[500]}
            loading={true}
            size={20}
          />
          <h2 className="text-[20px] font-bold mb-4 flex items-center justify-center">
            <Icon name={Icons.moneyWithWings} className="mr-2 text-green-400" size="lg" />
            Processing Your Withdrawal
          </h2>
          <p className="text-gray-600 text-center mb-6">
            We're carefully processing your {value}% withdrawal to ensure the best rates!
          </p>
          <div className="text-center">
            <p className={clsx(
              "text-sm font-medium transition-all duration-500",
              theme === 'dark' ? 'text-green-400' : 'text-blue-600'
            )}>
              {WITHDRAW_STEPS[currentStep]}
            </p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-2">
                {WITHDRAW_STEPS.map((_, index) => (
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
      <Button 
        onClick={disabled ? undefined : onClick} 
        className={clsx(className, disabled && "opacity-60 cursor-not-allowed bg-purple-300 text-gray-600")} 
        bg={!disabled && theme === 'dark' ? '#a78bfa' : undefined} 
        textColor={!disabled && theme === 'dark' ? '#22ff88' : undefined} 
        disabled={disabled}
      >
        <Icon name={Icons.moneyWithWings} className="mr-2 text-green-400" size="md" />
        Withdraw
      </Button>
      <Popup
        isOpen={!!isOpen}
        onClose={() => {
          onClose();
          setValue("");
          setInputError("");
          setShowSuccess(false);
        }}
        className={`modal ${theme === 'dark' ? 'bg-[#232136] text-green-400 border-2 border-purple-600' : ''}`}
      >
        {!showSuccess ? (
          <>
            <h2 className="text-[18px] sm:text-[20px] mb-[10px]">
              Withdraw {tokenSymbol}
            </h2>
            <p className="mb-[35px] sm:mb-[45px]">
              Available to withdraw: {available} {tokenSymbol}
            </p>
            <p className="mb-4 text-sm text-gray-500">
              You can withdraw up to 100% of your position
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value || "0"}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
                {value && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Withdrawing: {((Number(value) / 100) * Number(available)).toFixed(6)} {tokenSymbol}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row">
                <div className="flex flex-col flex-1">
                  <div className="relative">
                    <input
                      value={value ? `${value}%` : ""}
                      onChange={handleInputChange}
                      className="flex-1 pr-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      type="text"
                      placeholder="Enter percentage"
                    />
                  </div>
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
                  onClick={() => handleWithdraw(value)}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Icon name={Icons.checkCircle} className="text-6xl mb-6 text-green-400" size="xl" />
            <h2 className="text-[24px] font-bold mb-4">Withdrawal Successful!</h2>
            <p className="text-gray-600 mb-8 flex items-center justify-center">
              <Icon name={Icons.moneyWithWings} className="mr-2 text-green-400" size="md" />
              Your {value}% withdrawal has been processed successfully!
            </p>
            <Button
              className="w-full max-w-[200px] mx-auto"
              onClick={() => {
                onClose();
                setShowSuccess(false);
                setValue("");
              }}
            >
              <Icon name={Icons.check} className="mr-2" size="sm" />
              Perfect!
            </Button>
          </div>
        )}
      </Popup>
    </>
  );
}
