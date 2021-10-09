<template>
  <div class="top-area">
    <a
      class="btn-back"
      href="#"
      @click.prevent="back"
      v-if="backURL"
    ><img src="/images/btn-back02.svg" /></a>
    <side-bar
      :linked="linked"
      v-if="linked.length > 0"
      :theme="theme"
    ></side-bar>
  </div>
</template>

<script>
import SideBar from "@/components/baby/side-bar";

export default {
  components: {
    "side-bar": SideBar,
  },
  props: {
    linked: {
      type: Object,
      required: false,
    },
    backURL: {
      type: String,
      required: false,
      default: null,
    },
    theme: {
      type: String,
      require: false,
      default: "black",
    },
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
  background: #fff;
  z-index: 999;
  width: 100%;
  left: 0;
  padding: rem(46px) rem(10px) rem(10px);
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
