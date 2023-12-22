<template>
    <div class="relative flex w-full gap-1 font-sansserif text-[0.6rem] font-bold leading-[0.8rem]">
        <span
            :class="{ 'cursor-pointer hover:bg-slate-200/40': props.player && props.weapon?.name !== '' }"
            class="relative flex my-auto h-[1.125rem] grow rounded"
            @click="tryChangeHover">
            {{
                props.weapon?.name +
                    (props.weapon?.rewardsMod.length > 0
                        ? ' ( ' + getRewardsNames() + ' )'
                        : '')
            }}
            <div
                v-if="props.player && props.weapon?.name !== '' && state.hover"
                class="flex flex-col absolute right-0 -top-2.5 z-50 text-2xs text-black font-sansserif font-semibold leading-4 bg-white w-20 rounded border border-gray/40 p-3 shadow-md after:absolute after:content-[''] after:h-4 after:w-4 after:-rotate-45 after:-left-[0.54rem] after:border-l after:border-t after:rounded-tl after:border-gray/40 after:bg-white"
                @click.stop="tryChangeHover">
                <span class="pl-2 rounded hover:bg-slate-200" @click.stop="tryRemove">Jeter</span>
            </div>
            <BottomGrayLine />
        </span>
        <span
            :class="{ 'w-1/12': !props.hideNote, 'w-1/6': props.hideNote }"
            class="relative flex my-auto h-[1.125rem] justify-center">
            {{
                props.weapon?.name !== '' ? props.weapon.getModifiedValue('weaponDamage') : ''
            }}
            <BottomGrayLine />
        </span>
        <span
            :class="{ 'w-1/12': !props.hideNote, 'w-1/6': props.hideNote }"
            class="relative flex my-auto h-[1.125rem] justify-center">
            {{
                props.weapon?.name !== '' ?
                    props.weapon.getModifiedValue('weaponInjuryOneHand') === props.weapon.getModifiedValue('weaponInjuryTwoHand')
                        ? props.weapon.getModifiedValue('weaponInjuryOneHand')
                        : props.weapon.getModifiedValue('weaponInjuryOneHand') + ' / ' + props.weapon.getModifiedValue('weaponInjuryTwoHand')
                    : ''
            }}
            <BottomGrayLine />
        </span>
        <span
            :class="{ 'w-1/12': !props.hideNote, 'w-1/6': props.hideNote }"
            class="relative flex my-auto h-[1.125rem] justify-center">
            {{
                props.weapon?.name !== '' ? props.weapon.weight : ''
            }}
            <BottomGrayLine />
        </span>
        <span v-if="!props.hideNote" class="relative flex my-auto h-[1.125rem] w-4/12">
            {{
                props.weapon.note
            }}
            <BottomGrayLine />
        </span>
    </div>
</template>

<script lang="ts" setup>
import {WeaponType} from "../../utils/Types/WeaponType";
import {PlayerType} from "../../utils/Types/PlayerType";
import {HoverSingleton} from "../../utils/helpers";
import {reactive} from "vue";
import BottomGrayLine from "../LineComponent/BottomGrayLine.vue";

interface Props {
    player: PlayerType;
    hideNote: boolean;
    weapon?: WeaponType;
}

const props = withDefaults(defineProps<Props>(), {
    weapon: () => new WeaponType({})
});

interface State {
    hover: boolean;
}

const state = reactive<State>({
    hover: false
});

const tryChangeHover = () => {
    if (props.player && props.weapon.name !== '') {

        state.hover = HoverSingleton.GetInstance().tryChangeHover(state.hover, () => {
            state.hover = false;
        });
    }
};

const tryRemove = () => {
    if (props.player && props.weapon.name !== '') {
        tryChangeHover();
        props.player.removeWeapon(props.weapon);
        props.player.saveOnDb();
    }
};

const getRewardsNames = () => {
    return props.weapon?.rewardsMod.map(el => el.getChosen().name.match(/^[\w\s\u00C0-\u017F]*/)).join(', ');
};

</script>

<style scoped></style>
