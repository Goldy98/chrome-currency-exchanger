<template>
  <div class="flex items-center">
    <div
      class="currency-flag rounded-full w-10 h-10 mr-2"
      :class="computedCurrencyClass"
    ></div>
    <span>
      {{ pickedCurrency.label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BaseSelectData } from "./forms/BaseSelect.vue";

const props = defineProps<{
  pickedCurrency: BaseSelectData;
}>();

const computedCurrencyClass = computed(
  (): string => `currency-flag-${props.pickedCurrency.value?.toLowerCase()}`
);
</script>

<style scoped></style>
