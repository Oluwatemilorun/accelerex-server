import { GetEpisodeResolver, GetEpisodesResolver } from '@resolvers/Episode.resolver';

export const EpisodeQueries = {
	getEpisode: GetEpisodeResolver,
	getEpisodes: GetEpisodesResolver,
};
