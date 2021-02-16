import { Document } from 'mongoose';

export interface Location {
	name: string;
	longitude?: number;
	latitude?: number;
}

export interface ILocation extends Location, Document {}
