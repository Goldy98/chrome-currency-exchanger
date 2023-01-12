<template>
  <button
    class="w-full rounded-md font-bold text-sm leading-5 px-3 py-1 bg-secondary"
    :class="dynamicClasses"
    :disabled="disabled"
  >
    <div v-if="loading" class="flex justify-center align-middle">
      <CircularLoader class="w-10 h-10" />
    </div>

    <slot v-else-if="hasContentSlot()" name="content"> </slot>

    <div v-else class="text-center text-montSerrat">
      <span :class="labelClass">{{ labelComputed }}</span>
    </div>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import CircularLoader from "./icons/CircularLoader.vue";

export default defineComponent({
  name: "VButton",
  components: { CircularLoader },
  props: {
    label: {
      type: String,
      default: "",
    },
    labelColor: {
      type: String,
      default: "white",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    buttonHeight: {
      type: Number,
      default: 42,
    },
    customBgColor: {
      type: String,
      default: "",
    },
    isBorderLined: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const hasContentSlot = ref(() => slots.content !== undefined);

    const dynamicClasses = computed((): string => {
      const colorToUse = props.customBgColor || "secondary";
      return `bg-${props.disabled ? "disabledButton" : colorToUse}`;
    });

    const labelClass = computed((): string => {
      return `text-${props.labelColor}`;
    });

    const labelComputed = computed((): string => props.label || "");

    return {
      hasContentSlot,
      dynamicClasses,
      labelClass,
      labelComputed,
      // onClick,
    };
  },
});
</script>
