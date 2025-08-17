import { ICRC1 } from "../../../../idl/icrc1_oracle";
import { idlFactory as iCRC1OracleIDL } from "../../../../idl/icrc1_oracle_idl";
import { _SERVICE as ICRC1Oracle } from "../../../../idl/icrc1_oracle";
import { createActor } from "../../../../utils";
import { Principal } from "@dfinity/principal";
import { Icrc1Pair } from "../icrc1-pair/impl/Icrc1-pair";
import { BigNumber } from "bignumber.js";
import { exchangeRateService } from "../../../exchange/exchange-rate";
import { storageWithTtl } from "./storage";
import { hasOwnProperty } from "../../../utils";

export const icrc1OracleActor = createActor<ICRC1Oracle>(
  "zjahs-wyaaa-aaaal-qjuia-cai",
  iCRC1OracleIDL
);

function formatUsdAmount(amount: BigNumber, formatLowAmountToFixed = true) {
  if (formatLowAmountToFixed || amount.gte(0.01))
    return `${amount.toFixed(2)} USD`;
  return `${BigNumber(amount.toExponential(0)).toFixed()} USD`;
}

export class ICRC1OracleService {
  async getICRC1Canisters(): Promise<ICRC1[]> {
    return this.requestNetworkForCanisters();
  }

  async getBalance(principal: Principal, canister: ICRC1) {
    const icrc1Pair = new Icrc1Pair(
      canister.ledger,
      canister.index.length ? canister.index[0] : undefined
    );
    const balance = await icrc1Pair.getBalance(principal.toText());
    const tokenRate = await exchangeRateService.usdPriceForICRC1(
      canister.ledger
    );

    const tokenAmount = exchangeRateService.parseTokenAmount(
      Number(balance),
      canister.decimals
    );
    const usdBalance = tokenRate
      ? tokenAmount.multipliedBy(tokenRate.value)
      : BigNumber(0);

    return {
      balance: tokenAmount.toFormat({
        groupSeparator: "",
        decimalSeparator: ".",
      }),
      usdBalance: formatUsdAmount(usdBalance),
      token: canister,
    };
  }

  async getBalances(
    principal: Principal,
    canisters: ICRC1[]
  ): Promise<
    Array<{ balance: string; usdBalance: string; token: ICRC1 }> | undefined
  > {
    try {
      return Promise.all(
        canisters.map(async (c) => this.getBalance(principal, c))
      );
    } catch (e) {
      console.error("Icrc1Pair error: " + (e as Error).message);
    }
  }

  //TODO add cache
  async requestNetworkForCanisters(): Promise<ICRC1[]> {
    const cacheKey = 'requestNetworkForCanisters';
    const cache = await storageWithTtl.getEvenExpired(cacheKey)
    if (!cache) {
      const response = await this.requestNetworkForCanisters1()
      storageWithTtl.set(
        cacheKey,
        this.serializeCanisters(response),
        60 * 1000,
      )
      return response
    } else if (cache && cache.expired) {
      this.requestNetworkForCanisters1().then((response) => {
        storageWithTtl.set(
          cacheKey,
          this.serializeCanisters(response),
          60 * 1000,
        )
      })
      return this.deserializeCanisters(cache.value as string)
    } else {
      return this.deserializeCanisters(cache.value as string)
    }
  }

  async requestNetworkForCanisters1() {
    return await icrc1OracleActor.count_icrc1_canisters().then((canisters) => {
      return Promise.all(
        Array.from({ length: Math.ceil(Number(canisters) / 25) }, (_, i) =>
          icrc1OracleActor.get_icrc1_paginated((i * 25), (25)),
        ),
      ).then((res) => res.flat())
    })
  }

  serializeCanisters(canister: Array<ICRC1>): string {
    return JSON.stringify(
      canister.map((c) => {
        return {
          name: c.name,
          ledger: c.ledger,
          category: c.category,
          index: c.index,
          symbol: c.symbol,
          logo: c.logo,
          fee: Number(c.fee),
          decimals: c.decimals,
          // root_canister_id: c.root_canister_id,
        }
      }),
    )
  }

  deserializeCanisters(canister: string): Array<ICRC1> {
    return (JSON.parse(canister) as Array<any>).map((c) => {
      return {
        name: c.name,
        ledger: c.ledger,
        category: c.category,
        index: c.index,
        symbol: c.symbol,
        logo: c.logo,
        fee: BigInt(c.fee),
        decimals: c.decimals,
        root_canister_id: c.root_canister_id,
        date_added: c.date_added,
      }
    }).filter((c) => !hasOwnProperty(c.category, "Spam"))
  }



}




export const icrc1OracleService = new ICRC1OracleService();
