<template>
    <div class="relative group flex m-auto mt-10">
        <div class="border-gradient-red"></div>
        <div class="relative ring-2 ring-slate-900/5">
            <div class="relative p-6 space-y-12 rounded-lg bg-sheet bg-cover bg-clip-border bg-center bg-origin-border">
                <!-- Metadata -->
                <div class="flex justify-center items-center mb-4 space-x-10">
                    <div class="flex flex-col items-center">
                        <label class="font-bold text-lg mr-2">isHorde</label>
                        <input v-model="state.isHorde" class="form-checkbox h-5 w-5 text-blue-600" type="checkbox"/>
                    </div>

                    <div v-show="state.isHorde" class="flex flex-col items-center">
                        <label class="font-bold text-lg">Number On Horde</label>
                        <input v-model="state.nbrOnHorde" type="number"/>
                    </div>

                    <div class="flex flex-col items-center">
                        <label class="font-bold text-lg">Display Mode</label>
                        <input v-model="state.displayMode" type="number"/>
                    </div>
                </div>

                <!-- Additional fields -->

                <div class="flex justify-center items-center mb-4 space-x-10">
                    <div class="flex flex-col items-center space-x-2">
                        <label class="font-bold text-lg">Name</label>
                        <input v-model="state.name" type="text"/>
                    </div>

                    <div class="flex flex-col items-center space-x-2">
                        <label class="font-bold text-lg">Surname</label>
                        <input v-model="state.surname" type="text"/>
                    </div>
                    <div>
                        <div class="flex space-x-6">
                            <label class="font-bold text-lg">Characteristics Name</label>
                            <Button v-show="state.characteristicsName.length < 2"
                                    class="text-base" content="Add"
                                    @click="state.characteristicsName.push('')"></Button>
                        </div>
                        <div v-for="(char, index) in state.characteristicsName" :key="index" class="mb-2">
                            <input v-model="state.characteristicsName[index]" type="text"/>
                        </div>
                    </div>
                </div>

                <div class="flex justify-center items-center mb-4 space-x-10">
                    <div class="flex flex-col">
                        <label class="font-bold text-lg">Level Attribute</label>
                        <input v-model="state.lvlAttribute" class="max-w-[8em]" type="number"/>
                    </div>

                    <div class="flex flex-col">
                        <label class="font-bold text-lg">Endurance</label>
                        <input v-model="state.endurance" class="max-w-[8em]" type="number"/>
                    </div>

                    <div class="flex flex-col">
                        <label class="font-bold text-lg">Power</label>
                        <input v-model="state.power" class="max-w-[8em]" type="number"/>
                    </div>

                    <div class="flex items-center">
                        <label class="font-bold text-lg">Is Hate</label>
                        <input v-model="state.haveHate" class="form-checkbox h-5 w-5 text-blue-600" type="checkbox"/>
                    </div>

                    <div class="flex flex-col">
                        <label v-show="state.haveHate" class="font-bold text-lg">Hate</label>
                        <label v-show="!state.haveHate" class="font-bold text-lg">Might</label>
                        <input v-model="state.valueHM" class="max-w-[8em]" type="number"/>
                    </div>

                    <div class="flex flex-col">
                        <label class="font-bold text-lg">Parade</label>
                        <input v-model="state.parade" class="max-w-[8em]" type="number"/>
                    </div>

                    <div class="flex flex-col">
                        <label class="font-bold text-lg">Armor</label>
                        <input v-model="state.armor" class="max-w-[8em]" type="number"/>
                    </div>
                </div>

                <!-- Weapons -->
                <div>
                    <label class="font-bold text-lg mr-4">Weapons</label>
                    <Button v-show="state.weapons.length < 3" class="text-base"
                            content="Add" @click="state.weapons.push({specialDamage: []} as Weapon)"></Button>
                    <div v-for="(weapon, weaponIndex) in state.weapons" :key="weaponIndex"
                         class="flex justify-center items-center mb-4 space-x-10">
                        <div class="flex flex-col">
                            <label class="font-bold">Name</label>
                            <input v-model="weapon.name" type="text"/>
                        </div>

                        <div class="flex flex-col">
                            <label class="font-bold">Level weapon</label>
                            <input v-model="weapon.level" type="number"/>
                        </div>

                        <div class="flex flex-col">
                            <label class="font-bold">Damage Weapon</label>
                            <input v-model="weapon.damage" type="number"/>
                        </div>

                        <div class="flex flex-col">
                            <label class="font-bold">Injury weapon</label>
                            <input v-model="weapon.injury" type="number"/>
                        </div>

                        <div>
                            <div class="flex space-x-6">
                                <label class="font-bold text-lg">Special damage</label>
                                <Button v-show="weapon.specialDamage.length < 2" class="text-base font-bold"
                                        content="Add" @click="weapon.specialDamage.push('')"></Button>
                            </div>
                            <div v-for="(spe, indexSpe) in weapon.specialDamage" :key="indexSpe" class="mb-2">
                                <input v-model=weapon.specialDamage[indexSpe]/ type="text">
                            </div>
                        </div>
                        <!-- Add similar sections for specialWeapons -->
                    </div>
                </div>

                <!-- Specifications -->
                <div>
                    <label class="font-bold text-lg mr-4">Specifications</label>
                    <Button v-show="state.specifications.length < 2" class="text-base"
                            content="Add" @click="state.specifications.push('')"></Button>

                    <div v-for="(spec, specIndex) in state.specifications" :key="specIndex" class="mb-2">
                        <input v-model="state.specifications[specIndex]" type="text"/>
                    </div>
                </div>

                <div class="flex flex-col">
                    <label class="font-bold text-lg">Description</label>
                    <textarea v-model="state.description"/>
                </div>

                <div class="flex justify-center">
                    <Button class="mt-14 mb-8 text-xl font-bold" content="Encrypt for to NTAG"
                            @click="encryptNtag(state)"/>
                </div>

                <div v-show="state.hexaData.length > 0" class="flex justify-center">
                    <textarea v-model="state.hexaData" disabled/>
                </div>

                <div class="flex justify-center">
                    <Button class="mt-14 mb-8 text-xl font-bold" content="Send data to server"
                            @click="APIRequests.Ntags.update(state.hexaData)"/>
                </div>


            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import Button from "../Styleguide/Button.vue";
