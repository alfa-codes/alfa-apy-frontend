/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrategyDepositResponse, StrategyWithdrawResponse, _SERVICE as VaultType } from "../../idl/vault.ts";
import { ActorSubclass, Agent as DfinityAgent } from "@dfinity/agent";
import { idlFactory } from "../../idl/vault_idl.ts";
import { Principal } from "@dfinity/principal";
import { _SERVICE as ledgerService, ApproveArgs } from "../../idl/ledger.ts";
import { idlFactory as ledger_idl } from "../../idl/ledger_idl.ts";
import { getTypedActor, hasOwnProperty } from "../utils.ts";
import { icrc1OracleService } from "../token/index.ts";
import { TransferArg } from "../../idl/icrc1.ts";

export const alfaACanister = import.meta.env.VITE_VAULT_CANISTER_ID;
export const poolsDataCanister = import.meta.env.VITE_POOL_STATS_CANISTER_ID;

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

  //todo naming + лишний лэджер параметр
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
    const icrc1 =  await icrc1OracleService.getICRC1Canisters().then((c) => c.find((c) => c.ledger === ledger));
    if (!icrc1) {
      throw new Error("ICRC1 not found");
    }
    const result = await actor.deposit({
      strategy_id,
      ledger: Principal.fromText(ledger),
      amount: BigInt(amount) - icrc1.fee - icrc1.fee,
    });

    if (hasOwnProperty(result, "Err")) {
      throw new Error((result.Err as { message: string }).message);
    }

    return result.Ok;
  }
}

export const icrc1Transfer = async (
  to: string,
  ledger: string,
  amount: bigint,
  agent: DfinityAgent
) => {
  const ledgerActor = await getTypedActor<ledgerService>(
    ledger,
    agent,
    ledger_idl
  );

  const icrc1 =  await icrc1OracleService.getICRC1Canisters().then((c) => c.find((c) => c.ledger === ledger));
  if (!icrc1) {
    throw new Error("ICRC1 not found");
  }

  const transferArgs: TransferArg = {
    from_subaccount: [],
    to: {
      owner: Principal.fromText(to),
      subaccount: [],
    },
    fee: [],
    memo: [],
    amount: amount - icrc1.fee,
    created_at_time: [],

  };
  

  const transferRes = await ledgerActor.icrc1_transfer(transferArgs);

  if (hasOwnProperty(transferRes, "Err")) {
    throw new Error((transferRes.Err as { message: string }).message);
  }

  return transferRes.Ok;
};

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
