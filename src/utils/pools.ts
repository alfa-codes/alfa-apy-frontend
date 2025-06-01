import { PoolResponse } from "../idl/vault";

export function getPoolId(pool: PoolResponse) {
  return `${pool.provider}-${pool.token0}-${pool.token1}`;
}
