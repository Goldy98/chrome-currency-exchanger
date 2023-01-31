<template>
  <div class="flex items-center">
    <div
      class="currency-flag rounded-full w-10 h-10 mr-2"
      :style="`background-image: url(${computedCurrencyFlagUrl})`"
    ></div>
    <span class="opacity-80 text-black text-xs">
      {{ pickedCurrency.label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CurrencySelectorData } from "./forms/CurrencySelector.vue";

const CURRENCY_FLAGS_BASE_URL =
  "https://wise.com/public-resources/assets/flags/rectangle/";

// Wise doesn't provide flags for bitcoin
const BITCOIN_IMG_URL =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png";

const props = defineProps<{
  pickedCurrency: CurrencySelectorData;
}>();

const computedCurrencyFlagUrl = computed((): string => {
  if (props.pickedCurrency.value === "BTC") return BITCOIN_IMG_URL;
  return `${CURRENCY_FLAGS_BASE_URL}${props.pickedCurrency.value?.toLowerCase()}.png`;
});
</script>

<style scoped></style>
