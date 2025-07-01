import { getAnonActor } from "../utils";
import { VAULT_CANISTER_ID } from "../../constants";
import {
  GetEventRecordsResult,
  ListItemsPaginationRequest,
  _SERVICE as VaultType,
  EventRecord as EventRecordIdl,
} from "../../idl/vault";
import { idlFactory } from "../../idl/vault_idl";
import { eventToEventRecordType } from "./event-type";

export type EventRecordType = "Rebalance" | "Withdrawal" | "Deposit";

export type EventRecord = {
  id: bigint;
  timestamp: bigint;
  // amount: string;
  // date: string;
  // from: string;
  // to: string;
  type: string;
  // token: string;
  // userPrincipal?: Principal;
  // error?: [];
  // fee?: string;
};

export class EventRecordsService {
  async getEventRecords(
    filter: {
      user?: string;
      type?: EventRecordType;
      from?: string;
      to?: string;
    } = {}
  ): Promise<Array<EventRecord>> {
    const anonymousActor = await getAnonActor<VaultType>(
      VAULT_CANISTER_ID,
      idlFactory
    );
    const request: ListItemsPaginationRequest = {
      page: BigInt(1),
      page_size: BigInt(10),
      sort_order: {
        Desc: null,
      },
      search: [],
    };
    const response: GetEventRecordsResult = await anonymousActor.get_event_records(request);

    console.log("events_response", response);

    let mappedRecords: EventRecord[] = [];

    if ('Ok' in response) {
      const items: EventRecordIdl[] = response.Ok.items;
      // Map raw events to EventRecord shape
      mappedRecords = items.map((event: EventRecordIdl) => {
        return {
          id: event.id,
          type: eventToEventRecordType(event.event),
          timestamp: event.timestamp,
          user: event.user,
        };
      });
    } else {
      throw new Error("Failed to get event records");
    }

    console.log("mappedRecords", mappedRecords);

    return mappedRecords.filter((EventRecord) =>
      Object.entries(filter).every(
        ([key, value]) => EventRecord[key as keyof EventRecord] === value
      )
    );
  }
}

export const eventRecordsService = new EventRecordsService();
