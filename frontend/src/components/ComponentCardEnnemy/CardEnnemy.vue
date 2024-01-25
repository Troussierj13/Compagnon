<template>
  <div class="flex justify-center space-x-16 select-none">
    <div
        @click="state.showVerso = !state.showVerso"
        class="perspective flex my-auto w-[30vw] min-w-[20em] max-w-[30em] aspect-25/35">
      <!-- Card container with flip logic -->
      <div v-show="props.entity.isHorde">
        <div class="absolute rotate-[8deg] translate-x-12 -translate-y-2 card-face front flex my-auto w-[30vw] min-w-[20em] max-w-[30em] aspect-25/35">
          <div class="border-gradient-red"></div>
          <div class="relative ring-2 ring-slate-900/5">
            <div class="relative w-[30vw] min-w-[20em] max-w-[30em] aspect-25/35 rounded bg-cardLayoutFront bg-cover bg-clip-border bg-center bg-origin-border">
            </div>
          </div>
        </div>
        <div class="absolute -rotate-[8deg] -translate-x-12 -translate-y-2 card-face front flex my-auto w-[30vw] min-w-[20em] max-w-[30em] aspect-25/35">
          <div class="border-gradient-red"></div>
          <div class="relative ring-2 ring-slate-900/5">
            <div class="relative w-[30vw] min-w-[20em] max-w-[30em] aspect-25/35 rounded bg-cardLayoutFront bg-cover bg-clip-border bg-center bg-origin-border">
            </div>
          </div>
        </div>
      </div>
      <div
          class="card flex my-auto w-[30vw] min-w-[20em] max-w-[30em] aspect-25/35"
           :class="{'is-flipped': state.showVerso}">
        <!-- Recto View -->
        <div id="recto" class="relative card-face front flex my-auto w-[30vw] min-w-[20em] max-w-[30em] aspect-25/35">
          <div class="border-gradient-red"></div>
          <div class="relative ring-2 ring-slate-900/5">
            <div class="relative w-[30vw] min-w-[20em] max-w-[30em] rounded aspect-25/35 bg-cardLayoutFront bg-cover bg-clip-border bg-center bg-origin-border">
              <div class="flex w-full h-[57%] pt-8 justify-center">
                <img src="/card_illu/sbire_culte_Morgoth.png" alt="Illustration of ennemy card" class="h-[90%] my-auto aspect-square">
              </div>
              <div class="flex w-full h-[13%] justify-center items-center">
                <span class="relative text-xl -top-0.5 -left-0.5 transition-all"  :class="{'blur-sm': !props.visibility.lvlAttribute}">{{props.entity.lvlAttribute}}</span>
              </div>
              <div class="w-full h-[24%] ">
                <div class="h-full flex flex-col justify-between items-center">
                  <div class="flex flex-col items-center space-y-2">
                    <div class="flex flex-col items-center">
                      <div class="font-bold transition-all" :class="{'blur-sm': !props.visibility.name}">
                        {{props.entity.name}}
                        <span v-show="props.entity.isHorde"> x{{props.entity.nbrOnHorde}}</span>
                      </div>
                      <div v-show="!props.entity.isHorde" class="text-xs transition-all" :class="{'blur-sm': !props.visibility.surname}">
                        {{props.entity.surname}}
                      </div>
                    </div>
                    <div class="text-xs font-sansserif font-bold text-center mx-6 transition-all" :class="{'blur-sm': !props.visibility.description}">{{props.entity.description}}</div>
                  </div>
                  <div class="text-xs font-sansserif font-black transition-all" :class="{'blur-sm': !props.visibility.characteristicsName}">{{props.entity.characteristicsName.join(', ')}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="verso" class="relative card-face back flex my-auto w-[30vw] min-w-[20em] max-w-[30em]  aspect-25/35 ">
          <div class="border-gradient-red"></div>
          <div class="relative ring-2 ring-slate-900/5">
            <div class="relative w-[30vw] min-w-[20em] max-w-[30em] rounded aspect-25/35 bg-cardLayoutBack bg-cover bg-clip-border bg-center bg-origin-border">
              <div class="relative flex flex-col w-full top-[9%] h-[6%] text-xs 2xl:text-base">
                <div class="relative flex w-full my-auto">
                  <span class="relative left-[7.5%]">Endu.</span>
                  <span class="absolute left-[28%]">Pui.</span>
                  <span class="absolute left-[45%]">Haine</span>
                  <span class="absolute left-[62%]">Parade</span>
                  <span class="absolute left-[80.5%]">Armure</span>
                </div>
              </div>
              <div class="relative flex flex-col w-full top-[9%] h-[9.3%]">
                <div class="relative flex w-full h-full pl-[6.3%] pr-[5.6%] justify-between text-xs lg:text-lg xl:text-xl">
                  <div class="flex justify-center w-[15.1%]"><span class="relative flex my-auto -top-1 transition-all" :class="{'blur-sm': !props.visibility.endurance}">{{props.entity.endurance}}</span></div>
                  <div class="flex justify-center w-[15.1%]"><span class="relative flex my-auto -top-1 transition-all" :class="{'blur-sm': !props.visibility.power}">{{props.entity.power}}</span></div>
                  <div class="flex justify-center w-[15.1%]"><span class="relative flex my-auto -top-1 -left-0.5 transition-all" :class="{'blur-sm': !props.visibility.valueHM}">{{props.entity.valueHM}}</span></div>
                  <div class="flex justify-center w-[15.1%]"><span class="relative flex my-auto -top-0.5 -left-0.5 transition-all" :class="{'blur-sm': !props.visibility.parade}">+{{props.entity.parade}}</span></div>
                  <div class="flex justify-center w-[15.1%]"><span class="relative flex my-auto -top-1 -left-0.5 transition-all" :class="{'blur-sm': !props.visibility.armor}">{{props.entity.armor}}</span></div>
                </div>
              </div>
              <div class="relative flex flex-col top-[9%] mt-8 mx-6">
                <span class="w-full text-center">Attaques</span>
                <div class="relative grid grid-cols-7 my-2 text-xs xl:text-sm font-sansserif font-bold">
                  <span class="col-span-2">Nom</span>
                  <span class="mx-auto">Rang</span>
                  <span class="mx-auto">Dégats</span>
                  <span class="mx-auto">Blessure</span>
                  <span class="col-span-2 mx-auto">Dégats spé.</span>
                </div>
                <div v-for="(weapon, weaponIndex) in props.entity.weapons" :key="weaponIndex" class="relative grid grid-cols-7 text-xs xl:text-sm font-sansserif">
                  <span class="col-span-2 transition-all" :class="{'blur-sm': !props.visibility.weapons[weaponIndex]}">{{weapon.name}}</span>
                  <span class="mx-auto transition-all" :class="{'blur-sm': !props.visibility.weapons[weaponIndex]}">{{weapon.level}}</span>
                  <span class="mx-auto transition-all" :class="{'blur-sm': !props.visibility.weapons[weaponIndex]}">{{weapon.damage}}</span>
                  <span class="mx-auto transition-all" :class="{'blur-sm': !props.visibility.weapons[weaponIndex]}">{{weapon.injury}}</span>
                  <span class="col-span-2 mx-auto transition-all" :class="{'blur-sm': !props.visibility.weapons[weaponIndex]}">{{weapon.specialDamage.join(', ')}}</span>
                  <BottomGrayLine :class="{'blur-sm': !props.visibility.weapons[weaponIndex]}"/>
                </div>
              </div>
              <div class="relative flex flex-col mt-28 h-[20%] mx-6">
                <span class="w-full text-center">Capacités</span>
                <div class="relative grid grid-cols-6 my-2 text-xs xl:text-sm font-sansserif font-bold">
                  <span>Nom</span>
                  <span class="col-span-5">Effet</span>
                </div>
                <div v-for="(spe, speIndex) in props.entity.specifications" :key="speIndex" class="relative grid grid-cols-6 text-xs xl:text-sm font-sansserif">
                  <span class="transition-all" :class="{'blur-sm': !props.visibility.specifications[speIndex]}">{{spe.split(': ')[0] || ''}}</span>
                  <span class="col-span-5 transition-all" :class="{'blur-sm': !props.visibility.specifications[speIndex]}">{{spe.split(': ')[1] || ''}}</span>
                  <BottomGrayLine :class="{'blur-sm': !props.visibility.specifications[speIndex]}"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {NtagData} from "../../utils/EncryptNtag";
import BottomGrayLine from "../LineComponent/BottomGrayLine.vue";
import {reactive} from "vue";
import {VisibilityEntity} from "../../utils/Types/Entity";

interface Props {
  entity: NtagData;
  visibility: VisibilityEntity;
}

interface State {
  showVerso: Boolean
}

const props = defineProps<Props>();
const state = reactive<State>({
  showVerso: false
});

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

.perspective {
  perspective: 1000px;
}
.card {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.card.is-flipped {
  transform: rotateY(180deg);
}
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}
.card-face.front {
  /* Front face styling */
}
.card-face.back {
  transform: rotateY(180deg);
  /* Back face styling */
}
</style>
