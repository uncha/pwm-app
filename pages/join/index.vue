<template>
  <div>
    <b-form class="join-form" @submit.prevent="onSubmit">
      <b-form-group :label="'아이디'">
        <b-form-input
          v-model="$v.form.email.$model"
          :state="validateState('email')"
          aria-describedby="email-feedback"
        ></b-form-input>
        <b-form-invalid-feedback
          id="email-feedback"
        >아이디를 입력해 주세요</b-form-invalid-feedback>
      </b-form-group>
      <!-- <b-form-group :label="'비밀번호'">
        <b-form-input
          type="password"
          v-model="$v.form.password.$model"
          :state="validateState('password')"
          aria-describedby="password-feedback"
        ></b-form-input>
        <b-form-invalid-feedback
          id="password-feedback"
        >비밀번호를 입력해 주세요</b-form-invalid-feedback> -->
      </b-form-group>
      <!-- <div class="text-center">
        <b-form-group>
          <b-form-radio-group
            id="radio-group-2"
            v-model="selected"
            :aria-describedby="ariaDescribedby"
            name="radio-sub-component">
            <b-form-radio v-model="form.type" :aria-describedby="ariaDescribedby" name="some-radios" value="mom">엄마</b-form-radio>
            <b-form-radio v-model="form.type" :aria-describedby="ariaDescribedby" name="some-radios" value="baby">자녀</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </div> -->
      <b-button variant="primary" type="submit" class="mt-4">확인</b-button>
    </b-form>
  </div>
</template>

<script type="text/javascript">
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  data () {
    return {
      form: {
        email:'',
        password:'',
        type:'mom'
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
      },
      // password: {
      //   required,
      // },
    }
  },
  methods: {
    validateState(nick_name) {
      const { $dirty, $error } = this.$v.form[nick_name];
      return $dirty ? !$error : null;
    },
    onSubmit () {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.$axios.$post('/api/login', {
          loginType:'naver_id',
          id:this.form.email,
      }).then(res=>{
        console.log('RES', res)
          if(res == '') { // 신규
              this.$store.commit('setSocialId', this.form.email)
              this.$store.commit('setSocialLoginType', 'naver_id')
              this.$router.push({path:'/choice-user'})
          } else { // 기존
              this.login(this.form.email, 'naver_id')
          }
      })
    },
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
  }
}
</script>

<style lang="scss">

</style>
