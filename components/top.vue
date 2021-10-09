<template>
  <div
    class="top-area"
    :class="{'bg-white':whiteBg == true}"
  >
    <b-button
      v-if="hideBack!=true"
      class="btn-back"
      @click.prevent="back"
      variant="mute"
    ><img src="/images/btn-back02.svg" /></b-button>
    <b-button
      class="btn-link bg0"
      v-if="link"
    >
      <img
        src="/images/face.png"
        class="face"
      />
      {{link.baby_nick_names}}
    </b-button>
    <span class="message">{{message}}</span>
    <side-bar
      :links="links"
      v-if="links.length > 0"
    ></side-bar>
  </div>
</template>

<script>
import SideBar from "@/components/mom/side-bar";

export default {
  components: {
    "side-bar": SideBar,
  },
  props: {
    whiteBg: {
      type: Boolean,
      require: false,
      default: false,
    },
    link: {
      type: Object,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
    backURL: {
      type: String,
      required: false,
      default: null,
    },
    hideBack: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  computed: {
    authUser() {
      return this.$store.getters["authUser"];
    },
  },
  async fetch() {
    await this.$axios
      .get(`/api/linked/mom`, {
        params: {
          mom_nick_name: this.authUser,
        },
      })
      .then((res) => {
        this.links = res.data;

        _.forEach(this.links, (item, i) => {
          this.$axios.get(`/api/user/${item.baby_nick_names}`).then((res) => {
            this.$set(item, "profile_image", res.data[0].profile_image);
          });
        });
      });
  },
  data() {
    return {
      links: [],
    };
  },
  methods: {
    back() {
      if (!this.backURL) {
        this.$router.go(-1);
      } else {
        this.$router.push({ path: this.backURL });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.top-area {
  position: fixed;
  top: 0;
  //background: #FFF;
  z-index: 999;
  width: 100%;
  left: 0;
  padding: rem(38px) rem(10px) 0;
  margin-bottom: rem(30px);
}

.btn-back {
  width: auto;
  height: auto;
  padding: 0 rem(10px);
}

.btn-link {
  border: 1px solid #dddddd;
  border-radius: rem(100px);
  padding: rem(2px) rem(15px) rem(2px) rem(2px);
  font-size: rem(14px);
  color: #000;
  text-decoration: none;
  margin-right: rem(12px);
  left: rem(-12px);
  position: relative;

  &.bg0 {
    background: #ff7ba6;
    color: #fff;
  }

  &.bg1 {
    background: #7b97ff;
    color: #fff;
  }
}

.face {
  width: rem(44px);
  height: rem(44px);
  border-radius: 100%;
  margin-right: rem(6px);
}

.face2 {
  width: rem(36px);
  height: rem(32px);
  margin-right: rem(6px);
}

.message {
  position: relative;
  left: -14px;
  top: 2px;
}
</style>
