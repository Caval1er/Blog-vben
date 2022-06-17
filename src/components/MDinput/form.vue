<template>
  <a-form
    name="customized_form_controls"
    layout="inline"
    :model="formState"
    @finish="onFinish"
    :label-col="{ style: { width: '100px' } }"
  >
    <a-form-item name="price" label="Price" :rules="[{ validator: checkPrice }]">
      <price-input v-model:value="formState.price">Title</price-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
// sorceCode https://github.com/vueComponent/ant-design-vue/blob/cb3c002e17f0f4f5b3e8d01846069da0e2645aff/components/form/demo/price-input.vue
import PriceInput from './index.vue'

export default defineComponent({
  components: {
    PriceInput,
  },
  setup() {
    const formState = reactive({
      price: '',
    })

    const onFinish = (values: any) => {
      console.log('Received values from form: ', values)
    }
    const checkPrice = (_: any, value: String) => {
      if (value !== '') {
        return Promise.resolve()
      }
      return Promise.reject(new Error('value must not be null'))
    }
    return { onFinish, formState, checkPrice }
  },
})
</script>
