export interface NtagWeapon {
    name: string;
    level: number;
    damage: number;
    injury: number;
    specialDamage: string[];
}

export interface NtagData {
    isHorde: boolean;
    nbrOnHorde: number;
    displayMode: number;
    name: string;
    surname: string;
    characteristicsName: string[];
    lvlAttribute: number;
    endurance: number;
    power: number;
    haveHate: boolean;
    valueHM: number;
    parade: number;
    armor: number;
    weapons: NtagWeapon[];
    specifications: string[];
    description: string;
}

export class EncrypteNtag {
    public static EncryptHex(state: NtagData): string {
        const hexData = [
            this.convertToHex(1),
            this.convertToHex(state.isHorde),
            this.convertToHex(state.isHorde ? state.nbrOnHorde : 0),
            this.convertToHex(state.displayMode),
            this.convertToHex(state.name),
            this.convertToHex(state.surname),
            this.convertToHex(state.characteristicsName[0]),
            this.convertToHex(state.characteristicsName[1]),
            this.convertToHex(state.lvlAttribute),
            this.convertToHex(state.endurance),
            this.convertToHex(state.power),
            this.convertToHex(state.haveHate),
            this.convertToHex(state.valueHM),
            this.convertToHex(state.parade),
            this.convertToHex(state.armor),
        ];

        hexData.push(this.convertToHex(state.weapons.length));
        state.weapons.map((weapon) => {
            hexData.push(this.convertToHex(weapon.name));
            hexData.push(this.convertToHex(weapon.level));
            hexData.push(this.convertToHex(weapon.damage));
            hexData.push(this.convertToHex(weapon.injury));
            hexData.push(this.convertToHex(weapon.specialDamage.length));
            weapon.specialDamage.map((spe) => {
                hexData.push(this.convertToHex(spe));
            })
        })

        hexData.push(this.convertToHex(state.specifications.length));
        state.specifications.map((spe) => {
            hexData.push(this.convertToHex(spe));
        });

        hexData.push(this.convertToHex(state.description));

        return hexData.join('');
    }

    public static DecryptHex(hexData: string): NtagData {
        let index = 0;

        const getValue = (): string => {
            const valueLength = parseInt(hexData.substring(index, index + 2), 16);

            index += 2;
            const value = hexData.substring(index, index + valueLength * 2);
            index += valueLength * 2;

            return value;
        };

        const getBool = (): boolean => {
            const value = hexData.substring(index, index + 2);
            index += 2;

            return !!parseInt(value, 16);
        };

        const AsciiStr = (hex: string) => {
            const hexArray = hex.match(/.{1,2}/g);
            if (!hexArray) return '';

            const uint8Array = new Uint8Array(hexArray.map(byte => parseInt(byte, 16)));
            const decoder = new TextDecoder('utf-8');

            return decoder.decode(uint8Array);
        }

        const versionEncrypter = parseInt(getValue(), 16)

        const state: NtagData = {
            isHorde: getBool(),
            nbrOnHorde: parseInt(getValue(), 16),
            displayMode: parseInt(getValue(), 16),
            name: AsciiStr(getValue()),
            surname: AsciiStr(getValue()),
            characteristicsName: [AsciiStr(getValue()), AsciiStr(getValue())],
            lvlAttribute: parseInt(getValue(), 16),
            endurance: parseInt(getValue(), 16),
            power: parseInt(getValue(), 16),
            haveHate: getBool(),
            valueHM: parseInt(getValue(), 16),
            parade: parseInt(getValue(), 16),
            armor: parseInt(getValue(), 16),
            weapons: [],
            specifications: [],
            description: '', // Assuming 0 means there is no length prefix for description
        };

        const numWeapons = parseInt(getValue(), 16);
        for (let i = 0; i < numWeapons; i++) {
            const weapon: NtagWeapon = {
                name: AsciiStr(getValue()),
                level: parseInt(getValue(), 16),
                damage: parseInt(getValue(), 16),
                injury: parseInt(getValue(), 16),
                specialDamage: [],
            };

            const numSpecialDamage = parseInt(getValue(), 16);
            for (let j = 0; j < numSpecialDamage; j++) {
                weapon.specialDamage.push(AsciiStr(getValue()));
            }

            state.weapons.push(weapon);
        }

        const numSpecifications = parseInt(getValue(), 16);
        for (let i = 0; i < numSpecifications; i++) {
            state.specifications.push(AsciiStr(getValue()));
        }

        state.description = (AsciiStr(getValue()));

        return state;
    }

    public static splitStringIntoLines(str: string, lineLength: number): string {
        const regex = new RegExp(`.{1,2}`, 'g'); // Sépare la chaîne en paires d'octets
        const pairs = str.match(regex) || [];
        const lines = [];

        for (let i = 0; i < pairs.length; i += lineLength) {
            const line = pairs.slice(i, i + lineLength).join(' '); // Ajoute un espace entre chaque paire d'octets
            lines.push(line);
        }

        return lines.join('\n');
    }

    private static convertToHex(value: string | boolean | number | string[]): string {
        if (typeof value === 'boolean') {
            return value ? '01' : '00';
        } else if (typeof value === 'number') {
            if (value <= 0) {
                return '0100';
            }
            const numBytes = Math.ceil(Math.log2(value + 1) / 8);
            return numBytes.toString(16).padStart(2, '0') + value.toString(16).padStart(numBytes * 2, '0');
        } else if (typeof value === 'string') {
            const encoder = new TextEncoder();
            const uint8Array = encoder.encode(value);
            const lengthByte = uint8Array.length.toString(16).padStart(2, '0');
            const hexArray = Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0'));
            return lengthByte + hexArray.join('');
        } else if (Array.isArray(value)) {
            // Handle array of strings
            const hexArray = value.map(str => this.convertToHex(str));
            const lengthByte = hexArray.length.toString(16).padStart(2, '0');
            return lengthByte + hexArray.join('');
        }

        return '';
    }

    private static hexToAscii(hex: string): string {
        let asciiString = '';

        for (let i = 0; i < hex.length; i += 2) {
            const hexPair = hex.substr(i, 2);
            const decimalValue = parseInt(hexPair, 16);
            if (decimalValue !== 0)
                asciiString += String.fromCharCode(decimalValue);
        }

        return asciiString;
    }
}