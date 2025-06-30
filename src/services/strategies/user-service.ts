/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrategyDepositResponse, StrategyWithdrawResponse, _SERVICE as VaultType } from "../../idl/vault.ts";
import { ActorSubclass, Agent as DfinityAgent } from "@dfinity/agent";
import { idlFactory } from "../../idl/vault_idl.ts";
import { Principal } from "@dfinity/principal";
import { _SERVICE as ledgerService, ApproveArgs } from "../../idl/ledger.ts";
import { idlFactory as ledger_idl } from "../../idl/ledger_idl.ts";
import { getTypedActor, hasOwnProperty } from "../utils.ts";

export const alfaACanister = "ownab-uaaaa-aaaap-qp2na-cai";
export const poolsDataCanister = "oxawg-7aaaa-aaaag-aub6q-cai";

export class UserService {
  public async withdraw(
    strategy_id: number,
    ledger: string,
    amount: bigint,
    agent: DfinityAgent
  ): Promise<StrategyWithdrawResponse> { 
    const actor = await getTypedActor<VaultType>(
      alfaACanister,
      agent,
      idlFactory
    );

    const result = await actor.withdraw({
      strategy_id,
      ledger: Principal.fromText(ledger),
      percentage: BigInt(amount),
    });

    if (hasOwnProperty(result, "Err")) {
      throw new Error((result.Err as { message: string }).message);
    }

    return result.Ok;
  }

  //todo naming
  public async accept_investment(
    strategy_id: number,
    ledger: string,
    amount: bigint,
    agent: DfinityAgent
  ): Promise<StrategyDepositResponse> {
    const ledgerActor = await getTypedActor<ledgerService>(
      ledger,
      agent,
      ledger_idl
    );
    await checkAndApproveTokens(BigInt(amount), ledgerActor);
    const actor = await getTypedActor<VaultType>(
      alfaACanister,
      agent,
      idlFactory
    );
    const result = await actor.deposit({
      strategy_id,
      ledger: Principal.fromText(ledger),
      amount: BigInt(amount),
    });

    if (hasOwnProperty(result, "Err")) {
      throw new Error((result.Err as { message: string }).message);
    }

    return result.Ok;
  }
}

export const checkAndApproveTokens = async (
  amount: bigint,
  ledgerActor: ActorSubclass<ledgerService>
) => {
  const approveArgs: ApproveArgs = {
    amount: BigInt(10) * amount,
    spender: {
      owner: Principal.fromText(alfaACanister),
      subaccount: [],
    },
    fee: [],
    memo: [],
    from_subaccount: [],
    created_at_time: [],
    expected_allowance: [],
    expires_at: [],
  };

  // Approve tokens
  const approveResponse = await ledgerActor.icrc2_approve(approveArgs);
  console.log("IRC2 approve:", approveResponse);
};

export const userService = new UserService();
