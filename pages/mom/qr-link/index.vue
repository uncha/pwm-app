  <template>
  <div id="qr-link">
    <top></top>
    <div class="text-center">

      <!-- <b-carousel
        id="carousel-2"
        style="text-shadow: 0px 0px 2px #000"
        indicators
        controls
      >
        <b-carousel-slide>
          <div class="qr">
            <img src="/images/qr.svg" />
            <p class="mt-1 text-left qr-type"><img src="/images/icon-android.svg" /> Android</p>
          </div>
        </b-carousel-slide>
        <b-carousel-slide>
          <div class="qr">
            <img src="/images/qr.svg" />
            <p class="mt-1 text-left qr-type"><img src="/images/icon-ios.svg" /> ios</p>
          </div>
        </b-carousel-slide>
      </b-carousel> -->

      <b-tabs content-class="mt-3">
        <b-tab
          title="Android"
          active
        >
          <p>
            <img src="/images/and-qr.svg">
          </p>
        </b-tab>
        <b-tab title="ios">
          <img src="/images/ios-qr.svg">
        </b-tab>
      </b-tabs>

      <div class="bottom-wrap">
        <b-button
          variant="primary"
          @click="$router.push({path:'/mom/search-baby'})"
        >준비가 다 되었나요?
        </b-button>
      </div>
      <div class="slider-wrapper">
        <b-carousel
          id="carousel-1"
          style="text-shadow: 0px 0px 2px #000"
          indicators
          controls
          img-height="480"
        >
          <b-carousel-slide>
            <p class="number text-primary">01</p>
            <p class="title pb-6">QR코드를 스캔하여<br />엄마의 퀘스트를 설치해 주세요.</p>
          </b-carousel-slide>
          <b-carousel-slide>
            <p class="number text-primary">02</p>
            <p class="title pb-6">설치가 다 되었다면<br />자녀의 닉네임까지 만들어 주세요!</p>
          </b-carousel-slide>
        </b-carousel>
        <div class="bottom-wrap">
          <b-button
            variant="primary"
            @click="$router.push({path:'/mom/search-baby'})"
          >준비가 다 되었나요?
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import LoginCheck from "@/mixins/loginCheck.js";
import Top from "@/components/top";

export default {
  components: {
    top: Top,
  },
  mixins: [LoginCheck],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
#qr-link {
  .nav-tabs {
    .nav-item {
      width: 50%;

      .nav-link {
        border: 1px solid #1ec89b;
        color: #1ec89b;
        border-radius: 0;

        &.active {
          background: #1ec89b;
          color: #fff;
        }
      }

      &:first-child {
        .nav-link {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }
      }

      &:last-child {
        .nav-link {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
    }
  }

  .tab-content {
    padding-top: rem(35px);
  }
}

.carousel-indicators {
  margin-bottom: 2rem;
  right: auto;
  margin-left: rem(30px);
}

.carousel-indicators li {
  border-radius: 100%;
  background: #eee;
  padding: 0;
  border: 0;
  width: 10px;
  height: 10px;
  margin-right: rem(5px);

  &.active {
    background: #497ff5;
  }
}

.carousel-inner {
  height: 200px;
}

.carousel-item {
  height: 200px;
}

.carousel-caption {
  color: #000 !important;
  text-shadow: none;
  left: 0;
  right: 0;

  .title,
  .number {
    text-align: left;
    padding-left: rem(24px);
  }
}
</style>

<style lang="scss" scoped>
.slider-wrapper {
  position: absolute;
  bottom: rem(120px);
  width: 100%;
  left: 0;
  right: 0;
}

.qr-type {
  max-width: rem(128px);
  margin: 0 auto;
}
</style>
