import { model, Model } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { AppContext } from 'src/@types';

import { ICharacter } from './types';
import { CharacterSchema, ImmutableFields, ProtectedFields } from './schema';

const Character: Model<ICharacter> = model('Character', CharacterSchema);

const CharacterTC = composeWithMongoose<ICharacter, AppContext>(Character, {
	fields: { remove: ProtectedFields },
	inputType: { fields: { remove: ImmutableFields } },
	resolvers: {
		findMany: {
			filter: {
				operators: {
					updatedAt: ['gte', 'lte', 'gt', 'lt'],
					createdAt: ['gte', 'lte', 'gt', 'lt'],
				},
			},
			sort: {},
		},
	},
});

export * from './types';
export { CharacterSchema, CharacterTC };
export default Character;
