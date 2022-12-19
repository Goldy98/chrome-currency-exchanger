<template>
  <div class="mb-4">
    <div class="bg-primary w-full px-3 pt-5 pb-4 flex-col justify-center">
      <h1 class="text-center font-bold text-3xl mb-5 text-white">
        Currency Converter
      </h1>
    </div>
    <div class="p-5">
      <CurrencyForm
        @submit="onConversionRequest"
        :is-converting="state.isConverting"
        :pre-set-amount="state.selectedNumberFromActivePage"
      />
    </div>

    <Transition name="fade">
      <div class="mx-5" v-if="state.sentPayload && state.successResult">
        <Result
          :payload="state.sentPayload"
          :request-result="state.successResult"
        />
      </div>

      <div class="mx-5 mt-2" v-else-if="state.errorOccured">
        <ConversionError />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { ApiClient, ConversionRequestPayload, ConversionResult } from "./api";
import ConversionError from "./components/ConversionError.vue";
import CurrencyForm from "./components/CurrencyForm.vue";
import Result from "./components/Result.vue";
import { ActivePageEvent } from "./content";

const { runtime } = chrome;

type State = {
  isConverting: boolean;
  sentPayload?: ConversionRequestPayload;
  successResult?: ConversionResult;
  errorOccured: boolean;
  selectedNumberFromActivePage?: number;
};

const state = reactive<State>({
  isConverting: false,
  errorOccured: false,
});

const apiClient = new ApiClient();

// Used only for test purpose
async function fakeConversion(payload: ConversionRequestPayload) {
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
}

async function onConversionRequest(payload: ConversionRequestPayload) {
  state.sentPayload = payload;
  state.isConverting = true;
  const rawResult = await apiClient.convert(payload);

  if (rawResult.success) {
    state.successResult = rawResult.data;
  } else {
    state.errorOccured = true;
  }

  state.isConverting = false;
}

onMounted(() => {
  chrome.runtime.onMessage.addListener((event: ActivePageEvent) => {
    if (event.name === "SelectedNumber") {
      console.log("*******", event.payload, typeof event.payload);
      state.selectedNumberFromActivePage = +event.payload;
      console.log(
        "state.selectedNumberFromActivePage:",
        state.selectedNumberFromActivePage
      );
    }
  });
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
</style>
