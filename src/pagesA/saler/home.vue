<template>
  <div>
    <button class="u-reset-button" open-type="contact">
      <image :src="post" class="w-full" mode="widthFix"></image>
    </button>
  </div>
</template>

<script>
import store from '@/store'
import { getPoster } from '@/apis/modules/home'

export default {
  data() {
    return {
      post: '',
    }
  },
  async created() {
    if (store.getters.isLogged && store.state.user.logged.bindingMemberId == store.state.user.logged.id) {
      this.$goto('/pagesA/saler/index', { way: 'replace' })
    } else {
      var posters = await getPoster()
      this.post = posters.distributerPost
    }
  },
}
</script>

<style></style>
