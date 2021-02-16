import { CharacterTC } from '@models/Character.model';

export const GetCharacterResolver = CharacterTC.getResolver('findById');

export const GetCharactersResolver = CharacterTC.getResolver('pagination');
