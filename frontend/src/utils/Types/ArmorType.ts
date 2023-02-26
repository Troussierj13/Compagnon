import {ArmorIdentifier, IdentifiedValue} from "@/utils/Types/IdentifiedType";

export class ArmorType {
    identifier: ArmorIdentifier;
    name: string;
    protection: IdentifiedValue;
    parade: IdentifiedValue;
    weight: IdentifiedValue;

    constructor(payload?: Partial<ArmorType>) {
        this.identifier = payload?.identifier || 'unknown';
        this.name = payload?.name || "";
        switch (this.identifier) {
            case 'armor':
                this.protection = new IdentifiedValue({
                    identifier: 'armorProtection',
                    value: payload?.protection?.value,
                });
                this.parade = new IdentifiedValue({});
                this.weight = new IdentifiedValue({
                    identifier: 'armorWeight',
                    value: payload?.weight?.value,
                });
                break;
            case 'helm':
                this.protection = new IdentifiedValue({
                    identifier: 'helmProtection',
                    value: payload?.protection?.value,
                });
                this.parade = new IdentifiedValue({});
                this.weight = new IdentifiedValue({
                    identifier: 'helmWeight',
                    value: payload?.weight?.value,
                });
                break;
            case 'shield':
                this.protection = new IdentifiedValue({});
                this.parade = new IdentifiedValue({
                    identifier: 'shieldParade',
                    value: payload?.parade?.value,
                });
                this.weight = new IdentifiedValue({
                    identifier: 'shieldWeight',
                    value: payload?.weight?.value,
                });
                break;
            default:
                this.protection = new IdentifiedValue({});
                this.parade = new IdentifiedValue({});
                this.weight = new IdentifiedValue({});
                break;
        }
    }
}
