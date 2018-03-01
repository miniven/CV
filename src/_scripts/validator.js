export default class Validator {
	constructor(config) {
		this._config = config;
		this.errors = {};
		this.errorsAmount = 0;
		this._types = {
			isNotEmpty: {
				validate(value) {
					return value !== '';
				},
				instructions: 'The field is required'
			},
			isEmail: {
				validate(value) {
					const expr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return expr.test(value);
				},
				instructions: 'Sorry, this doesn\'t look like a valid email'
			},
			isWord: {
				validate(value) {
					const expr = /^\D+$/;
					return expr.test(value);
				},
				instructions: 'A name should only include letters'
			}
		};
	}

	validateField(field) {
		const checkers = this._config[field.name];

		if (!checkers) return true;

		this.errors[field.name] = [];

		checkers.forEach(funcName => {
			const passed = this._types[funcName].validate(field.value);

			if (!passed) {
				this.errors[field.name].push(this._types[funcName].instructions);
			};
		});

		return this.errors[field.name];
	}

	check(input, checker) {
		return this._types[checker].validate(input.value);
	}

	count() {
		let amount = 0;

		Object.keys(this.errors).forEach(key => {
			this.errors[key].forEach(err => amount++);
		});

		return amount;
	}
};