<template>
  <div>
    <!-- HOME BUTTON -->
    <router-link to="/" class="to-home">
      <i class="material-icons">home</i>
    </router-link>

    <!-- VIEWS -->
    <router-view />
  </div>
</template>

<!--
<script>
export default {
  created() {
    // vue router 객체 정보 확인
    console.log(this.$router);
    console.log(this.$route);
  }
};
</script>-->

<style scoped>
.to-home.router-link-exact-active {
  display: none;
}
</style>
