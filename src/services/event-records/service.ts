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
import { Principal } from "@dfinity/principal";

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
  userPrincipal?: Principal;
  correlation_id: string;
  // error?: [];
  // fee?: string;
};

export class EventRecordsService {
  async getEventRecords(
    filter: {
      user?: string;
      type?: EventRecordType;
      from?: bigint;
      to?: bigint;
    } = {}
  ): Promise<Array<EventRecord>> {
    const anonymousActor = await getAnonActor<VaultType>(
      VAULT_CANISTER_ID,
      idlFactory
    );
    const request: ListItemsPaginationRequest = {
      page: BigInt(filter.from ? Number(filter.from) : 1),
      page_size: BigInt(filter.to ? Number(filter.to) : 1000),
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
          userPrincipal: event.user.length > 0 ? event.user[0] : undefined,
          correlation_id: event.correlation_id,
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
