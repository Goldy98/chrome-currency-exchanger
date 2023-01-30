<template>
  <div id="root">
    <div
      v-if="!isEmbedded"
      class="bg-primary w-full py-3 flex-col justify-center"
    >
      <h1 class="text-center font-bold text-white text-lg">
        Currency Converter
      </h1>
    </div>

    <div class="p-4">
      <div class="w-full mt-2">
        <CurrencyForm
          :is-converting="state.isConverting"
          :pre-set-amount="state.selectedNumberFromActivePage"
          :app-is-embedded="isEmbedded"
          :default-from-currency="selection?.currencyCode"
          @submit="onConversionRequest"
        />
      </div>

      <Transition name="fade">
        <div
          v-if="state.sentPayload && state.successResult && !state.errorOccured"
          class="mt-5"
        >
          <Result
            :payload="state.sentPayload"
            :request-result="state.successResult"
          />
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="state.errorOccured" class="mt-2">
          <ConversionError />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { ApiClient, ConversionRequestPayload, ConversionResult } from "./api";
import ConversionError from "./components/ConversionError.vue";
import CurrencyForm from "./components/CurrencyForm.vue";
import Result from "./components/Result.vue";
import { ActivePageEvent, WindowSelection } from "@/constants/types";

type State = {
  isConverting: boolean;
  sentPayload?: ConversionRequestPayload;
  successResult?: ConversionResult;
  errorOccured: boolean;
  selectedNumberFromActivePage?: number;
};

type Props = {
  isEmbedded?: boolean;
  selection?: WindowSelection;
};

const state = reactive<State>({
  isConverting: false,
  errorOccured: false,
});

const props = withDefaults(defineProps<Props>(), {
  isEmbedded: false,
});

// Used only for test purpose
/* async function fakeConversion(payload: ConversionRequestPayload) {
  state.sentPayload = payload;
  state.isConverting = true;

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 3000);
  });

  // state.successResult = {
  //   result: 5675655,
  //   usedRate: 7887.33,
  // };

  state.errorOccured = true;

  state.isConverting = false;
} */

async function onConversionRequest(payload: ConversionRequestPayload) {
  state.sentPayload = payload;
  state.isConverting = true;

  const rawResult = await ApiClient.convert(payload);

  if (rawResult.success) {
    state.successResult = rawResult.data;
  } else {
    state.errorOccured = true;
  }

  state.isConverting = false;
}

onMounted(() => {
  /**
   * Setup a handler for the event emitted when the user
   * select a number from the current page while the extension popup
   * is displayed
   * */
  chrome.runtime.onMessage.addListener((event: ActivePageEvent) => {
    if (event.name === "SelectedNumber") {
      state.selectedNumberFromActivePage = +event.payload;
    }
  });

  if (props.selection)
    state.selectedNumberFromActivePage = props.selection.amount;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#root {
  width: 322px;
}
</style>

<style lang="scss"></style>
