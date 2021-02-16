import { AuthenticationError } from 'apollo-server-express';
import { ResolverMiddleware } from 'graphql-compose';
import { AppContext } from 'src/@types';

export const CheckAuth: ResolverMiddleware<any, AppContext> = async (next, s, a, c, i) => {
	if (!c.auth) throw new AuthenticationError('Authentication failed');

	const res = await next(s, a, c, i);

	return res;
};
