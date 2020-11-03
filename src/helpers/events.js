import Event from 'events'

export const EventEmitter = new Event()

export function broadcastEvent(payload, events) {
	events.forEach((eventName) => {
		EventEmitter.emit(eventName, payload)
	})
}
