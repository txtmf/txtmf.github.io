export default class QuizoidView {
	constructor(quizoidModel) {
		this.model = quizoidModel;

		const page = location.pathname;
		console.log(page);
		switch (page) {
			case "/":
			case "/index.html":
				this.updateUI = this._indexUpdateUI;
				break;
			case "/html/profile.html":
				this.updateUI = this._profileUpdateUI;	
				break;
			case "/html/login.html":
				this.updateUI = this._loginUpdateUI;
				break;
			case "/html/sign_up.html":
				this.updateUI = this._signUpUpdateUI;
				break;
			default:
				this.updateUI = () => console.log("unknown page. view won't function properly");
		}
	}

	alert(msg) {
		alert(msg);
	}

	_indexUpdateUI() {
		const create = document.getElementById("quizoid-create");
		create.innerHTML = `
		<h2>Створення нового опитування</h2>

		<hr>

		<div class="row">
			<div class="col">
				<div class="form-group">
					<label for="quizoid-create-name" class="form-label">Назва опитування</label>
					<input type="text" minlength="1" placeholder="Моє круте опитування!" id="quizoid-create-name" class="form-control form-control-lg" value="${this.model.inCreation.name}" required>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col">
				<ul id="quizoid-create-input-groups" class="list-group">
					
				</ul>
			</div>
		</div>

		<div class="row">
			<div class="col">
				<button id="quizoid-create-button" class="btn btn-lg btn-primary">Створити опитування</button>
			</div>
		</div>`;

		const groups = document.getElementById("quizoid-create-input-groups");

		for (let g = 0; g < this.model.inCreation.inputGroups.length; g++) {
			const currentGroup = this.model.inCreation.inputGroups[g];

			let currentGroupHTML = `
			<div class="row">
				<div class="col-2">
					<div class="form-group">
						<label for="quizoid-create-${g}-number" class="form-label">Номер</label>
						<input type="text" id="quizoid-create-${g}-number" class="form-control group-number" value="${g}">
					</div>
				</div>
				<div class="col">
					<div class="form-group">
						<label for="quizoid-create-${g}-name" class="form-label">Назва групи</label>
						<input type="text" id="quizoid-create-${g}-name" class="form-control group-name" value="${currentGroup.name}">
					</div>
				</div>
				<div class="col">
					<fieldset>
						<legend>Тип групи</legend>
						<div class="form-check form-check-inline">
							<input type="radio" name="quizoid-create-${g}-type" value="radio" required id="quizoid-create-${g}-radio" class="form-check-input group-type" ${currentGroup.type == "radio" ? "checked" : ""}>
							<label for="quizoid-create-${g}-radio" class="form-check-label">Радіокнопки</label>
						</div>
						<div class="form-check form-check-inline">
							<input type="radio" name="quizoid-create-${g}-type" value="checkbox" id="quizoid-create-${g}-checkbox" class="form-check-input group-type" ${currentGroup.type == "checkbox" ? "checked" : ""}>
							<label for="quizoid-create-${g}-checkbox" class="form-check-label">Прапорці</label>
						</div>
						<div class="form-check form-check-inline">
							<input type="radio" name="quizoid-create-${g}-type" value="text" id="quizoid-create-${g}-text" class="form-check-input group-type" ${currentGroup.type == "text" ? "checked" : ""}>
							<label for="quizoid-create-${g}-text" class="form-check-label">Текстові поля</label>
						</div>
					</fieldset>
				</div>
				<div class="col-1">
					<button id="quizoid-create-${g}-delete" class="btn btn-danger delete-group">X</button>
				</div>
			</div>`;

			let inputsHTML = "";
			for (let i = 0; i < currentGroup.inputs.length; i++) {
				inputsHTML += `<li class="list-group-item">
					<div class="input-group">
						<input type="text" placeholder="Текст елемента" id="quizoid-create-${g}-${i}" class="form-control input-text" value="${currentGroup.inputs[i]}">
						<button class="btn btn-danger delete-element-btn">X</button>
					</div>
				</li>`;
			}

			currentGroupHTML += `
			<div class="row">
				<div class="col">
					<ul id="quizoid-create-${g}-inputs" class="list-group">
						${inputsHTML}
						<li class="list-group-item">
							<button id="quizoid-create-${g}-add-input" class="btn btn-sm btn-primary add-element-btn">Додати елемент</button>
						</li>
					</ul>
				</div>
			</div>`;

			currentGroupHTML = `<li class="list-group-item gapped-rows">${currentGroupHTML}</li>`;
			groups.innerHTML += currentGroupHTML;
		}
		groups.innerHTML += `
		<li class="list-group-item">
			<div class="row">
				<div class="col">
					<button id="quizoid-create-add-group-button" class="btn btn-primary">Додати групу</button>
				</div>
			</div>
		</li>`;

		document.getElementById("quizoid-create-name").addEventListener("change", (e) => this.controllerRenameInCreationQuiz(e.target.value));
		document.getElementById("quizoid-create-button").addEventListener("click", () => this.controllerCreateQuiz());
		document.getElementById("quizoid-create-add-group-button").addEventListener("click", () => this.controllerAddInCreationGroup());
		const addInputButtons = groups.getElementsByClassName("add-element-btn"),
			deleteInputButtons = groups.getElementsByClassName("delete-element-btn"),
			inputInputs = groups.getElementsByClassName("input-text"),
			groupNumberInputs = groups.getElementsByClassName("group-number"),
			groupNameInputs = groups.getElementsByClassName("group-name"),
			groupTypeInputs = groups.getElementsByClassName("group-type"),
			deleteGroupButtons = groups.getElementsByClassName("delete-group");
		let el = 0;
		for (let g = 0; g < this.model.inCreation.inputGroups.length; g++) {
			const groupIndex = g;
			addInputButtons[g].addEventListener("click", () => this.controllerAddInCreationInput(groupIndex));
			groupNumberInputs[g].addEventListener("change", (e) => this.controllerReorderInCreationGroup(groupIndex, e.target.value));
			groupNameInputs[g].addEventListener("change", (e) => this.controllerRenameInCreationGroup(groupIndex, e.target.value));
			deleteGroupButtons[g].addEventListener("click", () => this.controllerDeleteInCreationGroup(groupIndex));

			groupTypeInputs[g*3].addEventListener("change", (e) => this.controllerSetInCreationGroupType(g, e.target.value));
			groupTypeInputs[g*3+1].addEventListener("change", (e) => this.controllerSetInCreationGroupType(g, e.target.value));
			groupTypeInputs[g*3+2].addEventListener("change", (e) => this.controllerSetInCreationGroupType(g, e.target.value));

			for (let i = 0; i < this.model.inCreation.inputGroups[g].inputs.length; i++) {
				const inputIndex = i;
				inputInputs[el + i].addEventListener("change", (e) => this.controllerSetInCreationInput(g, i, e.target.value));
				deleteInputButtons[el + i].addEventListener("click", () => this.controllerDeleteInCreationInput(g, i));
			}
			el += this.model.inCreation.inputGroups[g].inputs.length;
		}


		// update quiz list
		const list = document.getElementById("quizoid-list").getElementsByTagName("ul")[0];
		list.innerHTML = "";

		for (let q = 0; q < this.model.quizes.length; q++) {
			const currentQuiz = this.model.quizes[q];

			let inputGroupsHTML = "";
		
			for (let g = 0; g < currentQuiz.inputGroups.length; g++) {
				let temp = "<hr>";

				if (currentQuiz.inputGroups[g].name.length > 0) {
					temp += `<h4>${currentQuiz.inputGroups[g].name}</h4>`;
				}

				let type = currentQuiz.inputGroups[g].type;
				for (let i = 0; i < currentQuiz.inputGroups[g].inputs.length; i++) {
					if (type === "text") {
						temp += `<div class="form-group">
							<label for="quiz-${q}-${g}-${i}" class="form-label">${currentQuiz.inputGroups[g].inputs[i]}</label>
							<input type="text" id="quiz-${q}-${g}-${i}" class="form-control">
						</div>`;
					}
					else {
						temp += `<div class="form-check">
							<input type="${type}" name="quiz-${q}-${g}" id="quiz-${q}-${g}-${i}" class="form-check-input">
							<label for="quiz-${q}-${g}-${i}" class="form-check-label">${currentQuiz.inputGroups[g].inputs[i]}</label>
						</div>`;
					}
				}
				inputGroupsHTML += temp;
			}

			list.innerHTML += `<li class="list-group-item">
				<div class="row">
					<div class="col">
						<h3>${currentQuiz.name}</h3>
					</div>
					<div class="col-2">
						<button class="btn btn-warning edit-quiz">⚙️</button>
						<button class="btn btn-danger delete-quiz">X</button>
					</div>
				</div>
				${inputGroupsHTML}
				<hr>
				<button id="quiz-${q}-submit" class="btn btn-primary submit-quiz">Відправити</button>
			</li>`;
		}

		const submitQuizButtons = list.getElementsByClassName("submit-quiz"),
			editQuizButtons = list.getElementsByClassName("edit-quiz"),
			deleteQuizButtons = list.getElementsByClassName("delete-quiz");
		for (let q = 0; q < this.model.quizes.length; q++) {
			const quizIndex = q;
			submitQuizButtons[q].addEventListener("click", () => this.controllerSubmitQuiz(quizIndex));
			editQuizButtons[q].addEventListener("click", () => this.controllerEditQuiz(quizIndex));
			deleteQuizButtons[q].addEventListener("click", () => this.controllerDeleteQuiz(quizIndex));
		}
	}
	_profileUpdateUI() {
		const mainDiv = document.getElementById("profile");
		if (this.model.loggedIn !== null) {
			const sex = this.model.loggedIn === "female" ? "Жіноча" : (this.model.loggedIn === "male" ? "Чоловіча" : "Не вказана");
			mainDiv.innerHTML = `
			<div class="col-lg-8">
				<table class=" table">
					<tr>
						<th scope="row">Електронна пошта</th>
						<td>${this.model.loggedIn.email}</td>
					</tr>
					<tr>
						<th scope="row">Ім'я</th>
						<td>${this.model.loggedIn.name}</td>
					</tr>
					<tr>
						<th scope="row">Стать</th>
						<td>${sex}</td>
					</tr>
					<tr>
						<th scope="row">Дата народження</th>
						<td>${this.model.loggedIn.birthdate}</td>
					</tr>
				</table>
			</div>`;
		}
		else {
			mainDiv.innerHTML = `
			<p>Спочатку <a href="./login.html">увійдіть</a> в профіль, будь ласка.</p>`;
		}
	}
	_loginUpdateUI() {
		const mainDiv = document.getElementById("login");
		if (this.model.loggedIn === null) {
			mainDiv.innerHTML = `
			<form name="login-form" method="post" id="login-form" class="col-lg-6">
				<label for="email">Електронна адреса</label>
				<input type="email" name="email" id="email" class="form-control" required>
				
				<label for="password">Пароль</label>
				<input type="password" name="password" id="password" class="form-control" required>
				
				<hr>
	
				<button id="login-btn" class="btn btn-primary">Увійти</button>
			</form>`;

			const form = document.getElementById("login-form");
			form.action = "javascript:;"
			form.addEventListener("submit", (e) => {
				const formData = new FormData(form);
				const email = formData.get("email"),
					password = formData.get("password");
				this.controllerLogin(email, password);
			});
		}
		else {
			mainDiv.innerHTML = `
			<div class="row">
				<div class="col">
					<p>Ви вже увійшли.</p>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<button id="logout-btn" class="btn btn-danger">Вийти</button>
				</div>
			</div>`;

			document.getElementById("logout-btn").addEventListener("click", () => this.controllerLogout());
		}
	}
	_signUpUpdateUI() {
		const mainDiv = document.getElementById("sign-up");
		mainDiv.innerHTML = `
		<form name="sign-up-form" method="post" id="sign-up-form" class="col-lg-6">
			<label for="email" class="form-label">Електронна адреса</label>
			<input type="email" name="email" id="email" class="form-control" value="example@example.com" required>

			<label for="password" class="form-label">Пароль</label>
			<input type="password" name="password" id="password" class="form-control" value="1" required>

			<label for="name" class="form-label">Ім'я</label>
			<input type="text" name="name" id="name" class="form-control" value="example" required>

			<fieldset>
				<legend class="def-font">Стать</legend>
				<div class="form-check form-check-inline">
					<label for="sex-none" class="form-check-label">Не вказувати</label>
					<input type="radio" name="sex" id="sex-none" class="form-check-input" value="none" checked required>
				</div>
				<div class="form-check form-check-inline">
					<label for="sex-female" class="form-check-label">Жіноча</label>
					<input type="radio" name="sex" id="sex-female" class="form-check-input" value="female">
				</div>
				<div class="form-check form-check-inline">
					<label for="sex-male" class="form-check-label">Чоловіча</label>
					<input type="radio" name="sex" id="sex-male" class="form-check-input" value="male">
				</div>
			</fieldset>

			<label for="birthdate" class="form-label">Дата народження</label>
			<input type="date" name="birthdate" id="birthdate" class="form-control" value="1991-08-24" required>

			<hr>

			<button id="sign-up-btn" class="btn btn-primary">Зареєструватися</button>
		</form>`;

		const form = document.getElementById("sign-up-form");
		form.action = "javascript:;"
		form.addEventListener("submit", (e) => {
			const formData = new FormData(form);
			const email = formData.get("email"),
				password = formData.get("password"),
				name = formData.get("name"),
				sex = formData.get("sex"),
				birthdate = formData.get("birthdate");
			this.controllerSignUp(email, password, name, sex, birthdate);
		});
	}

	quizCreateGroupsHTML(quiz) {
		let inputGroupsHTML = "";

		for (let g = 0; g < quiz.inputGroups.length; g++) {
			let tempGroup = ``;
			
			
		}

		// create add group button
		inputGroupsHTML += `<li class="list-group-item">
			<div class="row">
				<div class="col">
					<button id="quizoid-create-add-group" class="btn btn-primary add-group-btn">Додати групу</button>
				</div>
			</div>
		</li>`;

		return inputGroupsHTML;
	}

	quizListItemHTML(quiz, index) {
		
	}

	updateUI() {
		document.getElementById("quizoid-create-name").value = this.model.inCreation.name;

		const groups = document.getElementById("quizoid-create-input-groups");

		while (groups.firstChild) {
			groups.removeChild(groups.firstChild);
		}

		groups.innerHTML = this.quizCreateGroupsHTML(this.model.inCreation);
		for (let i = 0; i < groups.childElementCount - 1; i++) {
			const group = groups.children[i];
			group.getElementsByClassName("add-element-btn")[0].addEventListener("click", () => this.controllerAddInput())
		}
		groups.getElementsByClassName("");

		// update quiz list
		const list = document.getElementById("quizoid-list").getElementsByTagName("ul")[0];
		
		while (list.firstChild) {
			list.removeChild(list.firstChild);
		}

		for (let i = 0; i < this.model.quizes.length; i++) {
			const html = this.quizListItemHTML(this.model.quizes[i]);
			list.innerHTML += html;
		}

		const groupNumbers = document.getElementsByClassName("group-number");
		for (let i = 0; i < groupNumbers.length; i++) {
			const groupIndex = i;
			groupNumbers[i].addEventListener("keyup", (e) => {
				if (e.key === "Enter") {
					this.controllerRenumber(groupIndex, e.target.value);
				}
			});
		}
		const groupNames = document.getElementsByClassName("group-name");
		for (let i = 0; i < groupNames.length; i++) {
			const groupIndex = i;
			groupNames[i].addEventListener("keyup", (e) => {
				if (e.key === "Enter") {
					this.controllerRenameGroup(groupIndex, e.target.value);
				}
			});
		}
		const groupTypes = document.getElementsByClassName("group-type");
		for (let i = 0; i < groupTypes.length; i++) {
			const groupIndex = Math.floor(i / 3);
			groupTypes[i].addEventListener("click", (e) => {
				this.controllerSetGroupType(groupIndex, e.target.value);
			});
		}
		const deleteGroup = document.getElementsByClassName("delete-group");
		for (let i = 0; i < deleteGroup.length; i++) {
			const groupIndex = i;
			deleteGroup[i].addEventListener("click", () => this.controllerDeleteGroup(groupIndex));
		}
		const addInputButtons = document.getElementsByClassName("add-element-btn");
		for (let i = 0; i < addInputButtons.length; i++) {
			const groupIndex = i;
			addInputButtons[i].addEventListener("click", (e) => {
				this.controllerAddInput(groupIndex, e.target.value);
			});
		}
		const inputTexts = document.getElementsByClassName("input-text");
		{
			let g = 0, i = 0;
			for (let el = 0; el < inputTexts.length; el++) {
				if (i >= this.model.inCreation.inputGroups[g].inputs.length) {g++; i = 0;}
				const groupIndex = g, inputIndex = i;
				inputTexts[el].addEventListener("keyup", (e) => {
					if (e.key == "Enter") {
						this.controllerSetInput(groupIndex, inputIndex, e.target.value);
					}
				});
				i++;
			}
		}
		const deleteInputButtons = document.getElementsByClassName("delete-element-btn");
		{
			let g = 0, i = 0;
			for (let el = 0; el < deleteInputButtons.length; el++) {
				if (i >= this.model.inCreation.inputGroups[g].inputs.length) {g++; i = 0;}
				const groupIndex = g, inputIndex = i;
				deleteInputButtons[el].addEventListener("click", (e) => {
					this.controllerDeleteInput(groupIndex, inputIndex);
				});
				i++;
			}
		}
		const addGroupButton = document.getElementById("quizoid-create-add-group");
		addGroupButton.addEventListener("click", () => {this.controllerAddGroup();});

		const editButtons = document.getElementsByClassName("edit-quiz");
		for (let i = 0; i < editButtons.length; i++) {
			const quizIndex = i;
			editButtons[i].addEventListener("click", () => this.controllerEditQuiz(quizIndex));
		}
		const deleteButtons = document.getElementsByClassName("delete-quiz");
		for (let i = 0; i < deleteButtons.length; i++) {
			const quizIndex = i;
			deleteButtons[i].addEventListener("click", () => this.controllerDeleteQuiz(quizIndex));
		}
		const submitButtons = document.getElementsByClassName("submit-btn");
		for (let i = 0; i < submitButtons.length; i++) {
			submitButtons[i].addEventListener("click", () => this.controllerSubmit());
		}
	}
}