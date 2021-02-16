import { CharacterTC } from '@models/Character.model';
import Location, { LocationTC } from '@models/Location.model';

export const CreateCharacterResolver = CharacterTC.getResolver('createOne')
	.wrap((resolver) => {
		const newResolver = resolver.cloneArg('record', 'newCharacter');

		newResolver.getArgITC('record').addFields({
			location: {
				type: () => LocationTC.getInputType(),
				description: 'The location of the character',
			},
		});

		return newResolver;
	})
	.wrapResolve((next) => async ({ args, ...rp }) => {
		const location = await Location.create({ ...args.record.location });

		args.record.location = location._id;
		return next({ args, ...rp });
	});
