const serverMessages = {
	rand_msg: [
		{
			kind: "rand_msg",
			game_data: {
				balls: [],
				end_bets_expected: "",
				game_id: 9,
				game_state: 2,
				total_win: 0
			}
		},{
			kind: "rand_msg",
			game_data: {
				balls: [28],
				end_bets_expected: "",
				game_id: 9,
				game_state: 2,
				total_win: 10000
			}
		},{
			kind: "rand_msg",
			game_data: {
				balls: [28],
				end_bets_expected: "2017-06-16T12:00:00Z",
				game_id: 10,
				game_state: 1,
				total_win: 0
			}
		}
	],
	init_msg: [
		{
			kind: "init_msg",
			lang: "ru",
			prev_game_kind: -1,
			auth: {
				balance: 10000.456,
				bonus: 24000,
				kind: "by_card",
				nickname: "Maika",
			},
			bets: [],
			// bets: [
			// 	{price: 300, bonus: false, content: {kind: "numbers", numbers: [5, 4]}},
			// 	{price: 300, bonus: false, content: {kind: "numbers", numbers: [25, 26, 28, 29]}},
			// 	{price: 500, bonus: false, content: {kind: "dozen", dozen: 1}}
			// ],
			game_data: {
				balls: [24],
				end_bets_expected: "2017-06-16T12:20:00Z",
				game_id: 4,
				game_state: 1,
				total_win: 0,
			}
		},
		{
			kind:"init_msg",
			lang:"ru",
			prev_game_kind:-1,
			auth:{
				balance:335200,
				bonus:48000,
				kind:"by_card",
				nickname:"Maika"
			},
			bets:[
				{bonus:false, content:{kind:"numbers", numbers:[16]}, price:3000}
			],
			game_data: {
				balls:[16],
				end_bets_expected:"",
				game_id:787,
				game_state:2,
				total_win:105000
			}
		},
		{
			kind:"init_msg",
			lang:"ru",
			prev_game_kind:-1,
			auth: {
				balance:5000,
				bonus:54000,
				kind:"by_card",
				nickname:"Maika"
			},
			bets:[
				// {bonus:false, content: {kind:"red"}, price:1000}
				// {bonus:false, content:{kind:"numbers", numbers:[16]}, price:3000}
				// {bonus:false, content:{kind:"dozen", dozen:1}, price:3000}
				{bonus:false, content:{kind:"column", column:1}, price:1000}
			],
			game_data:{
				balls:[1],
				end_bets_expected:"",
				game_id:832,
				game_state:2,
				total_win: 1000
			}
		}
	],
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
			{price: 300, bonus: false, content: {kind: "numbers", numbers: [5, 4]}},
			{price: 300, bonus: false, content: {kind: "numbers", numbers: [25, 26, 28, 29]}},
			{price: 500, bonus: false, content: {kind: "dozen", dozen: 1}}
		],
	},
	bets_ok_msg: {
		kind: "bets_ok_msg",
		balance: 8200,
		bonus: 12.3,
	}
};

export default serverMessages;