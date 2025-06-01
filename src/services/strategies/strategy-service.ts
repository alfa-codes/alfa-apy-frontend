/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  _SERVICE as VaultType,
  StrategyResponse,
  UserStrategyResponse,
} from "../../idl/vault.ts";
import { idlFactory } from "../../idl/vault_idl.ts";
import { Principal } from "@dfinity/principal";
import { getAnonActor } from "../utils.ts";

export const alfaACanister = "hx54w-raaaa-aaaaa-qafla-cai";

export class StrategiesService {
  public static async get_strategies(): Promise<Array<StrategyResponse>> {
    const anonymousActor = await getAnonActor<VaultType>(
      alfaACanister,
      idlFactory
    );
    return await anonymousActor.get_strategies();
  }

  public async get_user_strategies(
    user: Principal
  ): Promise<Array<UserStrategyResponse>> {
    const anonymousActor = await getAnonActor<VaultType>(
      alfaACanister,
      idlFactory
    );
    return anonymousActor.user_strategies(user);
  }
  
}

export const strategiesService = new StrategiesService();
