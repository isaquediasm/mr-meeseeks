function handleSongRequest(message) {
	console.log('##uhu', message)
}

function handlePlaylistRequest(message) {
	console.log('##uhu', message)
}

export const Music = {
	name: 'Music',
	description: 'Play some nice music',
	intents: [
		{
			name: 'song_request',
			handler: handleSongRequest,
			languageModels: {
				en: [
					{ input: 'play me a song', answer: 'playing you a song...' },
					{ input: 'play me some jazz', answer: 'nice pick!' },
					{
						input: 'play me some nice song from a nice artist',
						answer: 'nice pick!',
					},
				],
			},
		},
	],
}
