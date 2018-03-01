import jump from 'jump.js/dist/jump';

export default class Navbar {
	constructor() {
		this._window = window;
		this.navbar = document.querySelector('.navbar');
		this.header = document.querySelector('.header');
		this.sections = [this.header, ...Array.from(document.querySelectorAll('.section'))];

		// Binding //
		this.handleScroll = this.handleScroll.bind(this);
		this.handleClick = this.handleClick.bind(this);

		// Initialization //
		this.setActive(this.sections[0]);
		this._window.addEventListener('scroll', this.handleScroll);
		this.navbar.addEventListener('click', this.handleClick);
	}

	setActive(node) {
		let previousTab = this.navbar.querySelector('.navbar__link--active');
		let currentTab = this.navbar.querySelector(`[data-target="#${node.id}"]`);

		if (previousTab) {
			previousTab.classList.remove('navbar__link--active');
		};

		currentTab.classList.add('navbar__link--active');
	}

	isInView(scrolled, section) {
		const sectionPos = section.getBoundingClientRect();
		const halfHeight = section.offsetHeight / 2;

		return (sectionPos.top - halfHeight <= 0 && sectionPos.bottom - halfHeight > 0);
	}

	handleClick({target, currentTarget}) {
		while (target !== currentTarget || target !== null) {
			if (target.classList.contains('navbar__link')) {
				jump(target.dataset.target);
				break;
			} else {
				target = target.parentNode;
			}
		}
	}

	handleScroll(event) {
		const scrolled = window.pageYOffset || document.documentElement.scrollTop;

		this.sections.forEach(section => {

			if (this.isInView(scrolled, section)) {
				this.setActive(section);
			};
		});
	}
};