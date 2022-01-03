import { createStore } from "vuex";
import moment from "moment";
import jwt_decode from "jwt-decode";

export default createStore({
	state: {
		userId: null,
		isAdmin: 0,
		// deliveryDate: null,
		products: [],
		order: [],
		total: localStorage.getItem("Total"),
		connected: false,
		token: null,
		infoHome: "",
		inPages: true,
		newUser: false,
		expired: false,
		deleted: false,
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
		setDeleted(state, deleted) {
			state.deleted = deleted;
		},
		// setDeliveryDate(state, deliveryDate) {
		// 	state.deliveryDate = deliveryDate;
		// },
		setProducts(state, products) {
			state.products = products;
		},
		setNewUser(state) {
			state.newUser = true;
		},
		setNewUserAnymore(state) {
			state.newUser = false;
		},
		setTotal(state, total) {
			state.total = total;
		},
		setInfo(state) {
			state.infoHome = "Ta session a expiré.";
		},
		setExpired(state) {
			state.expired = true;
		},
		IS_TRUE(state) {
			state.connected = true;
		},
		IS_FALSE(state) {
			state.connected = false;
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
			// Change delivery date at the Thursday night
			let res = new Date(getters.dateNow);
			res.setDate(res.getDate() + getters.gapDays);
			moment.locale("fr");
			return "Vendredi " + moment(res).format("D MMMM YYYY");
		},
		deliveryDateNextW(state, getters) {
			// Date of Friday in following week
			// Change delivery date at the Thursday night
			let res = new Date(getters.dateNow);
			res.setDate(res.getDate() + getters.gapDays + 7);
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
			// context.commit("setAdmin", localStorage.getItem("isAdmin"));
			if (context.state.token) {
				if (this.getters.dateExp > this.getters.dateNow) {
					context.commit("IS_TRUE");
				} else {
					context.commit("IS_FALSE");
					context.commit("setInfo");
					context.commit("setExpired");
					localStorage.clear();
				}
			} else {
				context.commit("IS_FALSE");
			}
		},
		disconnect(context) {
			context.commit("IS_FALSE");
			context.commit("setAdmin", 0);
		},
	},
});
