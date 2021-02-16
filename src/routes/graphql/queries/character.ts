import { GetCharacterResolver, GetCharactersResolver } from '@resolvers/Character.resolver';

export const CharacterQueries = {
	getCharacter: GetCharacterResolver,
	getCharacters: GetCharactersResolver,
};
