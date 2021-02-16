import { Schema } from 'mongoose';

export const ProtectedFields = [];
export const ImmutableFields = [];

export const LocationSchema = new Schema(
	{
		name: { type: String, maxlength: 255, required: true },
		longitude: { type: Number },
		latitude: { type: Number },
	},
	{
		timestamps: true,
	}
);
