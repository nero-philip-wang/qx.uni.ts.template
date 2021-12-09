<template>
  <view>
    <u-cell arrow :title="title" :border-bottom="false" @click="showPicker"></u-cell>
    <u-picker v-model="show" :list="list" @confirm="confirm"></u-picker>
  </view>
</template>

<script>
export default {
  name: 'Selection',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: '',
      show: false,
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        var current = this.list.filter((c) => c.value == this.value)
        current = current && current[0]
        if (current) this.title = current.label
      },
    },
  },
  methods: {
    showPicker() {
      this.show = true
    },
    confirm(e) {
      console.log(e[0].label)
      this.title = e[0].label
      this.$emit('input', e[0].value)
    },
  },
}
</script>
