<template>
  <div
    id="appleid-signin"
    data-color="black"
    data-border="true"
    class="custom-apple-btn"
    @click="test"
  />
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AppleLogin",
  mounted() {
    AppleID.auth.init({
      clientId: process.env.appleClientId,
      scope: "email",
      redirectURI: "https://www.appplelogintest.ga/callback/apple",
      usePopup: true
    });
  },
  methods: {
    test() {
      console.log("hello");
      this.signInAction(3);
      AppleID.auth.signIn();
    },
    ...mapActions(["signInAction"])
  }
};
</script>
<style scoped>
.custom-apple-btn {
  width: 226px;
  height: 50px;
  margin: 0 auto;
}
</style>
