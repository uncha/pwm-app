import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    key: "sign_info",
    paths: ["signType", "token"],
  })(store);
};
