import model from "../model/QuizoidModel.js";
import view from "../view/QuizoidView.js";

export default class QuizoidController {
	constructor(quizoidModel, quizoidView) {
		this.model = quizoidModel;
		this.view = quizoidView;

		const handler = {
			get: (target, property) => {
				//console.log(`QuizoidController proxy "get" handler`, target, property);
				if (typeof target[property] === "function") {
					return (...args) => {
						let result = target[property](...args);
						this.view.updateUI();
						return result;
					}
				}
				return target[property];	
			}
		};

		// Proxy functions in the same way as the Proxy in model,
		// but instead of updating localStorage it updates site UI.
		const proxy = new Proxy(this, handler);

		this.view.controllerSignUp = proxy.signUp;
		this.view.controllerLogin = proxy.login;
		this.view.controllerLogout = proxy.logout;

		this.view.controllerCreateQuiz = proxy.createQuiz;
		this.view.controllerRenameInCreationQuiz = proxy.renameInCreationQuiz;
		this.view.controllerAddInCreationGroup = proxy.addInCreationGroup;
		this.view.controllerDeleteInCreationGroup = proxy.deleteInCreationGroup;
		this.view.controllerReorderInCreationGroup = proxy.reorderInCreationGroup;
		this.view.controllerRenameInCreationGroup = proxy.renameInCreationGroup;
		this.view.controllerSetInCreationGroupType = proxy.setInCreationGroupType;
		this.view.controllerAddInCreationInput = proxy.addInCreationInput;
		this.view.controllerDeleteInCreationInput = proxy.deleteInCreationInput;
		this.view.controllerSetInCreationInput = proxy.setInCreationInput;

		this.view.controllerSubmitQuiz = proxy.submitQuiz;
		this.view.controllerEditQuiz = proxy.editQuiz;
		this.view.controllerDeleteQuiz = proxy.deleteQuiz;

		this.view.updateUI();

		return proxy;
	}


	signUp(email, password, name, sex, birthdate) {
		if (typeof email !== "string" || email.length === 0) {
			this.view.alert("Неправильна адреса!");
			return;
		}
		if (typeof password !== "string" || password.length === 0) {
			this.view.alert("Неправильний пароль!");
			return;
		}
		if (typeof name !== "string" || name.length === 0) {
			this.view.alert("Неправильне ім'я!");
			return;
		}
		if (sex !== "none" && sex !== "female" && sex !== "male") {
			this.view.alert("Неправильна стать!");
			return;
		}
		if (typeof birthdate !== "string") {
			this.view.alert("Неправильний день народження!");
			return;
		}

		const result = this.model.createProfile(email, password, name, sex, birthdate);
		if (result) {
			this.view.alert("Ви успішно зареєструвалися!");
		}
		else {
			this.view.alert("Не вдалося створити профіль.\nТака пошта вже зареєстрована.");
		}
	}
	login(email, password) {
		console.log("login");
		if (typeof email !== "string" || email.length === 0) {
			this.view.alert("Неправильна адреса!");
			return;
		}
		if (typeof password !== "string" || password.length === 0) {
			this.view.alert("Неправильний пароль!");
			return;
		}

		this.model.login(email, password);
	}
	logout() {
		if (this.model.loggedIn !== null) {
			this.model.logout();
		}
	}

	renameInCreationQuiz(newName) {
		if (newName === undefined || typeof newName !== "string") {
			newName = "";
		}
		this.model.rename(newName);
	}
	renameInCreationGroup(groupIndex, newName) {
		if (groupIndex < 0 || groupIndex >= this.model.inCreation.inputGroups.length) {
			return;
		}
		if (newName === undefined || typeof newName !== "string") {
			newName = "";
		}
		this.model.renameGroup(groupIndex, newName);
	}
	reorderInCreationGroup(groupIndex, newIndex) {
		groupIndex = Number(groupIndex);
		newIndex = Number(newIndex);
		if (isNaN(groupIndex) || isNaN(newIndex)) {
			return;
		}
		if (groupIndex < 0) {groupIndex = 0;}
		else if (groupIndex >= this.model.inCreation.inputGroups.length) {groupIndex = this.model.inCreation.inputGroups.length - 1;}
		if (newIndex < 0) {newIndex = 0;}
		else if (newIndex >= this.model.inCreation.inputGroups.length) {newIndex = this.model.inCreation.inputGroups.length - 1;}
		if (groupIndex === newIndex) {return;}
		this.model.reorderGroup(groupIndex, newIndex);
	}
	setInCreationGroupType(groupIndex, type) {
		this.model.setGroupType(groupIndex, type);
	}
	setInCreationInput(groupIndex, inputIndex, input) {
		console.log("hi", groupIndex, inputIndex);
		this.model.setInput(groupIndex, inputIndex, input);
	}

	

	addInCreationGroup() {
		console.log("hi?");
		this.model.addGroup({name: "", type: "radio", inputs: []});
	}
	deleteInCreationGroup(groupIndex) {
		this.model.deleteGroup(groupIndex);
	}

	addInCreationInput(groupIndex) {
		this.model.addInput(groupIndex, "");
	}
	deleteInCreationInput(groupIndex, inputIndex) {
		console.log(groupIndex, inputIndex);
		this.model.deleteInput(groupIndex, inputIndex);
	}

	createQuiz() {
		this.model.createQuiz();
	}
	addQuiz(quiz) {
		this.model.addQuiz(quiz);
	}
	editQuiz(quizIndex) {
		this.model.editQuiz(quizIndex);
	}
	deleteQuiz(quizIndex) {
		this.model.deleteQuiz(quizIndex);
	}
	submitQuiz(quizIndex) {
		console.log("Submitted!");
	}
}