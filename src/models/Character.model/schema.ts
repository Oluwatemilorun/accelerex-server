import { Schema, Types } from 'mongoose';
import { CharacterGender, CharacterStatus } from './types';

export const ProtectedFields = [];
export const ImmutableFields = [];

export const CharacterSchema = new Schema(
	{
		firstName: { type: String, maxlength: 50, required: true },
		lastName: { type: String, maxlength: 50, required: true },
		status: { type: String, enum: Object.keys(CharacterStatus), required: true },
		stateOfOrigin: { type: String, maxlength: 120 },
		gender: { type: String, enum: Object.keys(CharacterGender), required: true },
		episodes: [{ type: Types.ObjectId, ref: 'Episode' }],
		location: { type: Types.ObjectId, ref: 'Location' },
	},
	{
		timestamps: true,
	}
);
