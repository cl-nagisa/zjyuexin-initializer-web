<template>
  <div class="appMain-wrapper">
    <transition name="tr-fade-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppMain'
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
