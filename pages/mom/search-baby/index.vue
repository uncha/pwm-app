<template>
    <div>
        <top></top>
        <div class="">
            <p class="text-center title">자녀의 닉네임을<br />입력해주세요.
            </p>
            <b-form @submit.stop.prevent="onSubmit">
                <b-form-group>
                    <b-input v-model="$v.form.nickName.$model"  :state="validateState('nickName')" />
                    <b-form-invalid-feedback>This is a required field.</b-form-invalid-feedback>
                </b-form-group>
                <div class="text-center">
                    <p class="text-danger" v-if="searchFailed == true">
                        닉네임을 찾을 수 없습니다.
                    </p>
                    <b-button type="submit" class="mt-4 text-center" variant="primary">확인
                    </b-button>
                </div>
            </b-form>
        </div>
        <b-modal ref="modal-link-child" hide-header hide-footer centered>
            <p class="face"><img :src="profileImageURL" /></p><p/>
            <p class="text-center name">{{form.nickName}}</p>
            <template v-if="linkedComplete == false">
                <b-row no-gutters>
                  <b-col cols="4" class="p-1">
                    <b-button variant="light" @click="$refs['modal-link-child'].hide()">아니에요
                    </b-button>
                  </b-col>
                  <b-col cols="8" class="p-1">
                    <b-button variant="primary" @click="yes">네, 맞아요!
                    </b-button>
                  </b-col>
                </b-row>
            </template>
            <template v-else>
                <div class="text-center">
                    <p class="complete-message">연결 신청이 완료 되었습니다!</p>
                    <b-button @click="$router.push({path:'/mom/quest/create/start'})" variant="primary">확인</b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script type="text/javascript">
    import LoginCheck from '@/mixins/loginCheck.js'
    import { validationMixin } from "vuelidate";
    import { required, minLength } from "vuelidate/lib/validators";
    import Top from '@/components/top';

    export default {
        components: {
            'top': Top,
        },
        mixins: [validationMixin, LoginCheck],
        data () {
            return {
                linkedComplete:false,
                form: {
                    nickName:'test',
                },
                searchFailed:false,
                searchBaby:null,
            }
        },
        validations: {
            form: {
              nickName: {
                required
              },
            }
        },
        computed: {
            authUser () {
                return this.$store.getters['authUser']
            },
            profileImageURL () {
                if(!this.searchBaby) return ''

                if(window.location.host == 'localhost:3000') {
                  return `http://localhost:9102${this.searchBaby[0].profile_image}`
                } else {
                  return this.searchBaby[0].profile_image
                }
            },
        },
        methods: {
            validateState(name) {
                const { $dirty, $error } = this.$v.form[name];
                return $dirty ? !$error : null;
            },
            onSubmit () {
                this.$v.form.$touch();
                if (this.$v.form.$anyError) {
                  return;
                }

                this.$axios.get(`/api/search-baby/${this.authUser}/${this.form.nickName}`).then(res=>{
                    console.log('RES.DATA@@@@', res.data)
                    if(res.data.length == 0){
                        this.searchFailed = true
                    } else {
                        this.searchFailed = false
                        this.searchBaby = res.data
                        this.$refs['modal-link-child'].show()
                    }
                })
            },
            yes () {
                this.$axios.post(`/api/linked`, {
                    mom_nick_name:this.authUser,
                    baby_nick_names:this.form.nickName
                }).then(res=>{
                    console.log('RES', res)
                    this.linkedComplete = true
                })

                // this.linkedComplete = true
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/common.scss";

.title {
  margin-top:rem(203px);
  font-size: rem(24px);
  font-family: NotoSansCJKkr-Regular;
  line-height: rem(30px);
  letter-spacing: -1px;
  margin-bottom: rem(37px);
}

.name {
  font-size: rem(24px);
}

.face {
  width: rem(100px);
  height: rem(100px);
  border-radius: 100%;
  overflow: hidden;
  margin:0 auto;

  img {
    width:100%;
  }
}

.complete-message {
  color:#1773e2;
  font-size:rem(14px);
}
</style>
