export interface Flow {
  uuid: string;
  name: string;
  rapidProUuid: string;
  description?: string;
}

export interface FlowKey {
  uuid: string;
  keyName: string;
  name: string;
  description?: string;
  flowUuid: string;
  dataElement?: DataElementRef;
  categories?: FlowCategory[];
}

export interface DataElementRef {
  uuid: string;
  name: string;
  code?: string;
  dhis2Uid?: string;
}

export interface FlowCategory {
  uuid: string;
  name: string;
  dataElementUuid?: string;
  possibleTrueValues?: string;
}
