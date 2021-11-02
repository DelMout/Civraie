import { createStore } from "vuex";
import moment from "moment";

export default createStore({
	state: {
		userId: null,
		// token:null,
		isAdmin: 0,
		deliveryDate: null,
		products: [],
	},
	mutations: {
		setUserId(state, userId) {
			state.userId = userId;
		},
		// setToken(state, token) {
		// 	state.token = token;
		// },
		setAdmin(state, isAdmin) {
			state.isAdmin = isAdmin;
		},
		setDeliveryDate(state, deliveryDate) {
			state.deliveryDate = deliveryDate;
		},
		setProducts(state, products) {
			state.products = products;
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
		// decoded(state) {
		// 	return jwt_decode(state.token);
		// },
		// dateExp(state, getters) {
		// 	return new Date(getters.decoded.exp * 1000);
		// },
	},
});
