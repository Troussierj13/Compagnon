import {DescribableNameWithModifier, PossibleChoose} from "@/utils/helpers";

const expectObjectToBe = (exp: object, toB: string) => {
    //console.log('Result: ', JSON.stringify(exp), '\n', 'Expect: ', toB);
    expect(JSON.stringify(exp)).toBe(toB);
};

describe("PossibleChoose Test", () => {
    test("Test constructor and getChosen function", () => {
        //Test throw error
        expect(() => {
            new PossibleChoose<string>(2, ['first', 'second', 'third'], []);
        }).toThrow(RangeError);

        expect(() => {
            new PossibleChoose<string>(2, ['first', 'second', 'third'], [0]);
        }).toThrow(RangeError);

        expect(() => {
            new PossibleChoose<string>(2, ['first', 'second', 'third'], [0, 5]);
        }).toThrow(RangeError);

        expect(() => {
            new PossibleChoose<string>(0, ['first', 'second', 'third']);
        }).toThrow(RangeError);

        expect(() => {
            new PossibleChoose<string>(6, ['first', 'second', 'third']);
        }).toThrow(RangeError);

        //Test in real use case
        let possible = new PossibleChoose<string>(2, ['first', 'second', 'third']);
        expect(() => {
            possible.getChosen();
        }).toThrow(RangeError);
        expect(possible.isChosen()).toBe(false);

        possible.setChosen([0, 2]);

        expectObjectToBe(possible.getChosen(), '["first","third"]');
        expect(possible.isChosen()).toBe(true);

        const possible2 = new PossibleChoose<string>(2, ['first', 'second', 'third'], [0, 1]);
        expectObjectToBe(possible2.getChosen(), '["first","second"]');
        expect(possible2.isChosen()).toBe(true);

        const possible3 = new PossibleChoose<string>(2, ['first', 'second'], [0, 1]);
        expectObjectToBe(possible3.getChosen(), '["first","second"]');
        expect(possible3.isChosen()).toBe(true);

        const possible4 = new PossibleChoose<string>(2, ['first', 'second']);
        expectObjectToBe(possible4.getChosen(), '["first","second"]');
        expect(possible4.isChosen()).toBe(true);


        const possible5 = new PossibleChoose<string>(2, ['first', 'second', 'third'], [0, 1]);
        if (possible5.isChosen()) {
            console.log(possible5.getChosen());
        }

    });

    test("Test with DescribableNameWithModifier type", () => {
        const modHabStrength = new DescribableNameWithModifier(
            "Habilité",
            "Réduisez le SR de CORPS de 1",
            [
                {identifier: 'strengthSR', op: '+', mod: -1}
            ]
        );

        const modHabHearth = new DescribableNameWithModifier(
            "Habilité",
            "Réduisez le SR de CORPS de 1",
            [
                {identifier: 'heartSR', op: '+', mod: -1}
            ]
        );

        const modHabMind = new DescribableNameWithModifier(
            "Habilité",
            "Réduisez le SR de CORPS de 1",
            [
                {identifier: 'mindSR', op: '+', mod: -1}
            ]
        );

        const possibleHab = new PossibleChoose<DescribableNameWithModifier>(1, [modHabStrength, modHabHearth, modHabMind]);
        console.log(possibleHab);
        expect(possibleHab.isChosen()).toBe(false);
        expect(() => {
            possibleHab.getChosen();
        }).toThrow(RangeError);
        possibleHab.setChosen([0]);
        expectObjectToBe(possibleHab.getChosen(), JSON.stringify([modHabStrength]));
        console.log(possibleHab);

    });
});
