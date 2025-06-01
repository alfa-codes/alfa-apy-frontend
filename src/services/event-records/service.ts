import { Principal } from "@dfinity/principal";

export type EventRecordType = "Rebalance" | "Withdrawal" | "Deposit";

export type EventRecord = {
  id: number;
  amount: string;
  date: string;
  from: string;
  to: string;
  type: EventRecordType;
  token: string;
  userPrincipal?: Principal
  error?: []
  fee?: string
};

export const eventRecordsService = {
  getEventRecords: async (
    filter: {
      user?: string;
      type?: EventRecordType;
      from?: string;
      to?: string;
    } = {}
  ): Promise<Array<EventRecord>> => {
    const mockEventRecords: Array<EventRecord> = [
      {
        id: 1,
        type: "Rebalance",
        amount: "1,000",
        token: "ICP/CHAT",
        date: "2024-06-01",
        from: "IcpSwap pool #1",
        to: "KongSwap pool #2"
      },
      {
        id: 2,
        type: "Withdrawal",
        amount: "500",
        token: "ICP",
        date: "2024-05-28",
        from: "KongSwap pool #2",
        to: "address",
        userPrincipal: Principal.from(""),
      },
      {
        id: 3,
        type: "Deposit",
        amount: "2,000",
        token: "ICP",
        date: "2024-05-20",
        from: "address",
        to: "KongSwap pool #1",
        userPrincipal: Principal.from(""),
      },
    ];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          mockEventRecords.filter((EventRecord) =>
            Object.entries(filter).every(
              ([key, value]) => EventRecord[key as keyof typeof EventRecord] === value
            )
          )
        );
      }, 1500);
    });
  },
};
