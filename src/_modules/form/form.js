export default class Form {
	constructor({form, validator}) {
		this.form = form;
		this._inputs = Array.from(this.form.querySelectorAll('.form__input'));
		this._validator = validator;
		this._classNames = {
			success: 'form__field--green',
			error: 'form__field--red',
			active: 'form__field--active'
		};

		// Binding //
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		// Initialization //
		this._inputs.forEach(input => {
			input.addEventListener('focus', this.handleFocus);
			input.addEventListener('blur', this.handleBlur);
		});
		this.form.addEventListener('submit', this.handleSubmit);
	}

	handleFocus({target}) {
		const wrapper = target.closest('.form__field');

		wrapper.classList.remove(this._classNames.success);
		wrapper.classList.remove(this._classNames.error);
		wrapper.classList.add(this._classNames.active);
	}

	handleBlur({target}) {
		const wrapper = target.closest('.form__field');
		const row = target.closest('.form__row');
		const errors = row.querySelector('.form__error');

		// Удалить все сообщения об ошибках //
		if (errors) {
			row.removeChild(errors);
		};

		if (!this._validator.check(target, 'isNotEmpty')) {
			// Если значение поля пустое, то возвражаем label на место //

			wrapper.classList.remove(this._classNames.active);
		} else {
			// Если не пустое, то проверяем значения поля //

			const result = this._validator.validateField(target);

			if (result.length > 0) {
				// Если есть хоть одна ошибка, её нужно показать //

				wrapper.classList.add(this._classNames.error);
				this._showErrors(target, result);
			} else {
				// Если ошибок нет, показать, что поле заполнено правильно //

				wrapper.classList.add(this._classNames.success);
			}
		}
	}

	handleSubmit(event) {
		event.preventDefault();

		this._removeErrors();
		this._removeMessage();
		this._inputs.forEach( input => {
			this._showErrors(input, this._validator.validateField(input));
		});

		if (this._validator.count() === 0) {
			this._submit(event);
		};
	}

	_submit() {
		const name = document.querySelector('.form__input[name="name"]');
		const email = document.querySelector('.form__input[name="email"]');
		const message = document.querySelector('.form__input[name="message"]');

		const headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');

		const options = {
			method: 'POST',
			headers: headers,
			body: `
				&name=${encodeURIComponent(name.value)}
				&email=${encodeURIComponent(email.value)}
				&message=${encodeURIComponent(message.value)}`
		};

		fetch("/form.php/", options)
			.then(
				(response) => {
					if (response.statusText === 'OK') {
						this._showMessage({
							type: 'success',
							text: 'Thank You. Your message was send.'
						});
					} else {
						this._showMessage({
							type: 'error',
							text: 'Sorry. Something went wrong.'
						});
					};
				},
				(error) => {
					console.error('Something went wrong.');
				}
			);
	}

	_removeMessage() {
		const message = this.form.querySelector('.form__message');

		if (message) {
			this.form.removeChild(message);
		};
	}

	_showMessage({type, text}) {
		const message = document.createElement('p');
		let typeClass;

		if (type === 'success') {
			typeClass = 'form__message--success';
		} else if (type === 'error') {
			typeClass = 'form__message--error';
		} else {
			typeClass = '';
		};

		message.className = `form__message ${typeClass}`;
		message.textContent = text;

		this.form.insertBefore(message, this.form.firstChild);
	}

	_removeErrors() {
		const errors = Array.from(this.form.querySelectorAll('.form__error'));

		errors.forEach(err => {
			err.parentNode.removeChild(err);
		});
	}

	_showErrors(input, errors) {
		// Если поле не проверяется, то валидатор возвращает true //

		if (errors !== true && errors.length > 0) {
			// Если поле проверялось и есть ошибки //

			const row = input.closest('.form__row');
			const message = document.createElement('div');

			message.className = 'form__error';

			errors.forEach(err => {
				const paragraph = document.createElement('p');

				paragraph.textContent = err;
				message.appendChild(paragraph);
			});

			row.appendChild(message);
		};
	}
};