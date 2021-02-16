import { EpisodeTC } from '@models/Episode.model';

export const GetEpisodeResolver = EpisodeTC.getResolver('findById');

export const GetEpisodesResolver = EpisodeTC.getResolver('pagination');
