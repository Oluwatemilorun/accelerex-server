import './hydrate';

import { SchemaComposer } from 'graphql-compose';
import { AppContext } from 'src/@types';

import { CharacterQueries, CommentQueries, EpisodeQueries } from './queries';

import { CharacterMutations, CommentMutations, EpisodeMutations } from './mutations';

const schemaComposer = new SchemaComposer<AppContext>();

schemaComposer.Query.addFields({
	...CharacterQueries,
	...EpisodeQueries,
	...CommentQueries,
});

schemaComposer.Mutation.addFields({
	...CharacterMutations,
	...EpisodeMutations,
	...CommentMutations,
});

export const schema = schemaComposer.buildSchema();
