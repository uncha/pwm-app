import Vuex from 'vuex';
import * as types from "./mutation-types";
import Baby from './modules/baby';

const createStore = () => {
	return new Vuex.Store({
		namespaced: true,
		state: () => ({
			authUser: '',
      socialId: '',
      socialLoginType:'',
			signType: null,
			token: "",
			questList:[],
			successCount:1,
			gift:'',
			selectLink:'',
		}),
		getters: {
				authUser: state => state.authUser,
        socialId: state => state.socialId,
        socialLoginType: state => state.socialLoginType,
				questList: state => state.questList,
				successCount: state => state.successCount,
				gift:state => state.gift,
				selectLink:state => state.selectLink,
		},
		mutations: {
					setUser(state, data) {
							state.authUser = data;
					},
          setSocialId(state, data) {
              state.socialId = data;
          },
          setSocialLoginType(state, data) {
              state.socialLoginType = data;
          },
					setQuestList(state, data) {
							state.questList = data;
					},
					setSuccessCount(state, data) {
							state.successCount = data
					},
					setGift(state, data) {
							state.gift = data
					},
					setSelectLink(state, data) {
							state.selectLink = data
					},
					SIGN_IN (state, type) {
	          	state.signType = type;
	        },
	        SIGN_OUT(state) {
	          	state.signType = null;
	        },
  				SET_TOKEN(state, token) {
	          	state.token = token;
	        },
		},
    actions: {
					signInAction({ commit }, type) {
	          commit(types.SIGN_IN, type);
	        },
	        signOutAction({ commit }) {
	          commit(types.SIGN_OUT);
	        },
	        setTokenAction({ commit }, token) {
	          commit(types.SET_TOKEN, token);
	        },
		},
		modules: {
			Baby
		},
	});
};

export default createStore;
