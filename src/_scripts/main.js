// Main javascript entry point
// Should handle bootstrapping/starting application

'use strict';

import Particles from 'particlesjs/dist/particles';
import Navbar from '../_modules/navbar/navbar';
import Validator from './validator';
import Form from '../_modules/form/form';

const MyApp = {};

MyApp.navbar = new Navbar();

MyApp.form = new Form({
	form: document.querySelector('.form'),
	validator: new Validator({
		name: ['isNotEmpty', 'isWord'],
		email: ['isNotEmpty', 'isEmail'],
		message: ['isNotEmpty']
	})
});

Particles.init({
	selector: '.header__background',
	color: '#ffffff',
	sizeVariations: 8
});