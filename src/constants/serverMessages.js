const serverMessages = {
	rand_msg: {
		kind: "rand_msg",
		game_data: {
			game_id: 54321,
			game_state: 2,
			balls: [ 28 ],
			total_win: 356500
		}
	},
	init_msg: {
		kind: "init_msg",
		lang: "ru",
		auth: {
			game_id: 54321,
			total_win: 2500,
			balance: 291440,
			game_state: 2,
			end_bets_expected: "",
			balls: [28, 14, 7, 12, 9, 37]
		},
		game_data: {}
	},
	auth_msg: {
		kind: "auth_msg",
		auth: {
			kind: "by_card",
			balance: 123.45,
			bonus: 12.34,
			nickname: "Вася"
		}
	},
	error_msg: {
		kind: "error_msg",
		error_ctx: "auth_error",
		error_code: 1
	},
	exit_msg: {
		kind: "exit_msg"
	},
	srv_lost_msg: {
		kind: "srv_lost_msg"
	},
	loaded_msg: {
		kind: "loaded_msg"
	},
	exited_msg: {
		kind: "exited_msg"
	},
	bets_msg: {
		kind: "bets_msg",
		bets: [
			{
				price: 300,
				bonus: false,
				content: {
					kind: "numbers",
					numbers: [5, 4]
				}
			},
			{
				price: 300,
				bonus: false,
				content: {
					kind: "numbers",
					numbers: [25, 26, 28, 29]
				}
			},
			{
				price: 500,
				bonus: false,
				content: {
					kind: "dozen",
					dozen: 1
				}
			}
		]
	},
	bets_ok_msg: {
		kind: "bets_ok_msg",
		balance: 123.0,
		bonus: 12.3,
	}
};

export default serverMessages;