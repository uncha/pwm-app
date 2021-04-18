<template>
    <div id="naverIdLogin"></div>
</template>

<script>

export default {
  name: 'NaverLogin',
  components: {
  },
  mounted() {
    console.log(this.$router.options.routes);

    const naverLogin = new naver.LoginWithNaverId({
      clientId: process.env.naverApiKey,
      callbackUrl: `${window.location.origin}/callback/Naver`,
      isPopup: false,
      loginButton: {
        color: 'green',
        type: 3,
        height: 48
      },
    });

    naverLogin.init();

  },
  methods: {
  }
}
</script>
