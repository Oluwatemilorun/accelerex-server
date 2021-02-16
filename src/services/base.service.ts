import { Request, NextFunction, Response } from 'express';
import {
	OK,
	CREATED,
	ACCEPTED,
	UNAUTHORIZED,
	SERVICE_UNAVAILABLE,
	BAD_REQUEST,
	FORBIDDEN,
} from 'http-status-codes';
import { ValidationChain, validationResult } from 'express-validator';
import { sign } from 'jsonwebtoken';
import { ValidationError } from 'apollo-server-express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import cloudinaryStorage from 'multer-storage-cloudinary';

import { IUser } from '@models/User.model';
import { generateFilePath } from '@shared/functions';
import logger from '@shared/Logger';
import auth from '@middlewares/auth.middleware';

import { JWT_SECRET } from '@config';

interface ResponseParams<M> {
	message: string;
	status: number;
	payload?: M | M[] | string | number;
	error?: Error | Error[] | ValidationError[];
	meta?: { [x: string]: unknown };
	token?: string;
}

class BaseService<Model> {
	private _request?: Request;
	private _response?: Response;
	private _next?: NextFunction;

	private _currentUser?: IUser;
	// private _currentAdmin?: IAdmin;

	private readonly _okStatuses = [OK, CREATED, ACCEPTED];

	public set Request(req: Request) {
		this._request = req;
	}

	public set Response(res: Response) {
		this._response = res;
	}

	public set Next(next: NextFunction) {
		this._next = next;
	}

	public get CurrentUser(): IUser | null {
		return this._currentUser ? this._currentUser : null;
	}

	public set CurrentUser(user: IUser | null) {
		this._currentUser = user || undefined;
	}

	public get UserToken(): string | null {
		if (!this._currentUser) return null;

		const token = sign(
			{
				_id: this._currentUser._id,
				email: this._currentUser.email,
				type: this._currentUser.type,
			},
			JWT_SECRET,
			{ expiresIn: '30 days' }
		);

		return token;
	}

	/**
	 * @param request
	 */
	public AuthenticateUser = async (req: Request, _: any, next: NextFunction) => {
		try {
			const token =
				(req.body && req.body.access_token) ||
				(req.query && req.query.access_token) ||
				(req.headers.authorization && req.headers.authorization.split(' ')[1]) ||
				req.headers['x-access-token'] ||
				req.cookies.access_token;

			const user = await auth(token);

			this._currentUser = user;
			next();
		} catch (error) {
			this.SendResponse({
				message: error.message,
				status: UNAUTHORIZED,
				error,
			});
		}
	};

	/**
	 * CheckAdmin
	 */
	public CheckAdmin = (_: any, __: any, next: NextFunction) => {
		if (this._currentUser && this._currentUser.type === 'EMPLOYEE') next();
		else
			this.SendResponse({
				message: 'You do not have access to perform this operation.',
				status: FORBIDDEN,
				error: new Error('Permission denied'),
			});
	};

	/**
	 * UploadFile
	 */
	public UploadFile = (folder = '', field = 'image') => {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				const storage = cloudinaryStorage({
					cloudinary: cloudinary as any,
					params: {
						folder: generateFilePath(
							req.params.id ? req.params.id : this._currentUser?._id,
							folder
						),
						allowed_formats: ['jpg', 'png', 'svg'],
					},
				});

				const uploader = multer({
					storage,
					limits: { fileSize: 1500000 },
				}).single(field);

				uploader(req, res, next);
			} catch (error) {
				return this.SendResponse({
					message: 'File upload error.',
					status: SERVICE_UNAVAILABLE,
					error,
				});
			}
		};
	};

	/**
	 * validate
	 */
	public ValidateFields = (validationChain: ValidationChain[]) => {
		return async (req: Request, _: Response, next: NextFunction): Promise<Response | void> => {
			try {
				await Promise.all(validationChain.map((validation) => validation.run(req)));

				const errors = validationResult(req);

				if (errors.isEmpty()) return next();
				else {
					return this.SendResponse({
						message: 'Some fields missing/incorrect.',
						status: BAD_REQUEST,
						error: (errors.array() as unknown) as ValidationError[],
					});
				}
			} catch (error) {
				return this.SendResponse({
					message: 'Validation error occured.',
					status: SERVICE_UNAVAILABLE,
					error,
				});
			}
		};
	};

	public SendError = (error: any): void => {
		this.SendResponse({
			status: error.code || SERVICE_UNAVAILABLE,
			message: error.message,
			error: error,
		});
	};

	/**
	 * Send response
	 */
	public SendResponse = ({ message, status, payload, error, token }: ResponseParams<Model>) => {
		error && logger.error(error);

		this._response &&
			this._response.status(status).send({
				state: error ? 'ERROR' : this._okStatuses.includes(status) ? 'OK' : 'NO',
				message,
				payload,
				error,
				token,
			});
	};
}

export default BaseService;
