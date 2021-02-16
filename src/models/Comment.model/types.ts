import { Document, Types } from 'mongoose';

export interface Comment {
	comment: string;
	ipAddressLocation: string;
	episode: Types.ObjectId;
}

export interface IComment extends Comment, Document {}
