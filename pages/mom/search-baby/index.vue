<template>
  <div>
    <top></top>
    <div class="">
      <h1 class="">자녀의 닉네임을<br />입력해주세요.
      </h1>
      <b-form @submit.stop.prevent="onSubmit">
        <b-form-group>
          <b-input
            v-model="$v.form.nickName.$model"
            :state="validateState('nickName')"
          />
        </b-form-group>
        <div>
          <p
            class="text-danger des"
            v-if="searchFailed == true"
          >
            닉네임을 찾을 수 없습니다.
          </p>
        </div>

        <div class="bottom-wrap">
          <b-button
            type="submit"
            class="mt-4 text-center"
            variant="primary"
          >자녀찾기
          </b-button>
        </div>
      </b-form>
    </div>
    <b-modal
      ref="modal-link-child"
      hide-header
      hide-footer
      centered
    >
      <p
        class="profile-circle"
        :style="{'background':`url(${profileImageURL})`, 'background-size':'cover'}"
      >
        <!-- <img :src="profileImageURL" /> -->
      </p>
      <p />
      <h1 class="text-center mb-2">{{form.nickName}}</h1>
      <template v-if="linkedComplete == false">
        <b-row no-gutters>
          <b-col
            cols="4"
            class="p-1"
          >
            <b-button
              variant="light"
              @click="$refs['modal-link-child'].hide()"
            >아니에요
            </b-button>
          </b-col>
          <b-col
            cols="8"
            class="p-1"
          >
            <b-button
              variant="primary"
              @click="yes"
            >네, 맞아요!
            </b-button>
          </b-col>
        </b-row>
      </template>
      <template v-else>
        <div class="text-center">
          <p class="complete-message">연결 신청이 완료 되었습니다!</p>
          <b-button
            @click="$router.push({path:'/mom/quest/create/start'})"
            variant="primary"
          >확인</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script type="text/javascript">
import LoginCheck from "@/mixins/loginCheck.js";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import Top from "@/components/top";

export default {
  components: {
    top: Top,
  },
  mixins: [validationMixin, LoginCheck],
  data() {
    return {
      linkedComplete: false,
      form: {
        nickName: "",
      },
      searchFailed: false,
      searchBaby: null,
    };
  },
  validations: {
    form: {
      nickName: {
        required,
      },
    },
  },
  computed: {
    authUser() {
      return this.$store.getters["authUser"];
    },
    profileImageURL() {
      if (!this.searchBaby) return "";

      if (window.location.host == "localhost:3000") {
        return `http://localhost:9102${this.searchBaby[0].profile_image}`;
      } else {
        return this.searchBaby[0].profile_image;
      }
    },
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.$axios
        .get(`/api/search-baby/${this.authUser}/${this.form.nickName}`)
        .then((res) => {
          console.log("RES.DATA@@@@", res.data);
          if (res.data.length == 0) {
            this.searchFailed = true;
          } else {
            this.searchFailed = false;
            this.searchBaby = res.data;
            this.$refs["modal-link-child"].show();
          }
        });
    },
    yes() {
      this.$axios
        .post(`/api/linked`, {
          mom_nick_name: this.authUser,
          baby_nick_names: this.form.nickName,
        })
        .then((res) => {
          console.log("RES", res);
          this.linkedComplete = true;
        });

      // this.linkedComplete = true
    },
  },
};
</script>

<style lang="scss" scoped>
.des {
  font-size: rem(12px);
}

.complete-message {
  color: $primary;
  font-size: rem(12px);
  margin-bottom: rem(30px);
}
</style>
