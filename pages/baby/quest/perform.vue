<template>
  <div id="perform">
    <top
      :linked="linked"
      :backURL="'/baby/quest/confirm'"
    ></top>
    <template v-if="!uploadImage">
      <div class="quest-perform">
        <h1 class="description">퀘스트를 완료하였으면, <br />
          사진을 찍어서 엄마에게 <br />
          보내주세요.</h1>
      </div>
      <div class="profile-image-wrapper">
        <div class="box-file-input"><label>
            <b-form-group :label="''">
              <b-form-file
                @change="onUploadImage"
                accept="image/jpeg, image/png, image/gif"
                v-model="form.profile_image"
                class="mt-3"
                plain
              ></b-form-file>
            </b-form-group>
          </label>
          <p>
            사진등록
          </p>
        </div>
      </div>
    </template>

    <template v-else>

      <p class="send-picture-text">이 사진으로 엄마에게
        보낼까요?</p>
      <p class="text-center upload-image-wrap">
        <img
          class="upload-image"
          :src="giftImageURL"
        />
      </p>
      <b-row class="bottom-wrap">
        <b-col cols="5">
          <b-button
            variant="light"
            @click="no"
          >다시찍기</b-button>
        </b-col>
        <b-col cols="7">
          <b-button
            variant="primary"
            @click="yes"
          >네</b-button>
        </b-col>
      </b-row>
    </template>

  </div>
</template>

<script>
import Top from "@/components/baby/top";

export default {
  components: {
    top: Top,
  },
  data() {
    return {
      form: {
        profile_image: "",
      },
      uploadImage: "",
      quest: "",
      questGroup: "",
      executionQuestList: [],
    };
  },
  computed: {
    linked() {
      return this.$store.getters["Baby/linked"];
    },
    giftImageURL() {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${this.uploadImage}`;
      } else {
        return this.uploadImage;
      }
    },
    unSuccessQuest() {
      return _.filter(this.executionQuestList, (item) => {
        return item.success_state == 0;
      });
    },
  },
  async mounted() {
    this.questGroup = await this.loadQuestGroup();
    this.quest = await this.loadQuest();
    this.executionQuestList = await this.loadExecutionQuestList();
  },
  methods: {
    loadQuestGroup() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/selectQuestGroup/${this.linked[0].id}`)
          .then((res) => {
            resolve(res.data);
          });
      });
    },
    loadQuest() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/selectQuest/${this.questGroup[0].id}`)
          .then((res) => {
            let list = _.sortBy(res.data, (item) => {
              return item.start_date;
            });

            resolve(list);
          });
      });
    },
    loadExecutionQuestList() {
      return new Promise((resolve) => {
        this.$axios
          .get(`/api/executionQuest/${this.questGroup[0].id}`)
          .then((res) => {
            let list = _.sortBy(res.data, (item) => {
              return item.start_date;
            });

            resolve(list);
          });
      });
    },
    onUploadImage() {
      let formData = new FormData();

      window.setTimeout(() => {
        formData.append("profile_image", this.form.profile_image);
        console.log("THIS.FORM.PROFILE_IMAGE", this.form.profile_image);

        this.$axios
          .post("/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            this.uploadImage = `/uploads/${res.data}`;
            this.imageFile = `/uploads/${res.data}`;

            this.$forceUpdate();
          });
      });
    },
    no() {
      this.uploadImage = ``;
      this.imageFile = ``;
    },
    yes() {
      this.$axios
        .post(`/api/executionQuest/${this.unSuccessQuest[0].id}`, {
          execution_pic: this.uploadImage,
        })
        .then((res) => {
          this.$router.push({ path: "/baby/quest/confirm" });
        });
    },
  },
};
</script>

<style lang="scss">
#perform {
  .profile-image-wrapper {
    position: relative;
    margin: rem(90px) auto rem(33px);
    width: rem(100px);
    height: rem(100px);

    .box-file-input {
      position: absolute;
      z-index: 6;
      text-align: center;
      left: 0;
      right: 0;
      width: rem(100px);
      height: rem(100px);
    }

    .box-file-input .form-group {
      margin-bottom: 0;
    }

    .box-file-input label {
      display: inline-block;
      background: #497ff5;
      color: #fff;
      cursor: pointer;
      border-radius: 100%;
    }

    .box-file-input label:after {
      background-size: rem(42.75px) rem(38px);
      display: inline-block;
      background-position: rem(30px) rem(30px);
      background-repeat: no-repeat;
      width: rem(100px);
      height: rem(95px);
      content: "";
      background-image: url(/images/icon-camera.svg);
    }

    .box-file-input input[type="file"] {
      display: none;
    }

    .box-file-input .filename {
      display: inline-block;
      padding-left: 10px;
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
  position: relative;

  &:after {
    content: "";
    background: url("/images/icon-carrot2.svg");
    position: absolute;
    bottom: rem(-50px);
    right: 0;
    width: 127px;
    height: 127px;
  }

  .upload-image {
    max-width: 100%;
    border-radius: rem(16px);
    max-height: rem(350px);
  }
}

.send-picture-text {
  text-align: center;
  font-size: rem(20px);
  margin-bottom: rem(40px);
}
</style>
