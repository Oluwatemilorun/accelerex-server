import { CommentTC } from '@models/Comment.model';

export const GetCommentResolver = CommentTC.getResolver('findById');

export const GetCommentsResolver = CommentTC.getResolver('pagination');
