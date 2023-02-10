import { IdentifiedValue } from "@/utils/Types/IdentifiedType";

export class AttributesValuesType {
  strength: IdentifiedValue;
  heart: IdentifiedValue;
  mind: IdentifiedValue;

  constructor(payload?: Partial<AttributesValuesType>) {
    this.strength = new IdentifiedValue(payload?.strength);
    this.heart = new IdentifiedValue(payload?.heart);
    this.mind = new IdentifiedValue(payload?.mind);
  }
}

export class AttributesSecondaryType {
  endurance: IdentifiedValue;
  hope: IdentifiedValue;
  parade: IdentifiedValue;

  constructor(payload?: AttributesSecondaryType) {
    this.endurance = new IdentifiedValue(payload?.endurance);
    this.hope = new IdentifiedValue(payload?.hope);
    this.parade = new IdentifiedValue(payload?.parade);
  }
}

export class Attributes {
  values: AttributesValuesType;
  sr: AttributesValuesType;
  secondary: AttributesSecondaryType;

  constructor(payload?: Partial<AttributesValuesType>) {
    this.values = new AttributesValuesType({
      strength: new IdentifiedValue({
        identifier: "strength",
        value: payload?.strength?.value,
      }),
      heart: new IdentifiedValue({
        identifier: "heart",
        value: payload?.heart?.value,
      }),
      mind: new IdentifiedValue({
        identifier: "mind",
        value: payload?.mind?.value,
      }),
    });
    this.sr = new AttributesValuesType({
      strength: new IdentifiedValue({
        identifier: "strengthSR",
        value: payload?.strength?.value ? 20 - payload?.strength?.value : 0,
      }),
      heart: new IdentifiedValue({
        identifier: "heartSR",
        value: payload?.heart?.value ? 20 - payload?.heart?.value : 0,
      }),
      mind: new IdentifiedValue({
        identifier: "mindSR",
        value: payload?.mind?.value ? 20 - payload?.mind?.value : 0,
      }),
    });
    this.secondary = new AttributesSecondaryType({
      endurance: new IdentifiedValue({
        identifier: "enduranceMax",
        value: payload?.strength?.value,
      }),
      hope: new IdentifiedValue({
        identifier: "hopeMax",
        value: payload?.heart?.value,
      }),
      parade: new IdentifiedValue({
        identifier: "parade",
        value: payload?.mind?.value,
      }),
    });
  }
}
