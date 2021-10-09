<template>
  <div class="contents">
    <Nuxt />
  </div>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import moment from "moment";
import BaseMixin from "@/mixins/base.js";

if (!Vue.__my_mixin__) {
  Vue.__my__mixin__ = true;
  Vue.mixin({
    mixins: [BaseMixin],
  });
}

export default {
  created() {
    window._ = _;
    window.moment = moment;
  },
  watch: {
    "$route.path"() {
      if (
        this.$route.path == "/baby/quest/complete" ||
        this.$route.path == "/mom/quest/ing/complete"
      ) {
        $("html").addClass("pollen");
      } else {
        $("html").removeClass("pollen");
      }

      if (this.$route.path == "/baby/quest/confirm") {
        $("html").addClass("full-size");
      } else {
        $("html").removeClass("full-size");
      }

      if (this.$route.path == "/baby/quest/tutorial") {
        $("html").addClass("full-size-white");
      } else {
        $("html").removeClass("full-size-white");
      }

      if (this.$route.path == "/baby/search-mom") {
        $("html").addClass("full-size-search-mom");
      } else {
        $("html").removeClass("full-size-search-mom");
      }

      // if (this.$route.path == "/mom/qr-link") {
      //   $(".contents").addClass("qr");
      // } else {
      //   $(".contents").removeClass("qr");
      // }
    },
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: "NotoSansCJKkr-Medium";
  font-style: normal;
  font-weight: normal;
  src: url(/fonts/NotoSansCJKkr/NotoSansCJKkr-Medium.otf) format("woff2"),
    url(/fonts/NotoSansCJKkr/NotoSansCJKkr-Medium.otf) format("woff"),
    url(/fonts/NotoSansCJKkr/NotoSansCJKkr-Medium.otf) format("opentype");
}

@font-face {
  font-family: "NotoSansCJKkr-Bold";
  font-style: normal;
  font-weight: normal;
  src: url(/fonts/NotoSansCJKkr/NotoSansCJKkr-Bold.otf) format("woff2"),
    url(/fonts/NotoSansCJKkr/NotoSansCJKkr-Bold.otf) format("woff"),
    url(/fonts/NotoSansCJKkr/NotoSansCJKkr-Bold.otf) format("opentype");
}

@font-face {
  font-family: "NotoSansMonoCJKkr-Regular";
  font-style: normal;
  font-weight: normal;
  src: url(/fonts/NotoSansCJKkr/NotoSansMonoCJKkr-Regular.otf) format("woff2"),
    url(/fonts/NotoSansCJKkr/NotoSansMonoCJKkr-Regular.otf) format("woff"),
    url(/fonts/NotoSansCJKkr/NotoSansMonoCJKkr-Regular.otf) format("opentype");
}

@font-face {
  font-family: "Rubik-Light";
  font-style: normal;
  font-weight: normal;
  src: url("/fonts/Rubik/Rubik-Light.ttf") format("truetype");
}

html {
  font-family: "NotoSansCJKkr-Medium";
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;

  &.pollen {
    background: url("/images/img_pollen.png");
    background-size: contain;
  }
}

body {
  font-family: "NotoSansCJKkr-Medium";
  background: transparent;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  line-height: 150%;
}

.contents {
  padding: 0 rem(24px);
  padding-top: rem(110px);
  //background: red;

  &.qr {
    background: #f9f9f9;
  }
}

.full-size {
  background: #1ec89b;

  .top-area {
    background: #1ec89b !important;
  }

  .contents {
  }
}

.full-size-white {
  .contents {
    padding-top: 0 !important;
  }
}

.full-size-search-mom {
  background: url("/images/baby-ing-bg.jpg");
  background-size: cover;
}

header.header {
  position: fixed;
  top: 0;
  padding-top: rem(26px);
}

%input {
  border: 0;
  border-bottom: 2px solid #000;
  border-radius: 0;
  font-size: rem(18px);
  color: #000;
  padding-left: 0;
}

input[type="text"] {
  @extend %input;
}

input[type="password"] {
  @extend %input;
}

%button {
  width: 100%;
  border-radius: rem(16px) !important;
  font-size: rem(18px);
  padding-top: rem(6px);
  padding-bottom: rem(6px);
  font-weight: 400;
}

.btn-primary {
  @extend %button;

  border: 0;
}

.btn-white {
  @extend %button;

  &:hover {
    background: $primary;
    color: #fff;
  }

  border: 0;
}

.btn-light {
  @extend %button;

  background: #dddddd;
  color: #aaa;
}

.btn-mute {
  @extend %button;

  color: #1d7ff1;
}

ul {
  padding-left: 0;
}

li {
  list-style: none;
}

h1 {
  font-weight: 700;
  font-size: rem(26px);
  line-height: 150%;
  margin-bottom: rem(48px);
}

%box {
  padding: rem(60px) 0 rem(26px);
  text-align: center;
  border-radius: rem(8px);
  color: #fff;
  box-shadow: 0 5px 10px #ccc;

  .description {
    font-size: rem(14px);
  }
  .title {
    font-size: rem(24px);
    line-height: rem(34px);
    margin: 0;
    margin-bottom: rem(166px);
  }
}

.blue-box {
  @extend %box;
  background: #497ff5;
}

.white-box {
  @extend %box;
  background: #fff;
}

.divine {
  width: calc(100vw);
  position: relative;
  left: rem(-24px);
  height: rem(16px);
  background: #f5f5f5;
}

.modal-body {
  padding: 2rem 1rem;
}

.modal-title {
  position: relative;
  left: rem(15px);
  top: rem(20px);
}

.progress {
  height: 0.7rem;

  .progress-bar {
    background: #1ec89b;
  }
}
</style>
