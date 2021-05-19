  <template>
    <div>
        <top></top>
        <div class="text-center">
            <p class="qr">
              <img src="/images/frame.png" />
            </p>
            <div class="divine"></div>
            <div class="slider-wrapper">
              <b-carousel
                id="carousel-1"
                style="text-shadow: 0px 0px 2px #000"
                indicators
                controls
                img-height="480"
              >
                <b-carousel-slide>
                  <p class="number">01</p>
                  <p class="title">QR코드를 스캔하여<br />엄마의 퀘스트를 설치해 주세요.</p>
                </b-carousel-slide>
                <b-carousel-slide>
                  <p class="number">02</p>
                  <p class="title">설치가 다 되었다면<br />자녀의 닉네임까지 만들어 주세요!</p>
                </b-carousel-slide>
              </b-carousel>
              <div class="buttons">
                <b-button variant="primary" @click="$router.push({path:'/mom/search-baby'})">준비가 다 되었나요?
                </b-button>
              </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    import LoginCheck from '@/mixins/loginCheck.js'
    import Top from '@/components/top';

    export default {
        components: {
            'top': Top,
        },
        mixins:[LoginCheck],
        data () {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style lang="scss">
.carousel-indicators {
  margin-bottom: 2rem;
}

.carousel-indicators li {
  border-radius: 100%;
  background: #eee;
  padding:0;
  border:0;
  width:10px;
  height: 10px;

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
  color:#000 !important;
  text-shadow:none;
  left:0;
  right:0;
}
</style>

<style lang="scss" scoped>
  @import "~@/assets/scss/common.scss";

  .qr {
    height: rem(80px);
    margin:rem(56px) 0 rem(230px);
  }

  .title {
    font-size: rem(20px);
    font-family: NotoSansCJKkr-Regular;
    line-height: rem(30px);
    letter-spacing: -1px;
    margin-bottom: rem(37px);
  }

  .app-link {
    font-size: rem(12px);
    font-family: NotoSansCJKkr-Regular;
    line-height: rem(40px);
    color:#1773e2;
    text-decoration: underline;
    margin-bottom: rem(104px);
    display: block;
  }

  .number {
    font-family: NotoSansCJKkr-Bold;
    color:#497ff5;
    font-weight: bold;
  }

  .slider-wrapper {
    position: absolute;
    bottom:rem(60px);
    width:100%;
    left:0;
    right:0;
  }

  .buttons {
    padding:0 rem(24px);
  }
</style>
