<template>
  <div
      class="relative flex mx-auto relative min-w-[90rem] bg-clip-border bg-origin-border bg-sheet bg-cover bg-center border-t-80 border-b-56 border-red/0">
    <div
        class="absolute w-full -top-20 h-20 bg-topSheet bg-center bg-contain saturate-150 contrast-125 brightness-75"></div>
    <div
        class="absolute w-full -bottom-14 h-16 bg-bottomSheet bg-clip-border bg-origin-border bg-cover bg-center"></div>
    <div class="flex flex-col w-[75.3%] border-l-18 border-red/0 h-full">
      <div class="h-24 w-full">
        <HeaderPlayerSheet :data="state.player.getHeaderValues()" />
      </div>
      <div class="grow flex flex-col w-full double-line-right mb-2">
        <div class="flex flex-col w-full h-full px-1">
          <div class="flex grow relative">
            <span
                class="absolute text-red text-sm top-[32.75%] left-[42%] z-10 bg-yellow px-2 leading-3">COMPETENCES</span>
            <div class="flex flex-col h-full w-1/3 double-line-right pr-1">
              <div class="h-1/3 w-full flex flex-col justify-center">
                <span class="text-red text-lg mx-auto">Corps</span>
                <span class="relative diamond diamond-lg ml-[55.5%] mr-auto top-3.5">
                  <span>{{ state.player.attributes.values.strength }}</span>
                  <span class="absolute text-xs -top-8 left-0">Valeur</span>
                </span>
                <span class="diamond diamond-double diamond-xl mx-auto">
                  <span>{{ state.player.attributes.sr.strength }}</span>
                  <span class="absolute text-xs right-3 -bottom-7">SR</span>
                </span>
                <span class="relative diamond diamond-lg ml-[55.5%] mr-auto -top-3.5">
                  <span>{{ state.player.attributes.secondary.endurance }}</span>
                  <span class="absolute text-xs -top-2 left-9">Endurance</span>
                </span>
              </div>
              <div class="h-1/3 flex flex-col justify-between w-full line-top p-2">
                <SkillRow :favorisable="true"
                          :skill="state.player.strengthSkills.awe" />
                <SkillRow :favorisable="true"
                          :skill="state.player.strengthSkills.athletics" />
                <SkillRow :favorisable="true"
                          :skill="state.player.strengthSkills.awareness" />
                <SkillRow :favorisable="true"
                          :skill="state.player.strengthSkills.hunting" />
                <SkillRow :favorisable="true"
                          :skill="state.player.strengthSkills.song" />
                <SkillRow :favorisable="true"
                          :skill="state.player.strengthSkills.craft" />
              </div>
              <div class="h-1/3 flex flex-col justify-between w-full line-top p-2">
                <span class="text-red">Compétences de combats</span>
                <div class="flex flex-col justify-center gap-1 my-auto">
                  <SkillRow :favorisable="false"
                            :skill="state.player.combatSkills.bows" />
                  <SkillRow :favorisable="false"
                            :skill="state.player.combatSkills.swords" />
                  <SkillRow :favorisable="false"
                            :skill="state.player.combatSkills.axes" />
                  <SkillRow :favorisable="false"
                            :skill="state.player.combatSkills.spears" />
                </div>
              </div>
            </div>
            <div class="flex flex-col h-full w-1/3 double-line-right px-1">
              <div class="h-1/3 w-full flex flex-col justify-center">
                <span class="text-red text-lg mx-auto">C&oelig;ur</span>
                <span class="relative diamond diamond-lg ml-[55.5%] mr-auto top-3.5">
                  <span>{{ state.player.attributes.values.heart }}</span>
                  <span class="absolute text-xs -top-8 left-0">Valeur</span>
                </span>
                <span class="diamond diamond-double diamond-xl mx-auto">
                  <span>{{ state.player.attributes.sr.heart }}</span>
                  <span class="absolute text-xs right-3 -bottom-7">SR</span>
                </span>
                <span class="relative diamond diamond-lg ml-[55.5%] mr-auto -top-3.5">
                  <span>{{ state.player.attributes.secondary.hope }}</span>
                  <span class="absolute text-xs top-0 left-10">Espoir</span>
                </span>
              </div>
              <div class="h-1/3 flex flex-col justify-between w-full line-top p-2">
                <SkillRow :favorisable="true"
                          :skill="state.player.heartSkills.enhearten" />
                <SkillRow :favorisable="true"
                          :skill="state.player.heartSkills.travel" />
                <SkillRow :favorisable="true"
                          :skill="state.player.heartSkills.insight" />
                <SkillRow :favorisable="true"
                          :skill="state.player.heartSkills.healing" />
                <SkillRow :favorisable="true"
                          :skill="state.player.heartSkills.courtesy" />
                <SkillRow :favorisable="true"
                          :skill="state.player.heartSkills.battle" />
              </div>
              <div class="h-1/3 w-full line-top p-2 space-y-2">
                <div class="h-4 w-full flex justify-between">
                  <span class="text-red">Récompenses</span>
                  <span class="relative diamond diamond-md">
                    <span>{{ state.player.valiance.rank }}</span>
                    <span class="absolute text-[0.65rem] font-serif top-5 -left-16">VAILLANCE</span>
                  </span>
                </div>
                <div v-for="reward in state.player.valiance.rewards"
                     :key="reward.identifier"
                     class="w-11/12 text-xs whitespace-normal">
                  <span class="break-words w-full"> {{ reward.name }} ( {{ reward.description }} )</span>
                </div>
              </div>
            </div>
            <div class="flex flex-col h-full w-1/3 pl-1">
              <div class="h-1/3 w-full flex flex-col justify-center">
                <span class="text-red text-lg mx-auto">Esprit</span>
                <span class="relative diamond diamond-lg ml-[55.5%] mr-auto top-3.5">
                  <span>{{ state.player.attributes.values.mind }}</span>
                  <span class="absolute text-xs -top-8 left-0">Valeur</span>
                </span>
                <span class="diamond diamond-double diamond-xl mx-auto">
                  <span>{{ state.player.attributes.sr.mind }}</span>
                  <span class="absolute text-xs right-3 -bottom-7">SR</span>
                </span>
                <span class="relative diamond diamond-lg ml-[55.5%] mr-auto -top-3.5">
                  <span>{{ state.player.attributes.secondary.parade }}</span>
                  <span class="absolute text-xs -top-0 left-10">Parade</span>
                </span>
              </div>
              <div class="h-1/3 flex flex-col justify-between w-full line-top p-2">
                <SkillRow :favorisable="true"
                          :skill="state.player.mindSkills.persuade" />
                <SkillRow :favorisable="true"
                          :skill="state.player.mindSkills.stealth" />
                <SkillRow :favorisable="true"
                          :skill="state.player.mindSkills.scan" />
                <SkillRow :favorisable="true"
                          :skill="state.player.mindSkills.explore" />
                <SkillRow :favorisable="true"
                          :skill="state.player.mindSkills.riddle" />
                <SkillRow :favorisable="true"
                          :skill="state.player.mindSkills.lore" />
              </div>
              <div class="h-1/3 w-full line-top p-2">
                <div class="h-4 w-full flex justify-between">
                  <span class="text-red">Vertus</span>
                  <span class="relative diamond diamond-md">
                    <span> {{ state.player.wisdom.rank }} </span>
                    <span class="absolute text-[0.65rem] font-serif top-3 -left-[3.25rem]">SAGESSE</span>
                  </span>
                </div>
                <div v-for="virtue in state.player.wisdom.virtues"
                     :key="virtue.identifier"
                     class="w-11/12 text-xs whitespace-normal">
                  <span class="break-words w-full"> {{ virtue.name }} ( {{ virtue.description }} )</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex w-full h-1/5 double-line-top mt-1">
            <div class="flex flex-col h-full w-2/3 line-right mt-1 p-2">
              <div class="flex w-full gap-1 font-sansserif font-bold text-[0.6rem] leading-[0.8rem]">
                <span class="grow text-red font-UncialAntiqua font-normal text-base">Attirail de guerre</span>
                <span class="w-1/12 text-center h-2.5 my-auto">Dégats</span>
                <span
                    class="w-1/12 text-center h-2.5 my-auto">Blessure</span>
                <span class="w-1/12 text-center h-2.5 my-auto">Charge</span>
                <span class="w-4/12 h-2.5 my-auto">Notes</span>
              </div>
              <div v-for="n in 4"
                   :key="n"
                   class="flex flex-col grow justify-center">
                <WeaponRow :weapon="state.player.weapons[n]" />
              </div>
            </div>
            <div class="flex flex-col justify-between grow h-full p-2">
              <div>
                <div class="flex w-full gap-1 text-[0.6rem] leading-[0.8rem] mb-1">
                  <span class="grow font-serif font-bold">ARMURE</span>
                  <span class="w-1/5 font-sansserif font-bold text-center h-2.5 my-auto">Protection</span>
                  <span class="w-1/5 font-sansserif font-bold text-center h-2.5 my-auto">Charge</span>
                </div>
                <ArmorRow :armor="state.player.armor" />
                <div class="flex w-full gap-1 text-[0.6rem] leading-[0.8rem]">
                  <span class="grow font-sansserif font-bold">Casque</span>
                </div>
                <ArmorRow :armor="state.player.helm" />
              </div>
              <div>
                <div class="flex w-full gap-1 text-[0.6rem] leading-[0.8rem] mb-1">
                  <span class="grow font-serif font-bold">BOUCLIER</span>
                  <span class="w-1/5 font-sansserif font-bold text-center h-2.5 my-auto">Parade</span>
                  <span class="w-1/5 font-sansserif font-bold text-center h-2.5 my-auto">Charge</span>
                </div>
                <ArmorRow :armor="state.player.shield" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col w-[24.7%] border-r-18 border-red/0 h-full px-1">
      <div class="flex flex-col h-1/3 p-3">
        <div class="h-full w-full simple-border"></div>
      </div>
      <div class="flex flex-col grow">
        <div class="flex">
          <div class="w-1/3 flex flex-col justify-center">
            <span class="text-red text-xs mx-auto mb-2 whitespace-pre-line text-center">Points d'aventure</span>
            <span class="diamond diamond-md mx-auto">
              <span>0</span>
            </span>
          </div>
          <div class="w-1/3 flex flex-col justify-center">
            <span class="text-red text-xs mx-auto mb-2 whitespace-pre-line text-center">Points de progression</span>
            <span class="diamond diamond-md mx-auto">
              <span>0</span>
            </span>
          </div>
          <div class="w-1/3 flex flex-col justify-center">
            <span
                class="text-red text-xs mx-auto mb-2 whitespace-pre-line text-center">Points de communauté</span>
            <span class="diamond diamond-md mx-auto">
              <span>5</span>
            </span>
          </div>
        </div>
        <div class="flex grow py-8">
          <div class="w-1/2 flex flex-col justify-between">
            <span class="text-red text-md mx-auto mb-2 whitespace-pre-line text-center">Endurance actuelle</span>
            <div class="flex flex-col mr-6 mt-2">
              <span class="relative diamond diamond-md ml-[55.5%] mr-auto top-3.5 -right-2">
                <span>{{ getWeight() }}</span>
                <span class="absolute text-xs -top-4 right-2">Charge</span>
              </span>
              <span class="diamond diamond-lg mx-auto">
                <span>{{ state.player.currentEndurance.value }}</span>
              </span>
              <span class="relative diamond diamond-md ml-[55.5%] mr-auto -top-3.5 -right-2">
                <span v-if="state.player.fatigue.value <= 0">-</span>
                <span v-if="state.player.fatigue.value > 0">{{ state.player.fatigue.value }}</span>
                <span class="absolute text-xs top-5 left-1.5">Fatigue</span>
              </span>
            </div>
          </div>
          <div class="w-1/2 flex flex-col justify-between mt-3">
            <span class="text-red text-md mx-auto mb-2 whitespace-pre-line text-center">Espoir actuel</span>
            <div class="flex flex-col mr-6 mt-2">
              <span class="relative diamond diamond-md ml-[55.5%] mr-auto top-3.5 -right-2">
                <span v-if="state.player.shadows.value <= 0">-</span>
                <span v-if="state.player.shadows.value > 0">{{ state.player.shadows.value }}</span>
                <span class="absolute text-xs -top-4 right-2">Ombres</span>
              </span>
              <span class="diamond diamond-lg mx-auto">
                <span>{{ state.player.currentHope.value }}</span>
              </span>
              <span class="relative diamond diamond-md ml-[55.5%] mr-auto -top-3.5 -right-2">
                <span v-if="state.player.sequels.value <= 0">-</span>
                <span v-if="state.player.sequels.value > 0">{{ state.player.sequels.value }}</span>
                <span class="absolute text-xs top-5 left-1.5">Séquelles</span>
              </span>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div class="flex flex-col h-1/6 line-top">
        <span class="text-red text-md mx-auto mb-2 text-center">Etats</span>
        <div class="flex px-2">
          <div class="w-1/2 h-full flex flex-col gap-1">
            <div class="flex">
              <span class="square mr-2">
                <span v-if="state.player.states.exhaust"
                      class="absolute rotate-45 bg-check w-3 h-3 bg-cover bg-center bg-no-repeat"></span>
              </span>
              <span class="font-serif text-xs my-auto leading-3 font-semibold">Epuisé</span>
            </div>
            <div class="flex">
              <span class="square mr-2">
                <span v-if="state.player.states.melancholic"
                      class="absolute rotate-45 bg-check w-3 h-3 bg-cover bg-center bg-no-repeat"></span>
              </span>
              <span class="font-serif text-xs my-auto leading-3 font-semibold">Mélancolique</span>
            </div>
            <div class="flex">
              <span class="square mr-2">
                <span v-if="state.player.states.hurt"
                      class="absolute rotate-45 bg-check w-3 h-3 bg-cover bg-center bg-no-repeat"></span>
              </span>
              <span class="font-serif text-xs my-auto leading-3 font-semibold">Blessé</span>
            </div>
          </div>
          <div class="w-1/2 h-full flex flex-col">
            <span class="font-serif text-xs my-auto leading-3 font-semibold italic">Blessure</span>
            <span class="rect w-24 text-sm">
              <span v-if="state.player.states.injuries.value > 0">
                {{ state.player.states.injuries.value + ' ' + state.player.states.injuries.unit }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="flex flex-col h-1/5 line-top">
        <span class="text-red text-md mx-auto mb-2 text-center">Equipement de voyage</span>
        <div v-for="(equip, index) in state.player.travelEquipment"
             :key="index"
             class="flex flex-col text-xs overflow-auto scroll-bar-red">
          <span>{{ equip.name }} ( {{ equip.skillRef }} )</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SkillRow from "./SkillRow.vue"
import WeaponRow from "./WeaponRow.vue"
import ArmorRow from "./ArmorRow.vue"
import HeaderPlayerSheet from "./HeaderPlayerSheet.vue"
import {PlayerType} from "@/utils/Types/PlayerType"
import {reactive} from "vue"

const props = defineProps<{
  playerJson?: Object
}>()

const state = reactive({
  player: new PlayerType(props.playerJson)
})

function getWeight() {
  return state.player.weapons.map(a => a.weight).reduce((a, b) => a + b, 0) + state.player.armor.weight + state.player.helm.weight + state.player.shield.weight
}

// }
</script>

<style scoped>

</style>