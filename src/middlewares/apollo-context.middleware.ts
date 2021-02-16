import { Request } from 'express';

export const ApolloContext = async ({ req }: { req: Request }) => {
	const auth = true;

	return { auth, ipAddress: req.ip };
};
