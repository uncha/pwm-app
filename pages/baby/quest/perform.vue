<template>
  <div id="perform">
    <div class="header" :class="{'image-upload': uploadImage}">
      <a href="#" @click.prevent="goBack()">
        <b-icon icon="chevron-left"></b-icon>
        수행 퀘스트
      </a>
      <p v-if="unSuccessQuest[0]">"{{unSuccessQuest[0].title}}"</p>
    </div>

    <template v-if="!uploadImage">
      <div class="quest-perform">
        <p class="text-danger">퀘스트 완료</p>
        <p class="description">퀘스트를 완료하였으면, <br />
        사진을 찍어서 엄마에게 <br />
        보내주세요.</p>
      </div>
      <div class="profile-image-wrapper">
          <div class="box-file-input"><label>
              <b-form-group :label="''">
                  <b-form-file @change="onUploadImage" accept="image/jpeg, image/png, image/gif" v-model="form.profile_image" class="mt-3" plain></b-form-file>
              </b-form-group>
          </label>
          <p>
            사진등록
          </p>
        </div>
      </div>
    </template>

    <template v-else>
      <p class="text-center upload-image-wrap">
        <img class="upload-image" :src="giftImageURL" />
      </p>
      <p class="text-center">이 사진으로 엄마에게 <br />
      보낼까요?</p>

      <b-row class="buttons">
        <b-col cols="5">
          <b-button variant="light" @click="no">다시찍기</b-button>
        </b-col>
        <b-col cols="7">
          <b-button variant="primary" @click="yes">네</b-button>
        </b-col>
      </b-row>
    </template>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          profile_image:''
        },
        uploadImage:'',
        quest:'',
        questGroup:'',
      }
    },
    computed: {
      linked () {
        return this.$store.getters['Baby/linked']
      },
      giftImageURL () {
          if(window.location.host == 'localhost:3000') {
            return `http://localhost:9102${this.uploadImage}`
          } else {
            return this.uploadImage
          }
      },
      unSuccessQuest () {
        return _.filter(this.quest, item =>{
          return item.success_state == 0
        })
      },
    },
    async mounted () {
      this.questGroup = await this.loadQuestGroup()
      this.quest = await this.loadQuest()
    },
    methods: {
      loadQuestGroup () {
        return new Promise(resolve=>{
          this.$axios.get(`/api/selectQuestGroup/${this.linked[0].id}`).then(res=>{
            resolve(res.data)
          })
        })
      },
      loadQuest () {
        return new Promise(resolve =>{
          this.$axios.get(`/api/selectQuest/${this.questGroup[0].id}`).then(res=>{
            let list = _.sortBy(res.data, item=>{
              return item.start_date
            })

            resolve(list)
          })
        })
      },
      onUploadImage() {
          let formData = new FormData();

          window.setTimeout(()=>{
              formData.append('profile_image', this.form.profile_image);
              console.log('THIS.FORM.PROFILE_IMAGE', this.form.profile_image)

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
      no () {
        this.uploadImage = ``
        this.imageFile = ``
      },
      yes () {
        this.$axios.post(`/api/executionQuest/${this.unSuccessQuest[0].id}`, {
          execution_date:moment().format('YYYY-MM-DD'),
          execution_pic:this.uploadImage,
          questGroupId:this.questGroup[0].id,
        }).then(res=>{
          this.$router.push({path:'/baby/quest/confirm'})
        })
      },
    }
  }
</script>

<style lang="scss">
 

#perform {
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

  .buttons {
    > div {
      padding: rem(5px);
    }
  }
}
</style>

<style lang="scss" scoped>
 

.upload-image-wrap {
  .upload-image {
    width:100%;
    border-radius: rem(8px);
    box-shadow: 2px 2px 10px 3px rgba(0, 0, 0, 0.2);
  }
}

.header {
  margin: 0 rem(-24px);
  padding:rem(30px) rem(24px);
  background: #497ff5;
  color:#FFF;
  box-shadow: 2px 2px 10px 5px rgba(0, 0, 0, 0.2);
  font-size: rem(20px);

  a {
    color:#FFF;
    text-decoration: none;
    margin-bottom: rem(30px);
    display: inline-block;
    font-size: rem(16px);
    font-family: NotoSansMonoCJKkr-Regular;
  }

  p {
    margin:0;
    font-family: NotoSansCJKkr-Bold;
  }

  &.image-upload {
    background: #FFF;
    color:#000;
    box-shadow: 2px 2px 10px 5px rgba(0, 0, 0, 0);

    a {
      color:#000;
    }
  }
}

.quest-perform {
  margin-top: rem(40px);

  .description {
    font-size: rem(24px);
    line-height: rem(30px);
  }
}
</style>
