import { CharacterTC, ICharacter } from '@models/Character.model';
import { CommentTC, IComment } from '@models/Comment.model';
import { EpisodeTC, IEpisode } from '@models/Episode.model';
import { LocationTC } from '@models/Location.model';

CharacterTC.addRelation('location', {
	resolver: LocationTC.getResolver('findById'),
	prepareArgs: {
		_id: (source: ICharacter) => source.location,
	},
});

CharacterTC.addRelation('episodes', {
	resolver: EpisodeTC.getResolver('findByIds'),
	prepareArgs: {
		_ids: (source: ICharacter) => source.episodes,
	},
});

EpisodeTC.addRelation('characters', {
	resolver: CharacterTC.getResolver('findByIds'),
	prepareArgs: {
		_ids: (source: IEpisode) => source.characters,
	},
});

EpisodeTC.addRelation('comments', {
	resolver: CommentTC.getResolver('findMany'),
	prepareArgs: {
		filter: (source: IEpisode) => ({ episode: source._id }),
	},
});

CommentTC.addRelation('episode', {
	resolver: EpisodeTC.getResolver('findById'),
	prepareArgs: {
		_id: (source: IComment) => source._id,
	},
});
