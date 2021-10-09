<template>
  <div id="gift">
    <top :whiteBg="true"></top>
    <template v-if="uploadImage">
      <h1>
        이 보상으로 괜찮나요?
      </h1>
      <p class="text-center upload-image-wrap">
        <img
          class="upload-image"
          :src="giftImageURL"
        />
      </p>
      <div class="bottom-wrap">
        <b-row>
          <b-col cols="4">
            <b-button
              variant="light"
              @click="uploadImage=''"
            >아니요
            </b-button>
          </b-col>
          <b-col cols="8">
            <b-button
              variant="primary"
              @click="yes"
            >네
            </b-button>
          </b-col>
        </b-row>
      </div>
    </template>
    <template v-else>
      <div>
        <h1 class="mb-0">
          보상은 무엇으로 할까요?
        </h1>
        <p class="description">평소에 가지고 싶어했던 것을<br />
          캡쳐하거나 찍어서 올려주세요.</p>
      </div>
      <p class="text-center mt-5">
        <img
          class="img-gift-box"
          src="/images/gift-box.jpg"
        />
      </p>
      <div class="bottom-wrap ">
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
          </div>
        </div>
      </div>
    </template>
  </div>
</template>


<script type="text/javascript">
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import LoginCheck from "@/mixins/loginCheck.js";
import Top from "@/components/top";

export default {
  mixins: [validationMixin, LoginCheck],
  components: {
    top: Top,
  },
  data() {
    return {
      form: {
        profile_image: [],
      },
      confirmed: "",
      uploadImage: "",
      imageFile: "",
    };
  },
  computed: {
    questList() {
      return this.$store.getters["questList"];
    },
    selectCount() {
      return this.$store.getters["selectCount"];
    },
    giftImageURL() {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${this.uploadImage}`;
      } else {
        return this.uploadImage;
      }
    },
  },
  methods: {
    onUploadImage() {
      let formData = new FormData();

      window.setTimeout(() => {
        formData.append("profile_image", this.form.profile_image);

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
    yes() {
      this.$store.commit("setGift", this.uploadImage);

      this.$router.push({ path: "confirm" });
    },
  },
};
</script>

<style lang="scss">
#gift {
  .profile-image-wrapper {
    position: relative;
    margin: rem(90px) auto rem(33px);

    .box-file-input {
      position: absolute;
      z-index: 6;
      text-align: center;
      left: 0;
      right: 0;
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
      background-size: rem(36px) rem(32px);
      display: inline-block;
      background-position: center;
      background-repeat: no-repeat;
      width: rem(64px);
      height: rem(59px);
      content: "";
    }

    .box-file-input input[type="file"] {
      display: none;
    }

    .box-file-input .filename {
      display: inline-block;
      padding-left: 10px;
    }
  }

  .img-gift-box {
    max-width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.title {
  font-size: rem(24px);
  line-height: rem(30px);
  margin-top: rem(100px);
}

.description {
  font-size: rem(16px);
  line-height: rem(24px);
  color: #497ff5;
  margin-top: rem(20px);
  margin-bottom: 0;
}

.upload-image-wrap {
  padding-bottom: rem(150px);
  .upload-image {
    border-radius: rem(16px);
    max-width: 100%;
    max-height: rem(550px);
  }
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

.bottom-wrap {
}
</style>
