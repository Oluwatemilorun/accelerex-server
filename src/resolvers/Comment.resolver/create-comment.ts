import { CommentTC } from '@models/Comment.model';

export const CreateCommentResolver = CommentTC.getResolver('createOne')
	.wrap((resolver) => {
		const newResolver = resolver.cloneArg('record', 'newComment');

		newResolver.getArgITC('record').removeField(['ipAddressLocation']);

		return newResolver;
	})
	.wrapResolve((next) => async ({ args, context, ...rp }) => {
		args.record.ipAddressLocation = context.ipAddress;
		return next({ args, context, ...rp });
	});
