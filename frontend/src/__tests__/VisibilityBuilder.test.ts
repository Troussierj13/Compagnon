import {
    COMPRESS_VISIBILITY_ALL, COMPRESS_VISIBILITY_DEFAULT,
    CompressedVisibility, CompressVisibility,
    VISIBILITY_ALL, VISIBILITY_DEFAULT,
    VisibilityEntity,
    VisibilityEntityBuilder
} from "../utils/Types/Entity";

describe("Visibility builder tests", () => {
    const comp: CompressedVisibility = {
        recto: 1,
        charact: 28,
        weapon: 2,
        spe: 0
    }

    const testV:VisibilityEntity = {
        name: true,
        surname: false,
        characteristicsName: false,
        lvlAttribute: false,
        description: false,
        endurance: false,
        power: false,
        valueHM: true,
        parade: true,
        armor: true,
        weapons: [false, true, false],
        specifications: [false, false],
    }

    const entityV = VisibilityEntityBuilder(comp, comp);

    test("Test", () => {
        expect(entityV).toStrictEqual(testV);
    });

    test('test', () => {
        console.log(CompressVisibility(VISIBILITY_DEFAULT))
        expect(CompressVisibility(VISIBILITY_DEFAULT)).toStrictEqual(COMPRESS_VISIBILITY_DEFAULT);
    })
});
