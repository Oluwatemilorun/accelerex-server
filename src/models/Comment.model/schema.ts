import { Schema, Types } from 'mongoose';

export const ProtectedFields = [];
export const ImmutableFields = [];

export const CommentSchema = new Schema(
	{
		comment: { type: String, maxlength: 250, required: true },
		ipAddressLocation: { type: String, maxlength: 50, required: true },
		episode: { type: Types.ObjectId, ref: 'Episode', required: true },
	},
	{
		timestamps: true,
	}
);
