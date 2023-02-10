import { IdentifiedValue, Identifier } from "@/utils/Types/IdentifiedType";

export class ArmorType {
  name: string;
  protection: string;
  parade: string;
  weight: IdentifiedValue;

  constructor(payload?: Partial<ArmorType>, identifier?: Identifier) {
    this.name = payload?.name || "";
    this.protection = payload?.protection || "";
    this.parade = payload?.parade || "";
    this.weight = new IdentifiedValue({
      identifier: identifier ? identifier : "unknown",
      value: payload?.weight?.value,
    });
  }
}
