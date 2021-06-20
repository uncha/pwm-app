<template>
  <div id="select-success-count">
    <top></top>
    <h1 class="mb-0">몇개의 퀘스트를<br />
      완료하면 보상을 줄까요?</h1>

    <div class="swiper-container">
      <div
        class="swiper-wrapper"
        ref="swiper-wrapper"
      >
        <div
          class="swiper-slide"
          v-for="i in questList.length"
        >
          <span class="number">{{i}}</span>
        </div>
      </div>
      <!-- Add Pagination -->
      <div class="swiper-pagination"></div>
    </div>

    <b-button
      class="btn-select"
      variant="primary"
      @click="onSelectComplete"
    >
      다음
    </b-button>
  </div>
</template>

<script>
import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/swiper.scss";
import LoginCheck from "@/mixins/loginCheck.js";
import Top from "@/components/top";

export default {
  mixins: [LoginCheck],
  components: {
    top: Top,
  },
  data() {
    return {
      selectCount: 1,
    };
  },
  computed: {
    questList() {
      return this.$store.getters["questList"];
    },
  },
  mounted() {
    var swiper = new Swiper("#select-success-count .swiper-container", {
      direction: "vertical",
      slidesPerView: 4,
      spaceBetween: 30,
      centeredSlides: true,
      pagination: {
        el: "#select-success-count .swiper-pagination",
        clickable: true,
      },
    });

    let _this = this;
    swiper.on("activeIndexChange", function (swiper) {
      _this.selectCount = swiper.activeIndex + 1;
    });
  },
  methods: {
    onSelectComplete() {
      this.$store.commit("setSuccessCount", this.selectCount);

      this.$router.push({ path: "/mom/quest/create/gift" });
    },
  },
};
</script>

<style lang="scss">
#select-success-count {
  .btn-select {
    position: fixed;
    bottom: rem(40px);
    width: calc(100% - 3rem);
    z-index: 3;
  }

  .swiper-container {
    height: calc(100vh - 18rem) !important;
    margin-left: rem(-24px);
    width: 100vw !important;
  }

  .swiper-slide {
    font-size: rem(100px) !important;
    color: #ccc;
    margin: 0 !important;
    height: rem(120px) !important;
    line-height: rem(120px) !important;

    &.swiper-slide-active {
      background: #ebf4ff !important;
    }

    .number {
      position: relative;
      top: -7px;
    }
  }

  .swiper-slide-prev,
  .swiper-slide-next {
    color: #959595;
  }

  .swiper-slide-active {
    color: #497ff5;
  }

  .title {
    margin-top: rem(100px);
    font-size: rem(24px);
    font-family: NotoSansCJKkr-Regular;
    line-height: rem(30px);
  }

  .swiper-container {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;
    font-family: Rubik-Right;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
}
</style>
