import { body } from 'express-validator';

export const LoginEmailValidator = [
	body('email', ['Email is required', 'Email is invalid']).exists().isEmail(),
	body('password', ['Password is required']).exists(),
];
