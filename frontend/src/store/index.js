import { createStore } from "vuex";
import moment from "moment";

export default createStore({
	state: {
		userId: null,
		// token:null,
		isAdmin: 0,
		deliveryDate: null,
		incrementDays: null,
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
		setIncrementDays(state, inc) {
			state.incrementDays = inc;
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
			return 5 - getters.dayNow;
		},
		deliveryDate(state, getters) {
			let res = new Date(getters.dateNow);
			res.setDate(res.getDate() + 6);
			moment.locale("fr");
			return "Vendredi " + moment(res).format("DD MMMM YYYY");
		},
		// decoded(state) {
		// 	return jwt_decode(state.token);
		// },
		// dateExp(state, getters) {
		// 	return new Date(getters.decoded.exp * 1000);
		// },
	},
	actions: {
		nextDeliveryDay(context) {
			if (this.getters.gapDays == -1) {
				context.commit("setIncrementDays", 6);
			} else {
				if (this.getters.gapDays == 0) {
					context.commit("setIncrementDays", 7);
				} else {
					context.commit("setIncrementDays", this.getters.gapDays);
				}
			}
		},
	},
});
