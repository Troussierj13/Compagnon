import { Identifier } from "@/utils/Types/IdentifiedType";

export type ModificatorOperation = "+" | "*";

export type ModifierParam = {
  identifier: Identifier;
  mod: number;
  op: ModificatorOperation;
};

export class Modifiers {
  "+": Array<number>;
  "*": Array<number>;

  constructor() {
    this["+"] = [0];
    this["*"] = [1];
  }

  public addModifiers(mods: Array<Omit<ModifierParam, "path">>) {
    mods.map((item) => {
      this[item.op].push(item.mod);
    });
  }

  getModified(initial: number): number {
    return (
      (initial + this["+"].reduce((acc, curr) => acc + curr)) *
      this["*"].reduce((acc, curr) => acc * curr)
    );
  }
}
