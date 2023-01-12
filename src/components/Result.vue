<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex flex-col text-center bg-lightGreen p-2 rounded-xl">
    <span class="text-black">Results</span>
    <h1 class="font-bold text-3xl text-secondaryBlack">
      {{ requestResult.result }}
    </h1>
    <h2 class="font-semibold text-deepBlue text-sm">({{ detailText }})</h2>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ConversionRequestPayload, ConversionResult } from "@/api";

const props = defineProps<{
  payload: ConversionRequestPayload;
  requestResult: ConversionResult;
}>();

const detailText = computed((): string => {
  return `1 ${props.payload.from} = ${props.requestResult.usedRate} ${props.payload.to}`;
});
</script>
