<template>
    <div id="gift">
      <top></top>
      <template v-if="uploadImage">
        <p class="title text-center">
            이 보상으로 괜찮나요?
        </p>
        <p class="text-center">
          <img class="upload-image" :src="giftImageURL" />
        </p>
        <b-row no-gutters>
          <b-col cols="4">
            <b-button variant="light" @click="uploadImage=''">아니요
            </b-button>
          </b-col>
          <b-col cols="8">
            <b-button variant="primary" @click="yes">네
            </b-button>
          </b-col>
        </b-row>
      </template>
      <template v-else>
        <div>
            <p class="title text-center">
                보상은 무엇으로 할까요?
            </p>
            <p class="description text-center">평소에 가지고 싶어했던 것을<br />
            캡쳐하거나 찍어서 올려주세요.</p>
        </div>
        <b-row>
            <b-col>
              <div class="profile-image-wrapper">
                  <div class="box-file-input"><label>
                      <b-form-group :label="''">
                          <b-form-file @change="onUploadImage" accept="video/*;capture=camcorder" v-model="form.profile_image" class="mt-3" plain></b-form-file>
                      </b-form-group>
                  </label>
                  <p>
                    사진등록
                  </p>
                </div>
              </div>
            </b-col>
        </b-row>
      </template>
    </div>
</template>

<script type="text/javascript">
    import { validationMixin } from "vuelidate";
    import { required, minLength } from "vuelidate/lib/validators";
    import LoginCheck from '@/mixins/loginCheck.js';
    import Top from '@/components/top'

    export default {
        mixins: [validationMixin, LoginCheck],
        components: {
            'top': Top,
        },
        data () {
            return {
                form: {
                    profile_image:[],
                },
                confirmed:'',
                uploadImage:'',
                imageFile:'',
            }
        },
        computed: {
          questList () {
            return this.$store.getters['questList']
          },
          selectCount () {
            return this.$store.getters['selectCount']
          },
          giftImageURL () {
              if(window.location.host == 'localhost:3000') {
                return `http://localhost:9102${this.uploadImage}`
              } else {
                return this.uploadImage
              }
          },
        },
        methods: {
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
                        this.imageFile = `/uploads/${res.data}`

                        this.$forceUpdate();
                    })
                })
            },
            yes () {
              this.$store.commit('setGift', this.uploadImage)

              this.$router.push({path:'confirm'})
            },
        }
    }
</script>

<style lang="scss">
    @import "~@/assets/scss/common.scss";

    #gift {
        .profile-image-wrapper {
            position: relative;
            margin:rem(90px) auto rem(33px);

            .box-file-input {
                position: absolute;
                z-index: 6;
                text-align: center;
                left:0;
                right:0;
            }

            .box-file-input .form-group {
                margin-bottom: 0;
            }

            .box-file-input label{
              display:inline-block;
              background:#497ff5;
              color:#fff;
              cursor:pointer;
              border-radius: 100%;
            }

            .box-file-input label:after{
                background-size: rem(64px) rem(64px);
                display: inline-block;
                background-position: 0 0;
                background-repeat: no-repeat;
                width: rem(64px);
                height: rem(59px);
                content: "";
                background-image: url(/images/icon_camera_02.png);
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
      line-height: rem(30px);
      margin-top:rem(100px);
    }

    .description {
      font-size: rem(16px);
      line-height: rem(24px);
      color:#497ff5;
      margin-top:rem(20px);
      margin-bottom: 0;
    }

    .upload-image {
      margin-top:rem(72px);
      border-radius: rem(5px);
      max-width: 100%;
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
