export class QuizInputGroup {
	constructor(name, type, inputs) {
		this.name = name;
		this.type = type;
		this.inputs = inputs;
	}
}

export default class Quiz {
	constructor(name, inputGroups) {
		this.name = name;
		this.inputGroups = inputGroups;
	}

	static makeEmpty() {
		return new Quiz("Нове опитування", []);
	}
}