import {EncrypteNtag} from "../../utils/EncryptNtag";
import {APIRequests} from "../../utils/apiurls";

interface Weapon {
    name: string;
    level: number;
    damage: number;
    injury: number;
    specialDamage: string[];
}

interface FormState {
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
    weapons: Weapon[];
    specifications: string[];
    description: string;
    hexaData: string;
}

const state = ref<FormState>({
    isHorde: false,
    nbrOnHorde: 1,
    displayMode: 1,
    name: 'Ukmars Vragge',
    surname: 'Pilleur du Sud',
    characteristicsName: ['Rusé', 'Visieux'],
    lvlAttribute: 4,
    endurance: 15,
    power: 2,
    haveHate: false,
    valueHM: 4,
    parade: 1,
    armor: 2,
    weapons: [
        {
            name: 'Hache',
            level: 3,
            damage: 4,
            injury: 18,
            specialDamage: []
        },
        {
            name: 'Lance courte',
            level: 2,
            damage: 3,
            injury: 15,
            specialDamage: ['Perforation']
        },
    ],
    specifications: ["Féroce: Dépense 1pt de volonté, -1d lors d'une attaque"],
    description: 'Lors des longs hivers, les Hommes du Sud se rassemblent et partent à la recherche de propriétaires isolés à piller.',
    hexaData: '',
});

const encryptNtag = (state: FormState) => {
    const hexData = EncrypteNtag.EncryptHex(state);
    state.hexaData = hexData;
    //state.hexaData = EncrypteNtag.splitStringIntoLines(hexData, 16);
}

</script>

<style scoped>
.border-gradient-red {
    --tw-gradient-from: #dc2626;
    --tw-gradient-to: #db2777;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
    @apply absolute -inset-2 rounded-lg blur opacity-25 group-hover:opacity-50 transition-all duration-500 group-hover:duration-200
}

input {
    @apply border rounded w-full p-2 h-8 font-sansserif font-bold
}

textarea {
    @apply border rounded w-full p-2 h-48 font-sansserif font-bold
}
</style>
