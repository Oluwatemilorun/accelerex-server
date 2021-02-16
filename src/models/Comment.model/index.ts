import { model, Model } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { AppContext } from 'src/@types';

import { IComment } from './types';
import { CommentSchema, ImmutableFields, ProtectedFields } from './schema';

const Comment: Model<IComment> = model('Comment', CommentSchema);

const CommentTC = composeWithMongoose<IComment, AppContext>(Comment, {
	fields: { remove: ProtectedFields },
	inputType: { fields: { remove: ImmutableFields } },
});

export * from './types';
export { CommentSchema, CommentTC };
export default Comment;
