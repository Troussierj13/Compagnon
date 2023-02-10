<template>
    <div
        class="relative mx-auto flex min-w-[90rem] border-t-80 border-b-56 border-red/0 bg-sheet bg-cover bg-clip-border bg-center bg-origin-border"
    >
        <div
            class="absolute -top-20 h-20 w-full bg-topSheet bg-contain bg-center brightness-75 contrast-125 saturate-150"
        />
        <div
            class="absolute -bottom-14 h-16 w-full bg-bottomSheet bg-cover bg-clip-border bg-center bg-origin-border"
        />
        <div class="absolute z-50">
            <TooltipsModifiableValue
                v-if="state.showTooltips"
                :children="TooltipsOneNumberValue"
                :identifier-attr="state.modifAttr"
                :player="state.player"
                :position="state.tooltipPosition"
            />
        </div>

        <div class="flex h-full w-[75.3%] flex-col border-l-18 border-red/0">
            <div
                v-if="state.showTooltips"
                class="absolute inset-0 -top-20 z-40 aspect-video h-auto w-[90rem] bg-transparent"
                @click="state.showTooltips = false"
            />
            <div class="h-24 w-full">
                <HeaderPlayerSheet :data="state.player.getHeaderValues()" />
            </div>
            <div class="double-line-right mb-2 flex w-full grow flex-col">
                <div class="flex h-full w-full flex-col px-1">
                    <div class="relative flex grow">
                        <span
                            class="absolute top-[34.3%] left-[42%] z-10 bg-yellow px-2 text-sm leading-3 text-red"
                        >COMPETENCES</span
                        >
                        <div
                            class="double-line-right flex h-full w-1/3 flex-col pr-1"
                        >
                            <div
                                class="mb-2 flex h-1/3 w-full flex-col justify-center"
                            >
                                <span class="mx-auto text-lg text-red"
                                >Corps</span
                                >
                                <span
                                    class="diamond diamond-lg relative top-3.5 ml-[55.5%] mr-auto"
                                >
                                    <span>{{
                                        state.player.getModifiedValue(
                                            'strength'
                                        )
                                    }}</span>
                                    <span class="absolute -top-8 left-0 text-xs"
                                    >Valeur</span
                                    >
                                </span>
                                <span
                                    class="diamond diamond-double diamond-xl mx-auto"
                                >
                                    <span>{{
                                        state.player.getModifiedValue(
                                            'strengthSR'
                                        )
                                    }}</span>
                                    <span
                                        class="absolute right-3 -bottom-7 text-xs"
                                    >SR</span
                                    >
                                </span>
                                <span
                                    class="diamond diamond-lg relative -top-2.5 ml-[56.7%] mr-auto"
                                >
                                    <span
                                        :key="
                                            state.player.currentEndurance.value
                                        "
                                    >{{
                                        state.player.getModifiedValue(
                                            'enduranceMax'
                                        )
                                    }}</span
                                    >
                                    <span class="absolute -top-3 left-9 text-xs"
                                    >Endurance</span
                                    >
                                </span>
                            </div>
                            <div
                                class="line-top flex h-1/3 w-full flex-col justify-between p-2"
                            >
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.strengthSkills.awe"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="
                                        state.player.strengthSkills.athletics
                                    "
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="
                                        state.player.strengthSkills.awareness
                                    "
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.strengthSkills.hunting"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.strengthSkills.song"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.strengthSkills.craft"
                                />
                            </div>
                            <div
                                class="line-top flex h-1/3 w-full flex-col justify-between p-2"
                            >
                                <span class="text-red"
                                >Compétences de combats</span
                                >
                                <div
                                    class="my-auto flex flex-col justify-center gap-1"
                                >
                                    <SkillRow
                                        :favorisable="false"
                                        :skill="state.player.combatSkills.bows"
                                    />
                                    <SkillRow
                                        :favorisable="false"
                                        :skill="
                                            state.player.combatSkills.swords
                                        "
                                    />
                                    <SkillRow
                                        :favorisable="false"
                                        :skill="state.player.combatSkills.axes"
                                    />
                                    <SkillRow
                                        :favorisable="false"
                                        :skill="
                                            state.player.combatSkills.spears
                                        "
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            class="double-line-right flex h-full w-1/3 flex-col px-1"
                        >
                            <div
                                class="mb-2 flex h-1/3 w-full flex-col justify-center"
                            >
                                <span class="mx-auto text-lg text-red"
                                >C&oelig;ur</span
                                >
                                <span
                                    class="diamond diamond-lg relative top-3.5 ml-[55.5%] mr-auto"
                                >
                                    <span>{{
                                        state.player.getModifiedValue('heart')
                                    }}</span>
                                    <span class="absolute -top-8 left-0 text-xs"
                                    >Valeur</span
                                    >
                                </span>
                                <span
                                    class="diamond diamond-double diamond-xl mx-auto"
                                >
                                    <span>{{
                                        state.player.getModifiedValue('heartSR')
                                    }}</span>
                                    <span
                                        class="absolute right-3 -bottom-7 text-xs"
                                    >SR</span
                                    >
                                </span>
                                <span
                                    class="diamond diamond-lg relative -top-2.5 ml-[56.7%] mr-auto"
                                >
                                    <span>{{
                                        state.player.getModifiedValue('hopeMax')
                                    }}</span>
                                    <span
                                        class="absolute -top-1 left-10 text-xs"
                                    >Espoir</span
                                    >
                                </span>
                            </div>
                            <div
                                class="line-top flex h-1/3 w-full flex-col justify-between p-2"
                            >
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.heartSkills.enhearten"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.heartSkills.travel"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.heartSkills.insight"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.heartSkills.healing"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.heartSkills.courtesy"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.heartSkills.battle"
                                />
                            </div>
                            <div class="line-top h-1/3 w-full space-y-2 p-2">
                                <div class="flex h-4 w-full justify-between">
                                    <span class="text-red">Récompenses</span>
                                    <span class="diamond diamond-md relative">
                                        <span>{{
                                            state.player.valiance.rank
                                        }}</span>
                                        <span
                                            class="absolute top-5 -left-16 font-serif text-[0.65rem]"
                                        >VAILLANCE</span
                                        >
                                    </span>
                                </div>
                                <div
                                    v-for="reward in state.player.valiance
                                        .rewards"
                                    :key="reward.identifier"
                                    class="w-11/12 whitespace-normal text-xs"
                                >
                                    <span class="w-full break-words">
                                        {{ reward.name }} (
                                        {{ reward.description }} )</span
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="flex h-full w-1/3 flex-col pl-1">
                            <div
                                class="mb-2 flex h-1/3 w-full flex-col justify-center"
                            >
                                <span class="mx-auto text-lg text-red"
                                >Esprit</span
                                >
                                <span
                                    class="diamond diamond-lg relative top-3.5 ml-[55.5%] mr-auto"
                                >
                                    <span>{{
                                        state.player.getModifiedValue('mind')
                                    }}</span>
                                    <span class="absolute -top-8 left-0 text-xs"
                                    >Valeur</span
                                    >
                                </span>
                                <span
                                    class="diamond diamond-double diamond-xl mx-auto"
                                >
                                    <span>{{
                                        state.player.getModifiedValue('mindSR')
                                    }}</span>
                                    <span
                                        class="absolute right-3 -bottom-7 text-xs"
                                    >SR</span
                                    >
                                </span>
                                <span
                                    class="diamond diamond-lg relative -top-2.5 ml-[56.7%] mr-auto"
                                >
                                    <span>{{
                                        state.player.getModifiedValue('parade')
                                    }}</span>
                                    <span
                                        class="absolute -top-2 left-10 text-xs"
                                    >Parade</span
                                    >
                                </span>
                            </div>
                            <div
                                class="line-top flex h-1/3 w-full flex-col justify-between p-2"
                            >
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.mindSkills.persuade"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.mindSkills.stealth"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.mindSkills.scan"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.mindSkills.explore"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.mindSkills.riddle"
                                />
                                <SkillRow
                                    :favorisable="true"
                                    :skill="state.player.mindSkills.lore"
                                />
                            </div>
                            <div class="line-top h-1/3 w-full p-2">
                                <div class="flex h-4 w-full justify-between">
                                    <span class="text-red">Vertus</span>
                                    <span class="diamond diamond-md relative">
                                        <span>
                                            {{ state.player.wisdom.rank }}
                                        </span>
                                        <span
                                            class="absolute top-3 -left-[3.25rem] font-serif text-[0.65rem]"
                                        >SAGESSE</span
                                        >
                                    </span>
                                </div>
                                <div
                                    v-for="virtue in state.player.wisdom
                                        .virtues"
                                    :key="virtue.identifier"
                                    class="w-11/12 whitespace-normal text-xs"
                                >
                                    <span class="w-full break-words">
                                        {{ virtue.name }} (
                                        {{ virtue.description }} )</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="double-line-top mt-1 flex h-1/5 w-full">
                        <div
                            class="line-right mt-1 flex h-full w-2/3 flex-col p-2"
                        >
                            <div
                                class="flex w-full gap-1 font-sansserif text-[0.6rem] font-bold leading-[0.8rem]"
                            >
                                <span
                                    class="grow font-UncialAntiqua text-base font-normal text-red"
                                >Attirail de guerre</span
                                >
                                <span class="my-auto h-2.5 w-1/12 text-center"
                                >Dégats</span
                                >
                                <span class="my-auto h-2.5 w-1/12 text-center"
                                >Blessure</span
                                >
                                <span class="my-auto h-2.5 w-1/12 text-center"
                                >Charge</span
                                >
                                <span class="my-auto h-2.5 w-4/12">Notes</span>
                            </div>
                            <div
                                v-for="n in 4"
                                :key="n - 1"
                                class="flex grow flex-col justify-center"
                            >
                                <WeaponRow
                                    :weapon="state.player.weapons[n - 1]"
                                />
                            </div>
                        </div>
                        <div
                            class="flex h-full grow flex-col justify-between p-2"
                        >
                            <div>
                                <div
                                    class="mb-1 flex w-full gap-1 text-[0.6rem] leading-[0.8rem]"
                                >
                                    <span class="grow font-serif font-bold"
                                    >ARMURE</span
                                    >
                                    <span
                                        class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold"
                                    >Protection</span
                                    >
                                    <span
                                        class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold"
                                    >Charge</span
                                    >
                                </div>
                                <ArmorRow
                                    :armor="state.player.armor"
                                    :weight="
                                        state.player.getModifiedValue(
                                            'armorWeight'
                                        )
                                    "
                                />
                                <div
                                    class="flex w-full gap-1 text-[0.6rem] leading-[0.8rem]"
                                >
                                    <span class="grow font-sansserif font-bold"
                                    >Casque</span
                                    >
                                </div>
                                <ArmorRow
                                    :armor="state.player.helm"
                                    :weight="
                                        state.player.getModifiedValue(
                                            'helmWeight'
                                        )
                                    "
                                />
                            </div>
                            <div>
                                <div
                                    class="mb-1 flex w-full gap-1 text-[0.6rem] leading-[0.8rem]"
                                >
                                    <span class="grow font-serif font-bold"
                                    >BOUCLIER</span
                                    >
                                    <span
                                        class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold"
                                    >Parade</span
                                    >
                                    <span
                                        class="my-auto h-2.5 w-1/5 text-center font-sansserif font-bold"
                                    >Charge</span
                                    >
                                </div>
                                <ArmorRow
                                    :armor="state.player.shield"
                                    :weight="
                                        state.player.getModifiedValue(
                                            'shieldWeight'
                                        )
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="flex h-full w-[24.7%] flex-col border-r-18 border-red/0 px-1"
        >
            <div class="flex h-1/3 flex-col p-3">
                <div class="simple-border h-full w-full" />
            </div>
            <div class="flex grow flex-col">
                <div class="flex">
                    <div class="flex w-1/3 flex-col justify-center">
                        <span
                            class="mx-auto mb-2 whitespace-pre-line text-center text-xs text-red"
                        >Points d'aventure</span
                        >
                        <span
                            class="diamond diamond-md mx-auto cursor-pointer select-none"
                            @click="
                                ClickModifiableAttr(
                                    { top: 257, left: 1029 },
                                    'adventurePoints',
                                    1
                                )
                            "
                        >
                            <span>{{ state.player.adventurePoints }}</span>
                        </span>
                    </div>
                    <div class="flex w-1/3 flex-col justify-center">
                        <span
                            class="mx-auto mb-2 whitespace-pre-line text-center text-xs text-red"
                        >Points de progression</span
                        >
                        <span
                            class="diamond diamond-md mx-auto cursor-pointer select-none"
                            @click="
                                ClickModifiableAttr(
                                    { top: 257, left: 1139 },
                                    'progressPoints',
                                    1
                                )
                            "
                        >
                            <span>{{ state.player.progressPoints }}</span>
                        </span>
                    </div>
                    <div class="flex w-1/3 flex-col justify-center">
                        <span
                            class="mx-auto mb-2 whitespace-pre-line text-center text-xs text-red"
                        >Points de communauté</span
                        >
                        <span
                            class="diamond diamond-md mx-auto cursor-pointer select-none"
                            @click="
                                ClickModifiableAttr(
                                    { top: 257, left: 1249 },
                                    'communityPoints',
                                    1
                                )
                            "
                        >
                            <span>{{ state.player.communityPoints }}</span>
                        </span>
                    </div>
                </div>
                <div class="flex grow py-8">
                    <div class="flex w-1/2 flex-col justify-between">
                        <span
                            class="text-md mx-auto mb-2 whitespace-pre-line text-center text-red"
                        >Endurance actuelle</span
                        >
                        <div class="mr-6 mt-2 flex flex-col">
                            <span
                                class="diamond diamond-md relative top-3.5 -right-2 ml-[55.5%] mr-auto select-none"
                            >
                                <span>{{
                                    state.player.getModifiedValue('weight')
                                }}</span>
                                <span class="absolute -top-4 right-2 text-xs"
                                >Charge</span
                                >
                            </span>
                            <span
                                class="diamond diamond-lg mx-auto cursor-pointer select-none"
                                @click="
                                    ClickModifiableAttr(
                                        { top: 427, left: 1030 },
                                        'currentEndurance',
                                        -1
                                    )
                                "
                            >
                                <span>
                                    {{
                                        state.player.getModifiedValue(
                                            'currentEndurance'
                                        )
                                    }}
                                </span>
                            </span>
                            <span
                                class="diamond diamond-md relative -top-3.5 -right-2 ml-[55.5%] mr-auto cursor-pointer select-none"
                                @click="
                                    ClickModifiableAttr(
                                        { top: 453, left: 1072 },
                                        'fatigue',
                                        1
                                    )
                                "
                            >
                                <span
                                    v-if="
                                        state.player.getModifiedValue(
                                            'fatigue'
                                        ) <= 0
                                    "
                                >-</span
                                >
                                <span
                                    v-if="
                                        state.player.getModifiedValue(
                                            'fatigue'
                                        ) > 0
                                    "
                                >{{
                                    state.player.getModifiedValue('fatigue')
                                }}</span
                                >
                                <span class="absolute top-5 left-1.5 text-xs"
                                >Fatigue</span
                                >
                            </span>
                        </div>
                    </div>
                    <div class="mt-3 flex w-1/2 flex-col justify-between">
                        <span
                            class="text-md mx-auto mb-2 whitespace-pre-line text-center text-red"
                        >Espoir actuel</span
                        >
                        <div class="mr-6 mt-2 flex flex-col">
                            <span
                                class="diamond diamond-md relative top-3.5 -right-2 ml-[55.5%] mr-auto cursor-pointer select-none"
                                @click="
                                    ClickModifiableAttr(
                                        { top: 398, left: 1237 },
                                        'shadows',
                                        1
                                    )
                                "
                            >
                                <span
                                    v-if="
                                        state.player.getModifiedValue(
                                            'shadows'
                                        ) <= 0
                                    "
                                >-</span
                                >
                                <span
                                    v-if="
                                        state.player.getModifiedValue(
                                            'shadows'
                                        ) > 0
                                    "
                                >{{
                                    state.player.getModifiedValue('shadows')
                                }}</span
                                >
                                <span class="absolute -top-4 right-2 text-xs"
                                >Ombres</span
                                >
                            </span>
                            <span
                                class="diamond diamond-lg mx-auto cursor-pointer select-none"
                                @click="
                                    ClickModifiableAttr(
                                        { top: 427, left: 1195 },
                                        'currentHope',
                                        -1
                                    )
                                "
                            >
                                <span>{{
                                    state.player.getModifiedValue('currentHope')
                                }}</span>
                            </span>
                            <span
                                class="diamond diamond-md relative -top-3.5 -right-2 ml-[55.5%] mr-auto cursor-pointer select-none"
                                @click="
                                    ClickModifiableAttr(
                                        { top: 450, left: 1237 },
                                        'sequels',
                                        1
                                    )
                                "
                            >
                                <span v-if="state.player.sequels <= 0">-</span>
                                <span v-if="state.player.sequels > 0">{{
                                    state.player.sequels
                                }}</span>
                                <span class="absolute top-5 left-1.5 text-xs"
                                >Séquelles</span
                                >
                            </span>
                        </div>
                    </div>
                </div>
                <div />
            </div>
            <div class="line-top flex h-1/6 flex-col">
                <span class="text-md mx-auto mb-2 text-center text-red"
                >Etats</span
                >
                <div class="flex px-2">
                    <div class="flex h-full w-1/2 flex-col gap-1">
                        <div class="flex">
                            <span class="square mr-2">
                                <span
                                    v-if="state.player.states.exhaust"
                                    class="absolute h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat"
                                />
                            </span>
                            <span
                                class="my-auto font-serif text-xs font-semibold leading-3"
                            >Epuisé</span
                            >
                        </div>
                        <div class="flex">
                            <span class="square mr-2">
                                <span
                                    v-if="state.player.states.melancholic"
                                    class="absolute h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat"
                                />
                            </span>
                            <span
                                class="my-auto font-serif text-xs font-semibold leading-3"
                            >Mélancolique</span
                            >
                        </div>
                        <div class="flex">
                            <span class="square mr-2">
                                <span
                                    v-if="state.player.states.hurt"
                                    class="absolute h-3 w-3 rotate-45 bg-check bg-cover bg-center bg-no-repeat"
                                />
                            </span>
                            <span
                                class="my-auto font-serif text-xs font-semibold leading-3"
                            >Blessé</span
                            >
                        </div>
                    </div>
                    <div class="flex h-full w-1/2 flex-col">
                        <span
                            class="my-auto font-serif text-xs font-semibold italic leading-3"
                        >Blessure</span
                        >
                        <span class="rect w-24 text-sm">
                            <span v-if="state.player.states.injuries.value > 0">
                                {{
                                    state.player.states.injuries.value +
                                        ' ' +
                                        state.player.states.injuries.unit
                                }}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="line-top flex h-1/5 flex-col">
                <span class="text-md mx-auto mb-2 text-center text-red"
                >Equipement de voyage</span
                >
                <div
                    v-for="(equip, index) in state.player.travelEquipment"
                    :key="index"
                    class="scroll-bar-red flex flex-col overflow-auto text-xs"
                >
                    <span>
                        {{ equip.name }} (
                        <span class="font-semibold">{{
                            state.player.getSkillName(equip.skillRef)
                        }}</span>
                        )
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Vector2Rect } from '@/utils/helpers';
import {
    Identifier,
    IdentifierModifiableAttr,
} from '@/utils/Types/IdentifiedType';
import { PlayerType } from '@/utils/Types/PlayerType';
import { reactive } from 'vue';
import ArmorRow from './ArmorRow.vue';
import HeaderPlayerSheet from './HeaderPlayerSheet.vue';
import SkillRow from './SkillRow.vue';
import TooltipsModifiableValue from './Tooltips/TooltipsModifiableValue.vue';
import TooltipsOneNumberValue from './Tooltips/TooltipsOneNumberValue.vue';
import WeaponRow from './WeaponRow.vue';

