import { createStore } from "vuex";

export default createStore({
	state: {
		userId: null,
		// token:null,
		isAdmin: 0,
		deliveryDate: null,
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
	},
	getters: {
		dateNow() {
			return Date.now();
		},
		dayNow() {
			return new Date().getDay(); // day of the week of today (0-Sunday 6-Saturday)
		},
		gapDays(state, getters) {
			// gap with the next friday
			return 5 - getters.dayNow;
		},
		// decoded(state) {
		// 	return jwt_decode(state.token);
		// },
		// dateExp(state, getters) {
		// 	return new Date(getters.decoded.exp * 1000);
		// },
	},
	// actions: {
	// 	nextDeliveryDay(context,getters) {},
	//! si gapDays<1....
	// },
});
