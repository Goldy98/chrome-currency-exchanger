<template>
  <div data-widget-item="baseinput" class="BaseInputComponent">
    <label
      v-if="label"
      class="text-sm text-left leading-[1.125rem] -tracking-[0.1px] opacity-80 text-black font-semibold mb-2"
      :for="name"
    >
      <span>{{ label }}</span
      >&thinsp;<span
        v-if="required"
        class="red text-left font-semibold opacity-80 text-xs leading-5"
        >*</span
      >
    </label>

    <div
      class="bg-white baseinput-core rounded-lg px-4 py-[0.688rem] border border-[#858C94] h-[40px]"
      :class="{ error: hasError, success: hasSuccess }"
    >
      <!-- type number input -->
      <input
        :id="name"
        :placeholder="placeholder"
        class="border-0 outline-none appearance-none flex-shrink w-full h-full bg-transparent text-black text-montSerrat opacity-80 font-black"
        type="number"
        autocomplete="false"
        spellcheck="false"
        :name="name"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        @input="emitUpdateEvent($event)"
      />
    </div>

    <!-- error message -->
    <div
      v-if="hasError"
      class="rounded-lg w-full flex flex-row space-x-1 py-1.5 px-2 mt-2 items-center select-none"
    >
      <span class="inline-flex flex-shrink-0">
        <RedInfoIcon />
      </span>
      <span class="text-xs text-danger font-medium">{{
        errorMessage || "Required field"
      }}</span>
    </div>

    <!-- success message -->
    <div
      v-if="hasSuccess"
      class="rounded-lg w-full bg-primary-light flex flex-row space-x-1 py-1.5 px-2 mt-2 items-center select-none"
    >
      <span class="inline-flex flex-shrink-0">
        <GreenInfoIcon />
      </span>
      <span class="text-xs text-primary font-medium">{{
        successMessage || ""
      }}</span>
    </div>

    <!-- any slot -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults, ref } from "vue";
import {
  applyMinMaxValidationForNumber,
  applyRequiredValidation,
} from "./validation-helper";
import GreenInfoIcon from "../icons/GreenInfoIcon.vue";
import RedInfoIcon from "../icons/RedInfoIcon.vue";

interface Props {
  cinput?: string;
  modelValue?: String | Number;
  label?: string;
  hasSuccess?: boolean;
  successMessage?: string;
  errorMessage?: string;
  placeholder?: string;
  name: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const props = withDefaults(defineProps<Props>(), {
  cinput: "py-3",
  label: "",
  hasSuccess: false,
  successMessage: "",
  errorMessage: "",
  placeholder: "",
  required: false,
});

const errorMessage = computed((): string => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const checkResult = validateInput(props.modelValue as string);
  if (checkResult === true) return "";
  return checkResult;
});

const hasError = computed((): boolean => {
  return errorMessage.value !== "";
});

const emit = defineEmits<{
  (e: "update:modelValue", target: any): void;
  (e: "change", target: any): void;
}>();

function validateInput(value: string) {
  let result: boolean | string = true;
  if (props.required) result = applyRequiredValidation(value);

  if (result !== true) return result;

  return applyMinMaxValidationForNumber(value, props.min, props.max);
}

function emitUpdateEvent(event: Event) {
  emit("update:modelValue", (event.target as any).value);
  emit("change", (event.target as any).value);
}
</script>

<style scoped lang="scss">
.BaseInputComponent {
  ::placeholder {
    font-weight: 600;
    color: #6d7580;
  }

  .error {
    background: #feefef;
    border: 1px solid #da1414;
  }

  .success {
    background: #edf9f0;
    border: 1px solid #287d3c;
  }

  .error input {
    -webkit-box-shadow: 0 0 0px 1000px #feefef inset !important;
  }

  .success input {
    -webkit-box-shadow: 0 0 0px 1000px #edf9f0 inset !important;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }

  input::-ms-reveal,
  input::-ms-clear {
    display: none;
  }

  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
}
</style>
