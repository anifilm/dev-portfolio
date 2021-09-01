<script>
  export let scale = false;
  export let absolute = false;
  export let fixed = false;
</script>

<div style="transform: scale({scale})" class:absolute={absolute} class:fixed={fixed} class="loading">
  <!-- Spinners HTML -->
  <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
</div>

<style lang="scss">
  .loading {
    width: 70px;
    height: 70px;
    margin: auto;
    padding: 30px;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    &.absolute {
      position: absolute;
    }
    &.fixed {
      position: fixed;
    }
  }
  /* Spinners CSS */
  .spinner {
    margin: 25px auto 0;
    width: 70px;
    text-align: center;
  }
  .spinner > div {
    width: 18px;
    height: 18px;
    /*background-color: #333;*/
    background-color: $color--white-20;
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }
  .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
    }
  }
  @keyframes sk-bouncedelay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
</style>
