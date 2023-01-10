<template>
  <div>
    <div
      v-if="!isEmbedded"
      class="bg-primary w-full px-3 pt-5 pb-4 flex-col justify-center"
    >
      <h1 class="text-center font-bold text-3xl mb-5 text-white">
        Currency Converter
      </h1>
    </div>

    <div class="p-5">
      <div class="w-full mt-2">
        <CurrencyForm
          @submit="onConversionRequest"
          :is-converting="state.isConverting"
          :pre-set-amount="state.selectedNumberFromActivePage"
          :app-is-embedded="isEmbedded"
        />
      </div>

      <Transition name="fade">
        <div class="mt-5" v-if="state.sentPayload && state.successResult">
          <Result
            :payload="state.sentPayload"
            :request-result="state.successResult"
          />
        </div>
        <!-- <div class="mt-2">
        <Result
        :payload="{ amount: 234, from: 'XOF', to: 'XOF' }"
        :request-result="{ result: 400, usedRate: 34 }"
        />
      </div> -->
      </Transition>

      <div class="mt-2" v-if="state.errorOccured">
        <ConversionError />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { ApiClient, ConversionRequestPayload, ConversionResult } from "./api";
import ConversionError from "./components/ConversionError.vue";
import CurrencyForm from "./components/CurrencyForm.vue";
import Result from "./components/Result.vue";
import { ActivePageEvent } from "./content";

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

const props = withDefaults(
  defineProps<{
    isEmbedded?: boolean;
    preSetAmount?: number;
  }>(),
  {
    isEmbedded: false,
  }
);

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
  /**
   * Setup a handler for the event emitted when the user
   * select a number from the current page while the extension popup
   * is displayed
   **/
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

  if (props.preSetAmount)
    state.selectedNumberFromActivePage = props.preSetAmount;
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

<style lang="scss"></style>
