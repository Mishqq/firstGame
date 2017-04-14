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
			kind: "by_card",
			balance: 123.45,
			bonus: 12.34,
			nickname: "Ведро Гвоздей"
		},
		games: [
			{game_kind: 1, end_bets_expected: "2017-04-12T12:34:56Z"},
			{game_kind: 2, end_bets_expected: "2017-04-12T13:34:56Z"},
			{game_kind: 3, end_bets_expected: "2017-04-12T14:34:56Z"},
			{game_kind: 4, end_bets_expected: "2017-04-12T15:34:56Z"},
			{game_kind: 5, end_bets_expected: "2017-04-12T16:34:56Z"}
		]
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
				price: 250,
				bonus: false,
				content: {
					kind: "numbers",
					numbers: [15, 20, 26]
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


//
//
// window.cppObj = {toJs: {connect: (toJs)=>{
//
// 	setTimeout(()=>{
//
// 		toJs(JSON.stringify({
// 			"kind": "init_msg",
// 			"lang": "ru",
// 			"licensee_id": 1,
// 			"auth": {
// 				"kind": "by_card",
// 				"balance": 123.45,
// 				"nickname": "Ведро Гвоздей"
// 			},
// 			"games": [
// 				{
// 					"game_kind": 1,
// 					"end_bets_expected": "2017-04-12T12:34:56Z"
// 				},
// 				{
// 					"game_kind": 2,
// 					"end_bets_expected": "2017-04-12T13:34:56Z"
// 				},
// 				{
// 					"game_kind": 3,
// 					"end_bets_expected": "2017-04-12T14:34:56Z"
// 				},
// 				{
// 					"game_kind": 4,
// 					"end_bets_expected": "2017-04-12T15:34:56Z"
// 				},
// 				{
// 					"game_kind": 5,
// 					"end_bets_expected": "2017-04-12T16:34:56Z"
// 				},
// 				{
// 					"game_kind": 6,
// 					"end_bets_expected": "2017-04-12T17:34:56Z"
// 				},
// 				{
// 					"game_kind": 7,
// 					"end_bets_expected": "2017-04-12T18:34:56Z"
// 				},
// 				{
// 					"game_kind": 8,
// 					"end_bets_expected": "2017-05-01T19:34:56Z"
// 				},
// 				{
// 					"game_kind": 9,
// 					"end_bets_expected": "2017-04-01T20:34:56Z"
// 				},
// 				{
// 					"game_kind": 10,
// 					"end_bets_expected": "2017-05-01T12:34:56Z"
// 				},
// 				{
// 					"game_kind": 11,
// 					"end_bets_expected": "2017-05-01T12:34:56Z"
// 				},
// 			]
// 		}));
//
// 	}, 1000);
//
// }}};
//
// cppObj.toJs.connect(data=>{
// 	data = JSON.parse(data);
//
// 	if(data.kind == "init_msg") {
// 		model.reinit({user: userFormat(data.auth), games: data.games});
// 	}
// 	else if(data.kind == "games_changed_msg") {
// 		model.games.change(data.games);
// 	}
//
// });

export default serverMessages;