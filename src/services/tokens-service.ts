/* eslint-disable @typescript-eslint/no-explicit-any */
import { idlFactory as iCRC1OracleIDL } from "../idl/icrc1_oracle_idl";
import { _SERVICE as ICRC1Oracle } from "../idl/icrc1_oracle";
import { createActor } from "../utils";

export const icrc1OracleActor = createActor<ICRC1Oracle>(
  "zjahs-wyaaa-aaaal-qjuia-cai",
  iCRC1OracleIDL
);

export interface ICRC1Data {
  logo: string | undefined;
  name: string;
  ledger: string;
  index: string | undefined;
  symbol: string;
  fee: bigint;
  decimals: number;
}

export class TokensService {
  async getAll() {
    return await icrc1OracleActor.count_icrc1_canisters().then((canisters) => {
      return Promise.all(
        Array.from({ length: Math.ceil(Number(canisters) / 25) }, (_, i) =>
          icrc1OracleActor.get_icrc1_paginated(i * 25, 25)
        )
      ).then((res) => res.flat());
    });
  }

  public async get_token_ledger(symbol: string) {
    const allTokens = await this.getAll();
    return allTokens.find((token) => token.symbol === symbol)?.ledger;
  }
}

export const tokensService = new TokensService();
