import { model, Model } from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { AppContext } from 'src/@types';

import { ILocation } from './types';
import { ImmutableFields, LocationSchema, ProtectedFields } from './schema';

const Location: Model<ILocation> = model('Location', LocationSchema);

const LocationTC = composeWithMongoose<ILocation, AppContext>(Location, {
	fields: { remove: ProtectedFields },
	inputType: { fields: { remove: ImmutableFields } },
});

export * from './types';
export { LocationSchema, LocationTC };
export default Location;
