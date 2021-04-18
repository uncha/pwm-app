<template>
    <div></div>
</template>

<script>
    export default {
        data () {
            return {
            }
        },
        mounted () {
            let accessToken = this.$route.hash.replace('#access_token=', '').split('&')[0]
            let loginType = 'naver_id'

            const naverLogin = new naver.LoginWithNaverId({
              clientId: process.env.naverApiKey,
              callbackUrl: `${window.location.origin}/callback/Naver`,
            });

            let _this = this

            naverLogin.init();
            naverLogin.getLoginStatus(function (status) {
              if(status) {
                _this.$axios.$post('/api/login', {
                    loginType:loginType,
                    id:naverLogin.loginStatus.naverUser.email,
                    isPopup: false,
    	              callbackHandle: true
                }).then(res=>{
                    if(res == '') { // 신규
                        _this.$store.commit('setSocialId', naverLogin.loginStatus.naverUser.email)
                        _this.$store.commit('setSocialLoginType', loginType)
                        _this.$router.push({path:'/choice-user'})
                    } else { // 기존
                        _this.login(naverLogin.loginStatus.naverUser.email, loginType)
                    }
                })
              }
            })
        },
        methods: {
          login (setSocialId, loginType) {
            this.$axios.post('/api/login', {
                loginType:loginType,
                id:setSocialId
            }).then(res=>{
                this.$store.commit('setUser', res.data.nick_name)

                if(res.data.user_type == 'mom') {
                  this.$axios.get(`/api/linked/mom`, {
                    params: {
                      mom_nick_name:res.data.nick_name,
                    }
                  }).then(res=>{
                    if(res.data.length > 0) {
                      this.$router.push({path:'/mom/quest/create/start'})
                    } else {
                      this.$router.push({path:'/mom/search-baby'})
                    }
                  })
                } else {
                  this.$router.push({path:'/baby/search-mom'})
                }
            })
          },
        },
    }
</script>

<style>

</style>
