<template>
  <div class="contents">
    <Nuxt />
  </div>
</template>

<script>
import Vue from 'vue';
import _ from 'lodash'
import moment from 'moment';
import BaseMixin from '@/mixins/base.js';

if (!Vue.__my_mixin__) {
	Vue.__my__mixin__ = true;
	Vue.mixin({
		mixins: [BaseMixin],
	});
}

export default {
    created () {
        window._ = _
        window.moment = moment
    },
}
</script>

<style lang="scss">
@import "~@/assets/scss/common.scss";

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

html {
  font-family:'NotoSansCJKkr-Medium';
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
    font-family:'NotoSansCJKkr-Medium';
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.contents {
    padding: 0 rem(24px);
}

header.header {
  position: fixed;
  top:0;
  padding-top:rem(26px);
}

input[type="text"] {
    border:0;
    border-bottom: 2px solid #000;
    border-radius: 0;
    font-size: rem(18px);
    color:#000;
}

%button {
    width:100%;
    height: rem(56px);
    border-radius: rem(28px) !important;
    font-size: rem(18px);
}

.btn-primary {
  @extend %button;

  background:linear-gradient(180deg, #29c3dc, #17addf);
  border:0;
}

.btn-light {
  @extend %button;

  background: #eee;
  color:#aaa;
}

ul {
  padding-left:0;
}

li {
  list-style: none;
}

%box {
  padding: rem(60px) 0 rem(26px);
  text-align: center;
  border-radius: rem(8px);
  color:#FFF;
  box-shadow: 0 5px 10px #CCC;

  .description {
    font-size: rem(14px);
  }
  .title {
    font-size: rem(24px);
    line-height: rem(34px);
    margin:0;
    margin-bottom: rem(166px);
  }
}

.blue-box {
  @extend %box;
  background: #497ff5;
}

.white-box {
  @extend %box;
  background: #FFF;
}

.divine {
  width: calc(100vw);
  position: relative;
  left: rem(-24px);
  height: rem(16px);
  background: #f5f5f5;
}
</style>
