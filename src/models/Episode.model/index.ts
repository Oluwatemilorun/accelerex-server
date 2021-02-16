import { model, Model } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { AppContext } from 'src/@types';

import { IEpisode } from './types';
import { EpisodeSchema, ImmutableFields, ProtectedFields } from './schema';

const Episode: Model<IEpisode> = model('Episode', EpisodeSchema);

const EpisodeTC = composeWithMongoose<IEpisode, AppContext>(Episode, {
	fields: { remove: ProtectedFields },
	inputType: { fields: { remove: ImmutableFields } },
});

export * from './types';
export { EpisodeSchema, EpisodeTC };
export default Episode;
