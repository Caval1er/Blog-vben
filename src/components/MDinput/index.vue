<template>
  <div :class="computedClasses" class="material-input__component">
    <a-input
      v-if="type === 'text'"
      type="text"
      :value="inputValue"
      style="width: 100px"
      @change="handleTextInput"
      @focus="onFocus"
      @blur="onBlur"
      class="material-input"
      :disabled="props.disabled"
      ref="inputRef"
    />
    <a-space direction="vertical" :size="12" v-if="type === 'datePicker'">
      <a-date-picker
        show-time
        placeholder="Select Time"
        @focus="onFocus"
        @blur="onBlur"
        class="material-input"
        dropdownClassName="date-picker"
        :value="value"
        @change="handleDateInput"
        :disabled="datePickerDisabled"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </a-space>
    <span class="material-input-bar"></span>
    <label class="material-label" :class="computedLableClasses">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { Form } from 'ant-design-vue'
import { Dayjs } from 'dayjs'
import { computed, toRef, ref, watch } from 'vue'
const props = defineProps({
  value: [String],
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'text' },
  datePickerDisabled: {
    type: Boolean,
    default: true,
  },
  isAutofocus: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: false,
  },
})

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        inputRef.value.focus()
      }, 300)
    }
  },
  {
    flush: 'post',
    immediate: true,
  }
)

const inputRef = ref()
const focused = ref(false)
const inputValue = toRef(props, 'value')
const computedClasses = computed(() => ({
  'material--active': focused.value,
  'material--disabled': props.disabled,
  'material--raised': Boolean(focused.value || inputValue.value),
}))
const computedLableClasses = computed(() => ({
  'date-picker-label': props.type === 'datePicker',
}))
const emit = defineEmits(['update:value'])
const formItemContext = Form.useInjectFormItemContext()
const triggerChange = (changedValue: any) => {
  emit('update:value', changedValue)

  formItemContext.onFieldChange()
}
const handleTextInput = (e: InputEvent) => {
  const newValue = (e.target as any).value
  triggerChange(newValue)
}
const handleDateInput = (date: Dayjs | null) => {
  const newDate = date
  triggerChange(newDate)
}
const onFocus = () => {
  focused.value = true
}
const onBlur = () => {
  focused.value = false
}
</script>
<style>
body .date-picker {
  top: 350px !important;
}
</style>
<style lang="less" scoped>
@font-size-base: 16px;
@font-size-small: 18px;
@font-size-smallest: 12px;
@font-weight-normal: normal;
@font-weight-bold: bold;
@apixel: 1px;
// Utils
@spacer: 12px;
@transition: 0.2s ease all;
@index: 0px;
@index-has-icon: 30px;
// Theme:
@color-white: white;
@color-grey: #9e9e9e;
@color-grey-light: #e0e0e0;
@color-blue: #2196f3;
@color-red: #f44336;
@color-black: black;

@font-sans-serif: 'Ubuntu', 'Source Sans Pro', sans-serif;
@font-monospace: 'Fira Code', 'Roboto Mono', monospace;
.slided-top {
  top: -(@font-size-base + @spacer);
  left: 0;
  font-size: @font-size-base;
  font-weight: @font-weight-bold;
}
.base-bar-pseudo {
  content: '';
  height: 1px;
  width: 0;
  bottom: 0;
  position: absolute;
  transition: @transition;
}
.material-input__component {
  font-family: @font-sans-serif;
  margin-top: 36px;
  position: relative;
  * {
    box-sizing: border-box;
  }
  .ant-space {
    width: 100%;
  }
  .material-input {
    font-size: @font-size-base;
    padding: @spacer @spacer @spacer - @apixel * 10 (@spacer / 2);
    display: block;
    width: 100% !important;
    border: none;
    box-shadow: none !important;
    line-height: 1;
    border-radius: 0;
    &:focus {
      outline: none;
      border: none;
      border-bottom: 1px solid transparent; // fixes the height issue
    }
  }
  .material-label {
    font-weight: @font-weight-normal;
    position: absolute;
    pointer-events: none;
    left: @index;
    top: 0;
    transition: @transition;
    font-size: @font-size-small;
    &.date-picker-label {
      .slided-top();
    }
  }
  .material-input-bar {
    position: relative;
    display: block;
    width: 100%;
    &:before {
      &:extend(.base-bar-pseudo);
      left: 50%;
    }
    &:after {
      &:extend(.base-bar-pseudo);
      right: 50%;
    }
  }
  // Disabled state:
  &.material--disabled {
    .material-input {
      border-bottom-style: dashed;
      color: rgba(0, 0, 0, 0.25);
    }
  }
  // Raised state:
  &.material--raised {
    .material-label {
      .slided-top();
    }
  }
  // Active state:
  &.material--active {
    .material-input-bar {
      &:before,
      &:after {
        width: 50%;
      }
    }
  }
}
.material-input__component {
  background: @color-white;
  .material-input {
    background: none;
    color: @color-black;
    text-indent: @index;
    border-bottom: 1px solid @color-grey-light;
  }
  .material-label {
    color: @color-grey;
  }
  .material-input-bar {
    &:before,
    &:after {
      background: @color-blue;
    }
  }
  // Active state:
  &.material--active {
    .material-label {
      color: @color-blue;
    }
  }
  // Errors:
  &.material--has-errors {
    &.material--active .material-label {
      color: @color-red;
    }
    .material-input-bar {
      &:before,
      &:after {
        background: transparent;
      }
    }
  }
}
</style>
