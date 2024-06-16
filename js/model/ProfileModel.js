export default class Profile {
	constructor(email, password, name, sex, birthdate, quizes=[]) {
		this.email = email;
		this.password = password;
		this.name = name;
		this.sex = sex;
		this.birthdate = birthdate;

		this.quizes = quizes;
	}
}