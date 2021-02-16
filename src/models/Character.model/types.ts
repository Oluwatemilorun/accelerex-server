import { Document, Types } from 'mongoose';

/**
 * The Character Status enumeration.
 */
export enum CharacterStatus {
	ACTIVE = 'ACTIVE',
	DEAD = 'DEAD',
	UNKNOWN = 'UNKNOWN',
}

/**
 * The Character Status enumeration.
 */
export enum CharacterGender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
}

export interface Character {
	firstName: string;
	lastName: string;
	stateOfOrigin?: string;
	gender: CharacterGender;
	status: CharacterStatus;
	episodes: Types.ObjectId[];
	location: Types.ObjectId;
}

export interface ICharacter extends Character, Document {}
