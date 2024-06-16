import quiz from "./QuizModel.js";
import profile from "./ProfileModel.js"

export default class QuizoidModel {
	constructor() {
		try {
			this.profiles = JSON.parse(window.localStorage.getItem("profiles"));
			this.profiles = new Map(Object.entries(this.profiles));
		}
		catch (SyntaxError) {
			this.profiles = null;
		}
		if (this.profiles === null) {
			this.profiles = new Map();
		}
		const loggedInEmail = window.localStorage.getItem("loggedInEmail");
		if (loggedInEmail === null) {
			this.loggedIn = null;
			this.quizes = [];
		}
		else {
			this.loggedIn = this.profiles.get(loggedInEmail);
			if (this.loggedIn === undefined) {
				this.loggedIn = null;
			}
			else {
				this.quizes = this.loggedIn.quizes;
			}
		}
		this.inCreation = quiz.makeEmpty();

		const handler = {
			get: (target, property) => {
				if (typeof target[property] === "function") {
					//const whitelist = [];
					//if (whitelist.includes(property)) {
						return (...args) => {
							let result = target[property](...args);
							this._updateLocalStorage();
							return result;
						}
					//}
					return target[property];
				}
				return target[property];
			}
		};

		// Proxy is used for saving updated profile information to localStorage.
		// It intercepts access to properties and if a property is a method, 
		// it's returned in a wrapper-function.
		// The wrapper calls
		//     the initially targeted method AND
		//     the updateLocalStorage function.
		return new Proxy(this, handler);
	}


	_updateLocalStorage() {
		const profilesJSON = JSON.stringify(Object.fromEntries(this.profiles));
		window.localStorage.setItem("profiles", profilesJSON);
		if (this.loggedIn === null) {
			window.localStorage.removeItem("loggedInEmail")
		}
		else {
			window.localStorage.setItem("loggedInEmail", this.loggedIn.email);
		}
	}


	createProfile(email, password, name, sex, birthdate) {
		if (this.profiles.has(email)) {
			return false;
		}
		else {
			this.profiles.set(email, new profile(email, password, name, sex, birthdate));
			return true;
		}
	}
	deleteProfile(email) {
		this.profiles.delete(email);
	}

	login(email, password) {
		if (this.profiles.has(email)) {
			if (this.profiles.get(email).password === password) {
				this.loggedIn = this.profiles.get(email);
			}
		}
	}
	logout() {
		this.loggedIn = null;
	}


	createQuiz() {
		this.quizes.push(this.inCreation);
		this.inCreation = quiz.makeEmpty();
	}
	addQuiz(quiz) {
		this.quizes.push(quiz);
	}
	editQuiz(index) {
		this.inCreation = structuredClone(this.quizes[index]);
	}
	deleteQuiz(index) {
		this.quizes.splice(index, 1);
	}

	rename(newName) {
		this.inCreation.name = newName;
	}

	addGroup(inputGroup) {
		this.inCreation.inputGroups.push(inputGroup);
	}
	deleteGroup(groupIndex) {
		this.inCreation.inputGroups.splice(groupIndex, 1);
	}
	renameGroup(groupIndex, newName) {
		this.inCreation.inputGroups[groupIndex].name = newName;
	}
	reorderGroup(groupIndex, newIndex) {
		[this.inCreation.inputGroups[groupIndex], this.inCreation.inputGroups[newIndex]] = [this.inCreation.inputGroups[newIndex], this.inCreation.inputGroups[groupIndex]]
	}
	setGroupType(groupIndex, newType) {
		this.inCreation.inputGroups[groupIndex].type = newType;
	}

	addInput(groupIndex, input) {
		console.log(groupIndex);
		console.log(this.inCreation.inputGroups);
		this.inCreation.inputGroups[groupIndex].inputs.push(input);
	}
	deleteInput(groupIndex, inputIndex) {
		this.inCreation.inputGroups[groupIndex].inputs.splice(inputIndex, 1);
	}
	setInput(groupIndex, inputIndex, input) {
		this.inCreation.inputGroups[groupIndex].inputs[inputIndex] = input;
	}
}