function setup() {
	noCanvas();

	// let lang = navigator.language || 'en-US';
	// let speechRec = new p5.SpeechRec(lang, gotSpeech);
	// speechRec.start();

	// function gotSpeech() {
	// 	console.log(speechRec);
	// }


	let bot = new RiveScript();
	bot.loadFile("brain.rive", brainReady, brainError);

	function brainReady() {
		console.log('Chatbot ready!');
		bot.sortReplies();
	}

	function brainError() {
		console.log('Chatbot error!');
	}

	let button = select('#submit');
	let user_input = select('#user_input');
	let output = select('#output');

	button.mousePressed(chat);

	function chat() {
		console.log('listening!')
		let input = user_input.value();
		let reply = bot.reply('local-user', input);

		output.html(reply);
	}
}