<template>
  <div id="my-signin2" />
  <!-- <vue-google-login
    class="google-login-button"
    :params="params"
    :on-success="onSuccess"
    :on-failure="onFailure"
    :render-params="renderParams"
  >
    <div class="google-login">
        <svg
          src="~/assets/img/google/btn_google_light_normal_ios.svg"
          alt="google-logo"
        />
        <span>구글계정으로 로그인</span>
      </div>
  </vue-google-login> -->
</template>
<script>
//import VueGoogleLogin from "vue-google-login";
import { mapActions } from "vuex";

export default {
  name: "GoogleLogin",
  //  components: {
  //   VueGoogleLogin
  // },
  data() {
    return {
      // params: {
      //   client_id: process.env.googleClientId,
      // },
      // renderParams: {
      //   width: 225,
      //   height: 42,
      //   longtitle: true
      // }
    };
  },
  mounted() {
    this.renderButton();
  },
  methods: {
    onSuccess(googleUser) {
      console.log(googleUser);
      const userInfo = googleUser.getBasicProfile();
      const id = userInfo.KR;
      const email = userInfo.lt;

      console.log(userInfo);
      this.signInAction(1);
      this.$router.push({ path: "/sub", query: { id, email }});
    },
    onFailure(err) {
      console.log('error');
      console.log(err);
    },
    renderButton() {
      console.log(gapi);
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 220,
        'height': 50,
        'longtitle': true,
        'theme': 'white',
        'onsuccess': this.onSuccess,
        'onfailure': this.onFailure
      });
    },
    ...mapActions(["signInAction"])
  }
};
</script>
<style lang="scss" scoped>
.google-login-button {
  .abcRioButtonContentWrapper {
    border-radius: 30px;
  }
}
</style>
