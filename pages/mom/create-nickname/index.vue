<template>
    <div id="create-nickname">
        <top></top>
        <b-row class="">
            <b-col>
                <b-form @submit.stop.prevent="onSubmit">
                    <div class="profile-image-wrapper">
                        <p class="upload-image">
                            <template v-if="uploadImage">
                                <img :src="profileImageURL" />
                            </template>
                            <template v-else>
                                <img src="/images/img_profile.png" />
                            </template>
                        </p>
                        <div class="box-file-input"><label>
                            <b-form-group :label="''">
                                <b-form-file @change="onUploadImage" accept="video/*;capture=camcorder" v-model="form.profile_image" class="mt-3" plain></b-form-file>
                            </b-form-group>
                        </label></div>
                    </div>
                    <p class="text-center title">
                        사용 할 닉네임을<br />
                        정해주세요!
                    </p>
                    <div class="form-wrap">
                        <b-form-group :label="''">
                            <b-input :state="validateState('nick_name')" :disabled="confirmed==true" v-model="$v.form.nick_name.$model" placeholder="넥네임을 입력해 주세요." type="text" />
                            <b-form-invalid-feedback>넥네임을 입력해 주세요.</b-form-invalid-feedback>
                        </b-form-group>
                        <template v-if="confirmed === ''">
                            <b-button class="position-bottom" type="submit" variant="primary">확인</b-button>
                        </template>
                        <template v-else>
                            <template v-if="confirmed==false">
                                <p class="des text-danger">사용불가
                                </p>
                                <b-button class="position-bottom" type="submit" variant="primary">확인</b-button>
                            </template>
                            <template v-else>
                                <p class="des" style="color:#1773e2">사용가능
                                </p>
                                <b-button class="position-bottom" @click="onStart" variant="primary">시작하기</b-button>
                            </template>
                        </template>
                    </div>
                </b-form>
            </b-col>
        </b-row>
    </div>
</template>

<script type="text/javascript">
    import { validationMixin } from "vuelidate";
    import { required, minLength } from "vuelidate/lib/validators";
    import Top from '@/components/top';

    export default {
        components: {
            'top': Top,
        },
        mixins: [validationMixin],
        data () {
            return {
                form: {
                    profile_image:[],
                    nick_name:'',
                    profile_image_path:'',
                },
                confirmed:'',
                uploadImage:'',
            }
        },
        validations: {
            form: {
              nick_name: {
                required,
                minLength: minLength(3)
              }
            }
        },
        computed: {
            socialId () {
                return this.$store.getters['socialId']
            },
            socialLoginType () {
                return this.$store.getters['socialLoginType']
            },
            profileImageURL () {
                if(window.location.host == 'localhost:3000') {
                  return `http://localhost:9102${this.uploadImage}`
                } else {
                  return this.uploadImage
                }
            },
        },
        mounted () {
            if(!this.socialId) {
                this.$router.push({path:'/'})
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

                  this.$axios.get(`/api/user/${this.form.nick_name}`).then(res=>{
                      if(res.data.length > 0) {
                          this.confirmed = false
                      } else {
                          this.confirmed = true
                      }
                  })
            },
            onStart () {
                this.form.user_type = 'mom'
                this.form.socialLoginType = this.socialLoginType
                this.form.socialId = this.socialId

                let promises = []

                this.$axios.post('/api/user', this.form).then(res=>{
                    this.login()
                })
            },
            login () {
                this.$axios.post('/api/login', {
                    loginType:this.socialLoginType,
                    id:this.socialId
                }).then(res=>{
                    console.log('RES', res)

                    this.$store.commit('setUser', res.data.nick_name)

                    this.$router.push({path:'/mom/install'})
                })
            },
            onUploadImage() {
                let formData = new FormData();

                window.setTimeout(()=>{
                    formData.append('profile_image', this.form.profile_image);

                    this.$axios.post('/api/upload', formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(res=>{
                        this.uploadImage = `/uploads/${res.data}`
                        this.form.profile_image_path = `/uploads/${res.data}`

                        this.$forceUpdate();
                    })
                })
            },
        }
    }
</script>

<style lang="scss">
    @import "~@/assets/scss/common.scss";

    #create-nickname {
        .profile-image-wrapper {
            position: relative;
            margin:rem(170px) auto rem(33px);
            height: rem(100px);
            width: rem(100px);

            &:after {
                content:'';
                display: block;
                width: rem(91px);
                height: rem(91px);
                border:1px dashed #FFF;
                border-radius: 100%;
                position: absolute;
                left:rem(5px);
                top:rem(5px);
            }

            .upload-image {
                position: absolute;
                width: rem(100px);
                height: rem(100px);
                background: #f1cef5;
                border-radius: 100%;
                overflow: hidden;
                z-index:5;

                img {
                    width:100%;
                    height:100%;
                }
            }

            .box-file-input {
                position: absolute;
                z-index: 6;
                top:rem(73px);
                left:rem(68px);
            }

            .box-file-input .form-group {
                margin-bottom: 0;
            }

            .box-file-input label{
              display:inline-block;
              background:#1ec89b;
              color:#fff;
              cursor:pointer;
              border-radius: 100%;
            }

            .box-file-input label:after{
                background-size: rem(30px) rem(30px);
                display: inline-block;
                background-position: 0 0;
                background-repeat: no-repeat;
                width: rem(30px);
                height: 25px;
                content: "";
                background-image: url(/images/icon_camera.png);
            }

            .box-file-input input[type="file"]{
              display:none;
            }

            .box-file-input .filename{
              display:inline-block;
              padding-left:10px;
            }
        }

    }
</style>

<style lang="scss" scoped>
    @import "~@/assets/scss/common.scss";

    .title {
        font-size: rem(24px);
        font-family: NotoSansMonoCJKkr-Regular;
        margin-bottom: rem(130px);
    }

    .form-wrap {
        position: relative;
        overflow: hidden;

        .des {
            font-size: rem(12px);
            position: relative;
            bottom: rem(47px);
            left: calc(100% - 100px);
        }
    }
</style>
