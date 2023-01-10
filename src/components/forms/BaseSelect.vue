<template>
  <div
    ref="select_slotted"
    data-widget-item="select-slotted"
    class="select-none relative BaseSelectComponent"
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
        class="inline-flex items-center flex-row space-x-1 flex-shrink-0 text-ellipsis overflow-hidden"
        :class="{
          'w-[90%] flex-wrap': !searchable,
          'w-full': searchable,
        }"
      >
        <!-- custom icon -->
        <span v-if="$slots.icon" class="inline-flex flex-shrink-0">
          <slot name="icon" />
        </span>
        <span v-else-if="searchable">
          <SearchIcon />
        </span>

        <!-- search bar when searchable -->
        <input
          v-if="searchable"
          v-model="state.searchValue"
          type="text"
          class="border-0 outline-none appearance-none flex-shrink w-full bg-transparent"
        />

        <div v-else class="w-full flex flex-wrap">
          <span
            v-if="!multiple && !isAvailableSlot('choosenItem')"
            :class="textClass"
          >
            {{ state.actualSelection?.label || emptyLabel }}
          </span>
          <slot
            name="choosenItem"
            v-else-if="isAvailableSlot('choosenItem')"
          ></slot>
          <div
            v-for="(choice, index) in state.actualSelections"
            v-else
            :key="choice.value ?? index"
            class="bg-[#DADEE3] p-[6px] text-black rounded-md font-bold flex items-center mr-1 mb-1"
            @click="removeItem(choice.value)"
          >
            <span class="text-sm mr-[10px]">
              {{ choice.label || emptyLabel }}
            </span>
            <MiniCloseIcon />
          </div>
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
      v-if="
        state.show &&
        (state.dataToUse.length > 0 || hasSlot) &&
        showDefaultSelector
      "
      ref="select_slotted_options"
      class="select_slotted_options w-full rounded border border-white bg-white absolute mt-[0.281rem] z-[999999]"
      data-widget-item="select_slotted_group"
    >
      <template v-if="hasSlot">
        <slot />
      </template>
      <template v-else>
        <div>
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
      </template>
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
import { computed, onMounted, reactive, watch, ref, useSlots } from "vue";
import { containElement } from "@/helpers";
import { NOT_FOUND_ITEM_INDEX } from "@/constants";
import RedInfoIcon from "../icons/RedInfoIcon.vue";
import DropDownIcon from "../icons/DropDownIcon.vue";
import MiniCloseIcon from "../icons/MiniCloseIcon.vue";
import SearchIcon from "../icons/SearchIcon.vue";

export type BaseSelectData = { value: string | null; label: string };

type Props = {
  name: string;
  showDefaultSelector?: boolean;
  data: BaseSelectData[];
  textClass?: string;
  defaultKey?: string | number;
  hasSlot?: boolean;
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
  (event: "change", choice: BaseSelectData): void;
  (event: "multiple-change", choice: BaseSelectData[]): void;
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
  searchable: false,
});

const slots = useSlots();

const EMPTY_CHOICE_VALUE: BaseSelectData = {
  label: "",
  value: null,
};

const emits = defineEmits<Emits>();

const errorMessage = computed((): string =>
  !state.actualSelection.value ? "Please pick an element" : ""
);

const state = reactive({
  show: false,
  // dataToUse: props.data,
  searchValue: "",
  dataToUse: computed((): BaseSelectData[] => {
    if (state.searchValue === "" || !props.searchable) return props.data;

    return props.data.filter((el) =>
      el.label.toLowerCase().includes(state.searchValue.toLowerCase())
    );
  }),
  actualSelection: props.data[0] ?? {},
  actualSelections: [] as BaseSelectData[],
  selectSlottedButton: null,
  selecteSlottedOptions: null,
  selectSlotted: null as null | EventTarget[],
});

function toggle() {
  state.show = !state.show;
  emits("toggle", state.show);
}

function handleChoiceForMultiple(item: BaseSelectData) {
  if (!item.value) return;

  if (containElement(state.actualSelections, item.value, "value")) return;

  state.actualSelections.push(item);
}

function isValidForMultiple() {
  if (props.required) return state.actualSelections.length > 0;
  return true;
}

function choose(item: BaseSelectData): void {
  if (props.multiple) {
    handleChoiceForMultiple(item);
    emits("multiple-change", state.actualSelections);
  } else {
    state.actualSelection = item;
    emits("change", item);
    state.searchValue = item.label ?? "";
    state.show = false;
  }
}

function defaultKeySearch() {
  const found = props.data.find((d) => d.value === props.defaultKey);
  choose(found ?? props.data[0] ?? EMPTY_CHOICE_VALUE);
}

function removeItem(itemValue: string | null) {
  const elementIndex = state.actualSelections.findIndex(
    (el) => el.value === itemValue
  );

  if (elementIndex !== NOT_FOUND_ITEM_INDEX) {
    state.actualSelections.splice(elementIndex, 1);
  }

  emits("multiple-change", state.actualSelections);
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
