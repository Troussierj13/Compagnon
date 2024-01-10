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
    valueHE: number;
    parade: number;
    armor: number;
    weapons: NtagWeapon[];
    specifications: string[];
    description: string;
}
export class EncrypteNtag {
    public static EncryptHex(state: NtagData): string {
        const hexData = [
            this.convertToHex(1, 1),
            this.convertToHex(state.isHorde, 1),
            this.convertToHex(state.isHorde ? state.nbrOnHorde : 0, 1),
            this.convertToHex(state.displayMode, 1),
            "00".repeat(12),

            // Example for Name (48 octets)
            this.convertToHex(state.name, 32),
            this.convertToHex(state.surname, 32),
            this.convertToHex(state.characteristicsName[0] || '', 16),
            this.convertToHex(state.characteristicsName[1] || '', 16),
            this.convertToHex(state.characteristicsName[2] || '', 16),
            this.convertToHex(state.lvlAttribute, 1),
            this.convertToHex(state.endurance, 1),
            this.convertToHex(state.power, 1),
            this.convertToHex(state.haveHate, 1),
            this.convertToHex(state.valueHE, 1),
            this.convertToHex(state.parade, 1),
            this.convertToHex(state.armor, 1),
            "00".repeat(9),
        ];

        for(let i = 0 ; i<4 ; i++) {
            hexData.push(this.convertToHex(state.weapons[i]?.name || '', 32));
            hexData.push(this.convertToHex(state.weapons[i]?.level || '', 1));
            hexData.push(this.convertToHex(state.weapons[i]?.damage || '', 1));
            hexData.push(this.convertToHex(state.weapons[i]?.injury || '', 1));
            hexData.push(this.convertToHex(state.weapons[i]?.specialDamage[0] || '', 13));
            for(let j = 1 ; j<4 ; j++) {
                hexData.push(this.convertToHex(state.weapons[i]?.specialDamage[j] || '', 16));
            }
        }

        for(let i = 0 ; i<4 ; i++) {
            hexData.push(this.convertToHex(state.specifications[i] || '', 48));
        }

        hexData.push(this.convertToHex(state.description, 0));

        return hexData.join('');
    }

    public static DecrypteHex(hexData: string): NtagData {
        console.log(hexData)
        return {
            name: this.hexToAscii(hexData.substring(16*2, 16*2+32*2)),
            surname: this.hexToAscii(hexData.substring(32*2, 32*2+32*2)),
        } as NtagData;
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

    private static convertToHex (value: string | boolean | number, length: number): string {
        if (typeof value === 'boolean') {
            return value ? '01' : '00';
        }
        else if(typeof value === 'number') {
            return (value % 256).toString(16).padStart(2, '00');
        }

        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(value);
        const hexArray = Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0'));

        const hexVal = hexArray.join('').padEnd(length * 2, '00');

        if(length > 0) {
            return hexVal.slice(0, length*2);
        }
        else {
            return hexVal;
        }
    }

    private static hexToAscii(hex: string): string {
        let asciiString = '';

        for (let i = 0; i < hex.length; i += 2) {
            const hexPair = hex.substr(i, 2);
            const decimalValue = parseInt(hexPair, 16);
            if(decimalValue !== 0)
            asciiString += String.fromCharCode(decimalValue);
        }

        return asciiString;
    }
}