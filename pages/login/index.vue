<template>
    <div>
        <div class="text-center"><Logo /></div>

        <div class="text-center mt-4">
            <b-form-group :label="'카카오 아이디'" :label-cols="2">
                <b-input :state="validateState('kakaoId')" v-model="$v.form.kakaoId.$model" />
                <b-form-invalid-feedback>아이디를 입력해 주세요.</b-form-invalid-feedback>
            </b-form-group>
            <b-button type="submit" class="w-100">카카오톡으로 시작하기</b-button>
        </div>
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
                    kakaoId:''
                }
            }
        },
        validations: {
            form: {
              kakaoId: {
                required,
              }
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

                let loginType = 'kakao_id'

                this.$axios.post('/api/login', {
                    loginType:loginType,
                    id:this.form.kakaoId
                }).then(res=>{
                    console.log('RES', res)
                    if(res.data == '') {
                        this.$store.commit('setSocialId', this.form.kakaoId)
                        this.$store.commit('setSocialLoginType', loginType)

                        this.$router.push({path:'/choice-user'})
                    } else {

                    }
                })
            }
        }
    }
</script>
