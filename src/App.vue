<template>
  <div>
    <router-view/>
    <!--<Loading v-model="isLoading"></Loading>-->
  </div>
</template>

<script>
  import { Loading } from 'vux'
  import { mapState } from 'vuex'

  export default {
    name: 'App',
    components: {
      Loading

    },
    computed: {
      ...mapState({
        isLoading: state => state.vux.isLoading
      })
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
</style>
