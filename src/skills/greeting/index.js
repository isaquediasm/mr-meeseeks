function handleGreeting(message) {
	console.log('##uhu', message)
}

export const Greeting = {
	name: 'Greeting',
	description: 'Ability to greet you',
	intents: [
		{
			name: 'greeting',
			handler: handleGreeting,
			languageModels: {
				en: [
					{
						input: 'hi',
						answer: 'hello buddy',
					},
					{ input: 'hey there', answer: 'hey mate, how is it going?' },
					{ input: 'hello', answer: 'Hi there!' },
					{ input: 'hey ho', answer: 'hey!' },
				],
			},
		},
	],
}
