<template>
  <div>
    <BaseInput
      :min="1"
      name="amount"
      :type="BaseInputType.NUMBER"
      label="Amount"
      v-model="state.amount"
      required
    />

    <BaseSelect
      class="mt-5 h-20"
      name="from"
      label="From"
      :data="currencyDataForSelect"
      @change="(choice) => (state.fromCurrency = choice)"
      required
    >
      <template #choosenItem>
        <PickedCurrencyInfo
          :picked-currency="state.fromCurrency"
          v-if="state.fromCurrency"
        />
      </template>
    </BaseSelect>

    <div class="flex items-center justify-center mt-9">
      <img
        src="@/assets/sorting-arrows.png"
        alt=""
        srcset=""
        class="w-[20px] cursor-pointer"
        @click="invertCurrency"
      />
    </div>

    <BaseSelect
      name="to"
      label="To"
      :data="currencyDataForSelect"
      @change="(choice) => (state.toCurrency = choice)"
      required
      class="h-20"
    >
      <template #choosenItem>
        <PickedCurrencyInfo
          :picked-currency="state.toCurrency"
          v-if="state.toCurrency"
        />
      </template>
    </BaseSelect>

    <div class="mt-10">
      <VButton
        label="Convert"
        :disabled="!state.canSubmit || isConverting"
        :loading="isConverting"
        @click="submitAttempt"
        class="h-[55px]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInputType from "@/constants/input-type";
import {
  currencyDataForSelect,
  CurrencyKey,
} from "@/constants/supported-currency";
import { computed, reactive, ComputedRef, watch } from "vue";
import BaseInput from "./forms/BaseInput.vue";
import BaseSelect, { BaseSelectData } from "./forms/BaseSelect.vue";
import PickedCurrencyInfo from "./PickedCurrencyInfo.vue";
import VButton from "./VButton.vue";
import { ConversionRequestPayload } from "@/api";

type State = {
  fromCurrency: null | BaseSelectData;
  toCurrency: null | BaseSelectData;
  canSubmit: ComputedRef<boolean>;
  amount: number;
};

type Props = {
  isConverting: boolean;
  preSetAmount?: number;
};

const props = defineProps<Props>();

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

<style scoped></style>
