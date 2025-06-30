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
      page: BigInt(0),
      page_size: BigInt(10),
      sort_order: {
        Asc: null,
      },
      search: [],
    };
    const response: GetEventRecordsResult =
      await anonymousActor.get_event_records(request);
    const items: [EventRecordIdl] = response.Ok.items;

    // Map raw events to EventRecord shape
    const mappedRecords: EventRecord[] = items.map((event: EventRecordIdl) => {
      return {
        id: event.id,
        type: eventToEventRecordType(event.event),
      };
    });
    return mappedRecords.filter((EventRecord) =>
      Object.entries(filter).every(
        ([key, value]) => EventRecord[key as keyof EventRecord] === value
      )
    );
  }
}

export const eventRecordsService = new EventRecordsService();
