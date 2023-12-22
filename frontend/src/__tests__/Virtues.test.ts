import {dataVirtues, Virtue} from "../utils/VallianceWisdom/Virtues";

describe("Virtues tests", () => {
    const emp = new Virtue(dataVirtues.empoweredVirtue);

    test("Test constructeur", () => {
        expect(emp.isChosen()).toBe(false);
    });

    test("Test setchosen()", () => {
        emp.setChosen(0);

        expect(emp.isChosen()).toBe(true);
        expect(emp.getChosen()).toBe(emp.getInfos()[0]);
    });
});
