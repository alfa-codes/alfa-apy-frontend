/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ConnectWalletDropdownMenu,
  ConnectWalletDropdownMenuAddressItem,
  ConnectWalletDropdownMenuButton,
  ConnectWalletDropdownMenuDisconnectItem,
  ConnectWalletDropdownMenuItem,
  ConnectWalletDropdownMenuItems,
} from "@nfid/identitykit/react";
import { ConnectedButton } from "./connected-button";
import { ConnectButton } from "./connect-button";
import { Card, Icon, Icons } from "../ui";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTokens, useBalances } from "../../hooks";
import { Input } from "../swap/input";
import { Button } from "../ui";
import { useAgent, useAuth } from "@nfid/identitykit/react";
import { icrc1Transfer } from "../../services/strategies/user-service";

export function DropdownMenu({
  connectedAccount,
  icpBalance,
  disconnect,
}: any) {
  const navigate = useNavigate();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [fromToken, setFromToken] = useState<string>("ryjl3-tyaaa-aaaaa-aaaba-cai");
  const [amount, setAmount] = useState("");
  const [toPrincipal, setToPrincipal] = useState("");
  const [isTransferLoading, setIsTransferLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { user } = useAuth();
  const agent = useAgent({ host: "https://ic0.app" });
  const { tokens, loading: tokensLoading } = useTokens();
  const { balances } = useBalances();

  const dropdownOptions = tokens.map((el) => ({
    icon: el.logo[0] || "",
    label: el.symbol,
    value: el.ledger,
  }));

  const fromBalance = balances[fromToken];
  const fromTokenData = dropdownOptions.find((o) => o.value === fromToken);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and one dot
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleTransfer = async () => {
    if (!user || !amount || !toPrincipal || !agent) return;

    setIsTransferLoading(true);
    setError("");

    try {
      // Convert amount to BigInt (assuming 8 decimals like ICP)
      const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 100000000));
      
      const blockIndex = await icrc1Transfer(
        toPrincipal,
        fromToken,
        amountBigInt,
        agent
      );

      // Check if transfer was successful (has blockIndex)
      if (blockIndex && typeof blockIndex === 'bigint') {
        setIsSuccessModalOpen(true);
        setIsTransferLoading(false);
        
        // Reset form
        setAmount("");
        setToPrincipal("");
      } else {
        // Transfer failed
        setError("Transfer failed: Invalid response");
        setIsTransferLoading(false);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
      setIsTransferLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setIsTransferModalOpen(false);
  };

  return (
    <>
      <ConnectWalletDropdownMenu className="p-0">
        <ConnectWalletDropdownMenuButton>
          {connectedAccount ? (
            <ConnectedButton
              connectedAccount={connectedAccount}
              icpBalance={icpBalance}
            />
          ) : (
            <ConnectButton />
          )}
        </ConnectWalletDropdownMenuButton>
        <ConnectWalletDropdownMenuItems className="connect-wallet-dropdown !p-0 !rounded-0 !shadow-none !bg-transparent !min-w-[405px] sm:!min-w-[420px]">
          <Card className="py-[5px] px-[10px] text-center connected-wallet-dropdown">
            <ConnectWalletDropdownMenuItem
              onClick={() => navigate("/swap")}
              className="!px-0 !py-[5px]"
            >
              <div className="flex w-full justify-between font-bold">
                <h2>Swap tokens</h2>
                <h2 className="cursor-pointer">
                  <Icon name={Icons.refresh} className="mr-1 text-green-400" size="lg" />
                  Swap
                </h2>
              </div>
            </ConnectWalletDropdownMenuItem>
            <ConnectWalletDropdownMenuItem
              onClick={() => setIsTransferModalOpen(true)}
              className="!px-0 !py-[5px]"
            >
              <div className="flex w-full justify-between font-bold">
                <h2>Transfer tokens</h2>
                <h2 className="cursor-pointer">
                  <Icon name={Icons.moneyWithWings} className="mr-1 text-green-400" size="lg" />
                  Transfer
                </h2>
              </div>
            </ConnectWalletDropdownMenuItem>
            <ConnectWalletDropdownMenuItem
              onClick={() => navigate("/profile")}
              className="!px-0 !py-[5px]"
            >
              <div className="flex w-full justify-between font-bold">
                <h2>Profile</h2>
                <h2 className="cursor-pointer">
                  <Icon name={Icons.user} className="mr-1 text-green-400" size="lg" />
                </h2>
              </div>
            </ConnectWalletDropdownMenuItem>
            <ConnectWalletDropdownMenuAddressItem
              value={connectedAccount}
              className="!px-0 !py-[5px]"
            />
            <ConnectWalletDropdownMenuDisconnectItem
              className="!px-0 !py-[5px]"
              onClick={disconnect}
            />
          </Card>
        </ConnectWalletDropdownMenuItems>
      </ConnectWalletDropdownMenu>

      {/* Enhanced Transfer Modal with Token Selection */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#232136] rounded-lg shadow-xl w-[600px] max-w-[90vw] p-6 border-2 border-purple-600">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-green-400 flex items-center">
                <Icon name={Icons.wallet} className="mr-2 text-green-400" size="lg" />
                Transfer Tokens
              </h2>
                              <button
                  onClick={() => setIsTransferModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-green-400/70 dark:hover:text-green-400 text-xl"
                >
                  ✕
                </button>
            </div>
            
            <div className="space-y-4">
              {/* Token Selection with Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-green-400 mb-2">
                  From Token
                </label>
                {tokensLoading ? (
                  <div className="w-full h-12 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse"></div>
                ) : (
                  <Input
                    tokens={dropdownOptions}
                    token={fromTokenData || dropdownOptions[0]}
                    className="w-full"
                    balance={fromBalance?.balance || "0.00"}
                    usdValue={fromBalance?.usdBalance ? `$${fromBalance.usdBalance}` : "$0.00"}
                    onTokenChange={setFromToken}
                    onChange={handleAmountChange}
                    value={amount}
                    placeholder="Enter amount"
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-green-400 mb-2">
                  To Principal ID
                </label>
                <input
                  type="text"
                  value={toPrincipal}
                  onChange={(e) => setToPrincipal(e.target.value)}
                  placeholder="Enter recipient's Principal ID"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#1a1a2e] dark:text-green-400"
                />
              </div>
              
              <Button
                className="w-full py-2"
                disabled={!amount || !toPrincipal || !user || !agent}
                onClick={handleTransfer}
                bg={!amount || !toPrincipal || !user || !agent ? "#9ca3af" : isTransferLoading ? "#8b5cf6" : "#a78bfa"}
                textColor={!amount || !toPrincipal || !user || !agent ? "#6b7280" : isTransferLoading ? "#ffffff" : "#22ff88"}
              >
                {isTransferLoading ? "Transferring..." : "Transfer"}
              </Button>

              {error && (
                <div className="mt-4 p-3 border border-red-300 dark:border-red-600 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#232136] rounded-lg shadow-xl w-[400px] max-w-[90vw] p-6 border-2 border-green-600">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-green-400 mb-4">
                Transfer Successful!
              </h2>
              <p className="text-gray-600 dark:text-green-400/70 mb-6">
                Your tokens have been transferred successfully.
              </p>
              <Button
                onClick={handleSuccessModalClose}
                className="w-full"
                bg="#10b981"
                textColor="#ffffff"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
