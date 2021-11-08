import { createStore } from "vuex";
import moment from "moment";
import jwt_decode from "jwt-decode";

export default createStore({
	state: {
		userId: null,
		// token:null,
		isAdmin: 0,
		deliveryDate: null,
		products: [],
		order: [],
		total: 0,
		logged: false,
		token: null,
		infoHome: "",
	},
	mutations: {
		setUserId(state, userId) {
			state.userId = userId;
		},
		setToken(state, token) {
			state.token = token;
		},
		setAdmin(state, isAdmin) {
			state.isAdmin = isAdmin;
		},
		setDeliveryDate(state, deliveryDate) {
			state.deliveryDate = deliveryDate;
		},
		setProducts(state, products) {
			state.products = products;
		},
		// setOrder(state, order) {
		// 	state.order = order;
		// },
		setTotal(state, total) {
			state.total = total;
		},
		setInfo(state) {
			state.infoHome = "Ta session a expiré.";
		},
		IS_TRUE(state) {
			state.logged = true;
		},
		IS_FALSE(state) {
			state.logged = false;
		},
	},
	getters: {
		dateNow() {
			moment.locale("fr");
			return Date.now();
			// return moment(Date.now()).format("DD MMMM YYYY");
		},
		dayNow() {
			return new Date().getDay(); // day of the week of today (0-Sunday 6-Saturday)
		},
		gapDays(state, getters) {
			// gap with the next friday
			if (5 - getters.dayNow == -1) {
				return 6;
			} else {
				if (5 - getters.dayNow == 0) {
					return 7;
				} else {
					return 5 - getters.dayNow;
				}
			}
		},
		deliveryDate(state, getters) {
			let res = new Date(getters.dateNow);
			res.setDate(res.getDate() + getters.gapDays);
			moment.locale("fr");
			return "Vendredi " + moment(res).format("D MMMM YYYY");
		},
		decoded(state) {
			return jwt_decode(state.token);
		},
		dateExp(state, getters) {
			return new Date(getters.decoded.exp * 1000);
		},
	},
	actions: {
		checkConnect(context) {
			context.commit("setToken", localStorage.getItem("token"));
			context.commit("setUserId", localStorage.getItem("userId"));
			if (context.state.token) {
				if (this.getters.dateExp > this.getters.dateNow) {
					context.commit("IS_TRUE");
				} else {
					context.commit("IS_FALSE");
					context.commit("setInfo");
					localStorage.clear();
				}
			} else {
				context.commit("IS_FALSE");
			}
		},
		disconnect(context) {
			context.commit("IS_FALSE");
		},
	},
});
