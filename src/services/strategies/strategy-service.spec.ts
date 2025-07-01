import { strategiesService } from "./strategy-service";

describe("Strategy Service", () => {
    jest.setTimeout(100000);
  it("should output hello to console", async () => {
    const strategies = await strategiesService.getStrategies();
    expect(strategies).toBeDefined();
    expect(strategies.length).toEqual(2);
    expect(strategies[0].id).toEqual(4);
    expect(strategies[0].name).toEqual("Panda-ICP Balanced Strategy");
    expect(strategies[0].description).toEqual("Cheap test strategy");
    expect(strategies[0].tvl).toBeGreaterThan(0n);
    expect(strategies[0].apy).toBeGreaterThan(0);
    expect(strategies[0].pools.length).toEqual(2);
    expect(strategies[0].pools[0].id).toEqual("KongSwap_druyg-tyaaa-aaaaq-aactq-cai_ryjl3-tyaaa-aaaaa-aaaba-cai");
    expect(strategies[0].pools[0].provider).toEqual("KongSwap");
    expect(strategies[0].pools[0].token1.ledger).toEqual("ryjl3-tyaaa-aaaaa-aaaba-cai");
    expect(strategies[0].pools[0].token0.ledger).toEqual("druyg-tyaaa-aaaaq-aactq-cai");
    expect(strategies[0].pools[0].price0).toBeDefined();
    expect(strategies[0].pools[0].price1).toBeDefined();
  });

});



