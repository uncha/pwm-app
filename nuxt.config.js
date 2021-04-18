export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  generate: {
    dir: '../uncha_pwm/public'
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'pwm-app',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src:
          "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
      },
      {
        type: "text/javascript",
        src: "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js",
      },
      // API js : https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js
      {
        type: "text/javascript",
        src: "https://developers.kakao.com/sdk/js/kakao.min.js",
      },
      // {
      //   type: "text/javascript",
      //   src: "https://apis.google.com/js/platform.js?onload=renderButton",
      // },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
      "~plugins/GlobalComponents.js",
      { src: "~/plugins/persistedState.client.js" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  env: {
    kakaoJsKey: process.env.KAKAO_JAVASCRIPT_KEY,
    kakaoRestKey: process.env.KAKAO_RESTAPI_KEY,
    naverApiKey: process.env.NODE_ENV === 'production' ? process.env.NAVER_API_KEY : process.env.NAVER_API_KEY2,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    appleClientId: process.env.APPLE_CLIENT_ID,
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios'
  ],

  axios: {
		baseURL: process.env.NODE_ENV === 'production'
				? '/'
				: 'http://localhost:9102' // Used as fallback if no runtime config is provided
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
