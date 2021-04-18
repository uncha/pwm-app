<template>
  <div>
    <a id="kakao-login-btn" @click="kakaoLogin">
      <img
        src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
        width="222"
      />
    </a>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "KakaoLogin",
  data() {
    return {
    };
  },
  mounted() {

    if (!Kakao.isInitialized()) {
      Kakao.init(process.env.kakaoJsKey);
    }

  },
  methods: {
    kakaoLogin() {
      const that = this;
       Kakao.Auth.login({
        success: (authObj) => {
          Kakao.API.request({
            url: '/v2/user/me',
            success: function(res) {
              const id = res.id
              const email = res.kakao_account.email;
              const { token_type , access_token } = authObj;

              console.log(res);

              that.signInAction(0);
              that.setTokenAction(`${token_type} ${access_token}`);
              that.$router.push({ path: '/sub', query: {id, email}});
            },
            fail: function(error) {
              alert(
                'login success, but failed to request user information: ' +
                  JSON.stringify(error)
              )
            },
          })
        },
        fail: (err) => {
          console.log(err)
        }
        // redirectUri: `${window.location.origin}/callback/Kakao`,
        // state: `${JSON.stringify(this.route)}`
      });
    },
    ...mapActions(['signInAction','setTokenAction']),
  }
};
</script>

<style lang="scss" scoped>
#kakao-login-btn {
  cursor: pointer;
}
</style>
