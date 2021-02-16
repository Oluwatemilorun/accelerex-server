import { Document, Types } from 'mongoose';

export interface Episode {
	name: string;
	releaseDate: string;
	episodeCode: string;
	characters: Types.ObjectId[];
}

export interface IEpisode extends Episode, Document {}
