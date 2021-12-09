<template>
  <view>
    <view class="u-line-1" @click="show = true">{{ addressTitle }}</view>
    <u-select v-model="show" mode="mutil-column-auto" :list="areaswithLevel" :default-value="defaultvalue" @confirm="confirm"></u-select>
  </view>
</template>
<script>
import { getarea } from '@/utils/address'

export default {
  props: {
    value: { type: [Number, null], default: null },
    titles: { type: Array, default: () => [] },
    level: { type: Number, default: 3 },
  },
  data() {
    return {
      show: false,
      addressTitle: '请选择地址',
      areas: [],
    }
  },
  computed: {
    areaswithLevel() {
      return this.areas.map((a) => {
        if (this.level <= 1) return { ...a, children: null }
        else {
          a.children = a.children.map((b) => {
            if (this.level <= 2) return { ...b, children: null }
            else return { ...b }
          })
          return { ...a }
        }
      })
    },
    defaultvalue() {
      if (this.value) {
        var res = []
        if (this.level >= 1) res.push(this.areas.findIndex((c) => c.value == parseInt(this.value / Math.pow(100, this.level - 1))))
        if (this.level >= 2) {
          res.push(this.areas[res[0]].children.findIndex((c) => c.value == parseInt(this.value / Math.pow(100, this.level - 2))))
        }
        if (this.level >= 3) res.push(this.areas[res[0]].children[res[1]].children.findIndex((c) => c.value == this.value))
        return res
      } else return []
    },
  },
  async created() {
    this.areas = await getarea()
  },
  methods: {
    confirm(selected) {
      var code = parseInt(selected[this.level - 1].value)
      var titles = selected.map((c) => c.label)
      this.$emit('input', parseInt(code))
      this.$emit('update:titles', titles)
      this.addressTitle = titles.join(' ')
    },
  },
}
</script>
