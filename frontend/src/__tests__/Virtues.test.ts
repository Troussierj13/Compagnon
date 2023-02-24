import {dataVirtues, Virtue} from "@/utils/VallianceWisdom/Virtues";

describe("Virtues tests", () => {
    test("Test ", () => {
        const emp = new Virtue(dataVirtues.empoweredVirtue);
        const emp2 = new Virtue(dataVirtues.empoweredVirtue);

        console.log(emp.isChosen());
        console.log(emp2.isChosen());
        emp.setChosen(-1);
        console.log(emp.isChosen());
        console.log(emp2.isChosen());

    });
});
