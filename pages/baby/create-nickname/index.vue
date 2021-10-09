<template>
  <div id="create-nickname">
    <top></top>
    <h1>프로필 사진과<br>
      닉네임을 정해 주세요!</h1>
    <b-form @submit.stop.prevent="onSubmit">
      <b-row>
        <b-col cols="3">
          <div class="profile-image-wrapper">
            <div class="upload-image">
              <template v-if="uploadImage">
                <!-- <img :src="profileImageURL" /> -->
                <p
                  class="profile-image"
                  style="width:100%; height:100%;"
                  :style="{'background':`url(${profileImageURL})`}"
                ></p>
              </template>
              <template v-else>
                <img src="/images/icon-mom-face2.svg" />
              </template>
            </div>
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
              </label></div>
          </div>
        </b-col>
        <b-col cols="9">
          <div class="form-wrap">
            <b-form-group :label="''">
              <b-input
                :state="validateState('nick_name')"
                v-model="$v.form.nick_name.$model"
                placeholder="닉네임을 입력해 주세요."
                type="text"
              />
            </b-form-group>
            <template v-if="confirmed !== ''">
              <template v-if="confirmed==false">
                <p
                  class="des text-danger"
                  style="color:#1773e2"
                >이미 사용중인 닉네임 입니다!</p>
              </template>
              <template v-else>
                <p
                  class="des"
                  style="color:#1773e2"
                >사용 가능한 닉네임 입니다!</p>
              </template>
            </template>
          </div>
        </b-col>
      </b-row>
      <div class="bottom-wrap">
        <template v-if="confirmed === ''">
          <b-button
            class="position-bottom"
            type="submit"
            variant="primary"
          >확인</b-button>
        </template>
        <template v-else>
          <template v-if="confirmed==false">
            <b-button
              class="position-bottom"
              type="submit"
              variant="primary"
            >확인</b-button>
          </template>
          <template v-else>
            <b-button
              class="position-bottom"
              @click="onStart"
              variant="primary"
            >확인</b-button>
          </template>
        </template>
      </div>
    </b-form>
  </div>
</template>

<script type="text/javascript">
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import Top from "@/components/top";

export default {
  components: {
    top: Top,
  },
  mixins: [validationMixin],
  data() {
    return {
      form: {
        profile_image: [],
        nick_name: "",
        profile_image_path: "/uploads/empty-profile.svg",
      },
      confirmed: "",
      uploadImage: "/uploads/empty-profile.svg",
    };
  },
  validations: {
    form: {
      nick_name: {
        required,
        minLength: minLength(3),
      },
    },
  },
  computed: {
    socialId() {
      return this.$store.getters["socialId"];
    },
    socialLoginType() {
      return this.$store.getters["socialLoginType"];
    },
    profileImageURL() {
      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${this.uploadImage}`;
      } else {
        return this.uploadImage;
      }
    },
  },
  mounted() {
    if (!this.socialId) {
      this.$router.push({ path: "/" });
    }
  },
  methods: {
    validateState(nick_name) {
      const { $dirty, $error } = this.$v.form[nick_name];
      return $dirty ? !$error : null;
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.$axios.get(`/api/user/${this.form.nick_name}`).then((res) => {
        if (res.data.length > 0) {
          this.confirmed = false;
        } else {
          this.confirmed = true;
          this.onStart();
        }
      });
    },
    onStart() {
      this.form.user_type = "baby";
      this.form.socialLoginType = this.socialLoginType;
      this.form.socialId = this.socialId;

      let promises = [];

      this.$axios.post("/api/user", this.form).then((res) => {
        this.login();
      });
    },
    login() {
      this.$axios
        .post("/api/login", {
          loginType: this.socialLoginType,
          id: this.socialId,
        })
        .then((res) => {
          console.log("RES", res);

          this.$store.commit("setUser", res.data.nick_name);

          this.$router.push({ path: "/baby/search-mom" });
        });
    },
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
            if (res.data) {
              this.uploadImage = `/uploads/${res.data}`;
              this.form.profile_image_path = `/uploads/${res.data}`;
            } else {
              this.uploadImage = `/uploads/empty-profile.svg`;
              this.form.profile_image_path = `/uploads/empty-profile.svg`;
            }

            this.$forceUpdate();
          });
      });
    },
  },
};
</script>

<style lang="scss">
.des {
  font-size: 12px;
  margin-top: 10px;
}
</style>

<style lang="scss" scoped>
.des {
  font-size: 12px;
  margin-top: 10px;
}

.profile-image {
  background-size: cover !important;
}
</style>