type StateClick = 'unknown' | 'simple' | 'double';

const props = defineProps<{
    playerJson?: Object;
}>();

interface State {
    player: PlayerType;
    stateClick: StateClick;
    tooltipPosition: Vector2Rect<string>;
    showTooltips: boolean;
    modifAttr: Identifier | IdentifierModifiableAttr;
}

const state = reactive<State>({
    player: new PlayerType(props.playerJson),
    stateClick: 'unknown' as StateClick,
    tooltipPosition: { top: '0px', left: '0px' },
    showTooltips: false,
    modifAttr: 'currentEndurance',
});

function ClickModifiableAttr(
    position: Vector2Rect<number>,
    identifierModif: Identifier | IdentifierModifiableAttr,
    add: number
) {
    state.modifAttr = identifierModif;

    state.player.setValue(
        identifierModif,
        state.player.getValue(identifierModif) + add
    );

    if (state.stateClick === 'simple') {
        state.stateClick = 'double';
        state.showTooltips = true;
        state.tooltipPosition.top = position.top + 'px';
        state.tooltipPosition.left = position.left + 'px';
    } else {
        state.stateClick = 'simple';
        state.showTooltips = false;
    }

    setTimeout(() => {
        if (state.stateClick === 'simple') {
            state.stateClick = 'unknown';
        }
    }, 200);
}
</script>

<style scoped></style>
