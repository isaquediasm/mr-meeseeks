function handleSongRequest(message) {
	console.log('##uhu', message)
}

export const Music = {
	intents: {
		song_request: handleSongRequest,
	},
}
