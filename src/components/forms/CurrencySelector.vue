<template>
  <div
    ref="select_slotted"
    data-widget-item="select-slotted"
    class="select-none relative CurrencySelectorComponent"
  >
    <!--label-->
    <span
      v-if="label"
      class="block text-sm text-black leading-[1.125rem] -tracking-[0.1px] opacity-80 font-semibold mb-2"
    >
      <span>{{ label }}</span
      >&thinsp;<span
        v-if="required"
        class="text-left text-DA1414 font-semibold opacity-80 text-xs leading-5"
        style="color: #da1414"
        >*</span
      >
    </span>
    <!--select button-->
    <div
      ref="select_slotted_button"
      class="h-[50px] rounded-lg border px-4 py-[0.688rem] bg-white flex items-center justify-between cursor-pointer border-[#858C94]"
      :class="{ error: hasError }"
      @click="toggle"
    >
      <div
        class="inline-flex items-center flex-row space-x-1 flex-shrink-0 text-ellipsis overflow-hidden w-[90%] flex-wrap"
        :class="{
          '': !searchable,
          'w-full': searchable,
        }"
      >
        <!-- custom icon -->
        <span v-if="$slots.icon" class="inline-flex flex-shrink-0">
          <slot name="icon" />
        </span>

        <div v-else class="w-full flex flex-wrap">
          {{ textClass }}
          <span v-if="!isAvailableSlot('choosenItem')" :class="textClass">
            {{ state.actualSelection?.label || emptyLabel }}
          </span>
          <slot
            v-else-if="isAvailableSlot('choosenItem')"
            name="choosenItem"
          ></slot>
        </div>
      </div>
      <!-- custom arrow needed ? -->
      <span
        v-if="$slots.arrow && !searchable"
        class="inline-flex flex-shrink-0"
      >
        <slot name="arrow" />
      </span>
      <span v-else-if="!searchable" class="inline-flex flex-shrink-0">
        <DropDownIcon />
      </span>
    </div>

    <!--select dropdown-->
    <div
      v-if="state.show && showDefaultSelector"
      ref="select_slotted_options"
      class="select_slotted_options w-full rounded border border-white bg-white absolute mt-[0.281rem] z-[999999]"
      data-widget-item="select_slotted_group"
    >
      <div>
        <!-- Search Input -->
        <div v-if="searchable" class="py-2 px-3">
          <BaseInput
            v-model="state.searchValue"
            name="SeachCurrency"
            height-class="h-5"
            :required="false"
            :type="BaseInputType.TEXT"
            placeholder="Search for currency"
          >
            <template #icon>
              <SearchIcon />
            </template>
          </BaseInput>
        </div>

        <!-- Empty Text -->
        <div v-if="!state.hasAvailableData" class="text-center p-5">
          <span>No results</span>
        </div>

        <!-- Select Options -->
        <div
          v-for="(choice, index) in state.dataToUse"
          :key="index"
          class="item w-full py-2 px-4 cursor-pointer text-left hover:bg-hoverColor select-item"
          @click.prevent.stop="choose(choice)"
        >
          <span class="font-semibold text-xs text-394452">
            {{ choice.label }}
          </span>
        </div>
      </div>
    </div>
    <!---->

    <!-- error message -->
    <div
      v-if="hasError"
      :data-form-novalidate="hasError"
      class="rounded-lg w-full bg-danger-light flex flex-row space-x-1 py-1.5 px-2 mt-2 items-center select-none"
    >
      <span class="inline-flex flex-shrink-0">
        <RedInfoIcon />
      </span>
      <span class="text-xs text-danger font-medium">{{
        errorMessage || "Veuillez choisir un élément"
      }}</span>
    </div>
    <!---->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, useSlots, watch } from "vue";
import BaseInputType from "@/constants/types";
import DropDownIcon from "../icons/DropDownIcon.vue";
import RedInfoIcon from "../icons/RedInfoIcon.vue";
import SearchIcon from "../icons/SearchIcon.vue";
import BaseInput from "./BaseInput.vue";

export type CurrencySelectorData = { value: string | null; label: string };

type Props = {
  name: string;
  showDefaultSelector?: boolean;
  data: CurrencySelectorData[];
  textClass?: string;
  defaultKey?: string | number;
  toggleBind?: boolean;
  label: string;
  required?: boolean;
  // hasError?: boolean;
  emptyLabel?: string;
  autoSelectFirstItem?: boolean;
  multiple?: boolean;
  searchable?: boolean;
};

type Emits = {
  (event: "change", choice: CurrencySelectorData): void;
  (event: "multiple-change", choice: CurrencySelectorData[]): void;
  (event: "toggle", show: boolean): void;
  (event: "search-change", value: string): void;
};

const props = withDefaults(defineProps<Props>(), {
  showDefaultSelector: true,
  emptyLabel: "Choisissez un élément",
  data: () => [],
  textClass: "",
  defaultKey: "",
  autoSelectFirstItem: true,
  toggleBind: false,
  searchable: true,
});

const slots = useSlots();

const EMPTY_CHOICE_VALUE: CurrencySelectorData = {
  label: "",
  value: null,
};

const emits = defineEmits<Emits>();

const state = reactive({
  show: false,
  // dataToUse: props.data,
  searchValue: "",
  dataToUse: computed((): CurrencySelectorData[] => {
    if (state.searchValue === "" || !props.searchable) return props.data;

    return props.data.filter((el) =>
      el.label.toLowerCase().includes(state.searchValue.toLowerCase())
    );
  }),
  hasAvailableData: computed((): boolean => state.dataToUse.length > 0),
  actualSelection: props.data[0] ?? {},
  selectSlottedButton: null,
  selecteSlottedOptions: null,
  selectSlotted: null as null | EventTarget[],
});

const errorMessage = computed((): string =>
  !state.actualSelection.value ? "Please pick an element" : ""
);

function toggle() {
  state.show = !state.show;
  emits("toggle", state.show);
}

function choose(item: CurrencySelectorData): void {
  state.actualSelection = item;
  emits("change", item);
  state.searchValue = "";
  state.show = false;
}

function defaultKeySearch() {
  const found = props.data.find((d) => d.value === props.defaultKey);
  choose(found ?? props.data[0] ?? EMPTY_CHOICE_VALUE);
}

// function onSearchInput(event: Event) {
//   handleChange(event, false);
// }

watch(
  () => props.toggleBind,
  () => {
    state.show = props.toggleBind;
  }
);

watch(
  () => props.data,
  (newVal) => {
    state.actualSelection = newVal[0] ?? EMPTY_CHOICE_VALUE;
    defaultKeySearch();
  }
);

watch(
  () => props.defaultKey,
  () => {
    defaultKeySearch();
  }
);

onMounted(() => {
  if (props.autoSelectFirstItem && props.data.length > 0) {
    defaultKeySearch();
  } else if (props.data.length >= 0 && !props.required) {
    choose(EMPTY_CHOICE_VALUE);
  }
});

const hasError = computed(() => {
  return !!errorMessage.value;
});

function isAvailableSlot(key: string) {
  return slots[key];
}
</script>

<style lang="scss" scoped>
div [data-widget-item="select_slotted_group"] {
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.15));
  max-height: 150px;
  border: solid 1px rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
  overflow-y: auto;
  position: absolute !important;
  z-index: 9999999;
  width: 100%;
  overflow-x: hidden;
}

.error {
  background: #feefef;
  border: 1px solid #da1414;
}

.select-item:hover {
  background-color: #eef2f8;
}
</style>
