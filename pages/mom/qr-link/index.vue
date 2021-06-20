  <template>
  <div>
    <top></top>
    <div class="text-center">

      <b-carousel
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
      </b-carousel>
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
.carousel-indicators {
  margin-bottom: 2rem;
  // left: auto;
  // right: auto;
  // margin-left: rem(24px);
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
