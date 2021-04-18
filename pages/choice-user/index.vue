<template>
    <div class="login">
        <h1 class="title">
            안녕하세요.<br />
            당신은 누구십니까?
        </h1>

        <div class="text-center">
            <!-- <b-button @click="$router.push({path:'/mom/create-nickname'})">
            </b-button> -->
            <a class="mom-group" href="#" @click.prevent="$router.push({path:'/mom/create-nickname'})">
                <p class="mom"><img src="/images/icon_mom.png" /></p>
                <p class="tit">
                    엄마
                </p>
            </a>
            <a class="baby-group" href="#" @click.prevent="$router.push({path:'/baby/create-nickname'})">
                <p class="baby"><img src="/images/icon_baby.png" /></p>
                <p class="tit">
                    자녀
                </p>
            </a>
        </div>
    </div>
</template>

<script type="text/javascript">
    import Top from '@/components/top';

    export default {
        components: {
            'top': Top,
        },
        computed: {
            socialId () {
                return this.$store.getters['socialId']
            }
        },
        mounted () {
            if(!this.socialId) {
                this.$router.push({path:'/'})
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "~@/assets/scss/common.scss";

    .login {
        padding: rem(150px) rem(20px) 0 rem(20px);

        .title {
            font-size: rem(32px);
            line-height: rem(44px);
            letter-spacing: rem(-0.5px);
        }

        %group {
            display: inline-block;
            margin:rem(172px) rem(20px) rem(186px) rem(20px);
            font-family: NotoSansMonoCJKkr-Regular;
            font-size: rem(20px);
            text-decoration: none;
            color:#000;

            .tit{
                line-height: rem(24px);
            }
        }

        .mom-group {
            @extend %group;
        }

        .baby-group {
            @extend %group;
        }

        %circle {
            width: rem(100px);
            line-height: rem(100px);
            border-radius: 100%;
            display: block;
        }

        .form-wrap {
          overflow: hidden;
        }

        .mom {
            @extend %circle;
            border:1px solid #f1cef5;

            img {
                width: rem(68px);
                margin-top:rem(-5px);
            }
        }

        .baby {
            @extend %circle;
            border:1px solid #bfe8f7;

            img {
                width: rem(50px);
            }
        }
    }
</style>
