import { Ed25519KeyIdentity } from "@dfinity/identity";
import { userService } from "./user-service";
import { strategiesService } from "./strategy-service";
import { Principal } from "@dfinity/principal";
import { HttpAgent } from "@dfinity/agent";

const mockIdentity = Ed25519KeyIdentity.fromParsedJson([
  "302a300506032b6570032100f7d983ac3b09181fb7a418edc7328b59b8a15f868a6b30d3352d620dd7bd0aa6",
  "a88ba13f312f84f61280e1b9ea8a0c32b1888bd5634a65c0288cd220d0d44a42",
]);

const mockPrincipal = Principal.fromText(
  "zv5zm-zyhmm-na6rs-2ykmi-binrr-g2l6g-5s2pk-r4fyp-3u6pc-nuls5-oqe"
);

describe("User Service", () => {
  jest.setTimeout(1000000);
  it("should deposit/withdraw", async () => {
    const userStrategies = await strategiesService.getUserStrategies(
      mockPrincipal
    );
    expect(userStrategies.length).toEqual(0);
    const agent = await HttpAgent.create({ host: "https://ic0.app", identity: mockIdentity });

    const result = await userService.accept_investment(4, "druyg-tyaaa-aaaaq-aactq-cai", 400000000n, agent);
    expect(result.shares).toBeGreaterThan(0n);

    const userStrategies2 = await strategiesService.getUserStrategies(
      mockPrincipal
    );
    expect(userStrategies2.length).toEqual(1);

    const withdrawResult = await userService.withdraw(4, "druyg-tyaaa-aaaaq-aactq-cai", 100n, agent);
    expect(withdrawResult.amount).toBeGreaterThan(0n);
    expect(withdrawResult.current_shares).toBe(0n);

    const userStrategies3 = await strategiesService.getUserStrategies(
      mockPrincipal
    );
    expect(userStrategies3.length).toEqual(0);

  });
});
