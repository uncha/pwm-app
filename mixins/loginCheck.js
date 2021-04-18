export default {
    computed: {
        authUser () {
            return this.$store.getters['authUser']
        }
    },
    mounted () {
        // if(!this.authUser) {
        //     this.$router.push({path:'/'})
        // }
    },
}
