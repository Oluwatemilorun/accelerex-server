import { GetCommentResolver, GetCommentsResolver } from '@resolvers/Comment.resolver';

export const CommentQueries = {
	getComment: GetCommentResolver,
	getComments: GetCommentsResolver,
};
