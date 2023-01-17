<template>
  <div>
    <BaseInput
      v-model="state.amount"
      :min="1"
      name="amount"
      :type="BaseInputType.NUMBER"
      label="Amount"
      required
    />

    <CurrencySelector
      class="mt-5 h-20"
      name="from"
      label="From"
      :data="currencyDataForSelect"
      required
      @change="(choice) => (state.fromCurrency = choice)"
    >
      <template #choosenItem>
        <PickedCurrencyInfo
          v-if="state.fromCurrency"
          :picked-currency="state.fromCurrency"
        />
      </template>
    </CurrencySelector>

    <div class="flex items-center justify-center mt-9">
      <img
        :src="sortingArrowUrl"
        alt=""
        srcset=""
        class="w-[20px] cursor-pointer"
        @click="invertCurrency"
      />
    </div>

    <CurrencySelector
      name="to"
      label="To"
      :data="currencyDataForSelect"
      required
      class="h-20"
      @change="(choice) => (state.toCurrency = choice)"
    >
      <template #choosenItem>
        <PickedCurrencyInfo
          v-if="state.toCurrency"
          :picked-currency="state.toCurrency"
        />
      </template>
    </CurrencySelector>

    <div class="mt-10">
      <VButton
        label="Convert"
        :disabled="!state.canSubmit || isConverting"
        :loading="isConverting"
        class="h-[55px]"
        @click="submitAttempt"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, reactive, watch } from "vue";
import { ConversionRequestPayload } from "@/api";
import SortingArrow from "@/assets/sorting-arrows.png";
import BaseInputType from "@/constants/types";
import {
  currencyDataForSelect,
  CurrencyKey,
} from "@/constants/supported-currency";
import BaseInput from "./forms/BaseInput.vue";
import CurrencySelector, {
  CurrencySelectorData,
} from "./forms/CurrencySelector.vue";
import PickedCurrencyInfo from "./PickedCurrencyInfo.vue";
import VButton from "./VButton.vue";

type State = {
  fromCurrency: null | CurrencySelectorData;
  toCurrency: null | CurrencySelectorData;
  canSubmit: ComputedRef<boolean>;
  amount: number;
};

type Props = {
  isConverting: boolean;
  preSetAmount?: number;
  appIsEmbedded: boolean;
};

const props = defineProps<Props>();

// const sortingArrowUrl = chrome.runtime.getURL(SortingArrow);
const sortingArrowUrl = SortingArrow;

const state = reactive<State>({
  fromCurrency: null,
  toCurrency: null,
  amount: 1,
  canSubmit: computed(
    (): boolean => !!(state.fromCurrency && state.toCurrency)
  ),
});

watch(
  () => props.preSetAmount,
  (newVal) => {
    if (newVal) state.amount = newVal;
  },
  {
    immediate: true,
  }
);

const emits = defineEmits<{
  (e: "submit", payload: ConversionRequestPayload): void;
}>();

function submitAttempt() {
  if (state.canSubmit) {
    emits("submit", {
      to: state.toCurrency!.value as CurrencyKey,
      from: state.fromCurrency!.value as CurrencyKey,
      amount: state.amount,
    });
  }
}

function invertCurrency() {
  const tmpFromCurrency = state.fromCurrency;

  state.fromCurrency = state.toCurrency;
  state.toCurrency = tmpFromCurrency;
}
</script>
