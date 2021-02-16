import { Schema, Types } from 'mongoose';

export const ProtectedFields = [];
export const ImmutableFields = [];

export const EpisodeSchema = new Schema(
	{
		name: { type: String, maxlength: 255, required: true },
		releaseDate: { type: Date, required: true },
		episodeCode: { type: String, required: true },
		characters: [{ type: Types.ObjectId, ref: 'Character' }],
	},
	{
		timestamps: true,
	}
);
