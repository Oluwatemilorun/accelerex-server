/**
 * WARNING!!!
 *
 * This file generates the accelerex-client
 *
 * Edit only if you know what you're doing.
 *
 * Written by Isaac Oluwatemilorun <akiolisa@gmail.com>
 *
 * This is intended to ease the pain of writing multiple graphql schema
 * and type definitions. Could easily be consumed/used on the mobile/web app
 * without extra configuration and code repetition.
 */

import { GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLNonNull, TypeNode } from 'graphql';

export const getType = (type: any, options?: any) => {
	if (type instanceof GraphQLNonNull) {
		return getType(type.ofType, { ...options, nonnull: true });
	}

	if (type instanceof GraphQLList) {
		return getType(type.ofType, { ...options, list: true });
	}

	if (type instanceof GraphQLObjectType) {
		return `${type.name}${options?.list && !options.nolist ? '[]' : ''}`;
	}
};

export const getTypeFromNode = (type: TypeNode, options?: any) => {
	if (type.kind === 'NamedType') {
		return `${type.name.value}${options && options.nonnull ? '!' : ''}`;
	}

	if (type.kind === 'NonNullType') {
		return getTypeFromNode(type.type, { ...options, nonnull: true });
	}

	if (type.kind === 'ListType') {
		return getTypeFromNode(type.type, { ...options, list: true });
	}
};

export const plugin = (schema: GraphQLSchema) => {
	const imports = new Set();

	const mutations = Object.keys(schema.getMutationType().getFields()).map((fieldname) => {
		const field = schema.getMutationType().getFields()[fieldname];
		const args = field.astNode.arguments
			.map((arg) => '$' + arg.name.value + ': ' + getTypeFromNode(arg.type))
			.join(', ');

		const argnames = field.astNode.arguments
			.map((arg) => arg.name.value + ': $' + arg.name.value)
			.join(', ');

		const typeName = fieldname.charAt(0).toUpperCase() + fieldname.slice(1);

		if (args) {
			imports.add('Mutation' + typeName + 'Args');
		}

		imports.add(getType(field.type, { nolist: true }));

		return `
	${fieldname} = async (${args && `args: Mutation${typeName}Args, `}info: string) => {
		return (await this._request<
			{ ${fieldname}: ${getType(field.type)} },
			${args ? `Mutation${typeName}Args` : null}
		>(
			\`mutation ${fieldname}${args && `(${args})`} {
				${fieldname}${args && `(${argnames})`} \${info}
			}\`,
			${args && `args`}
		)).${fieldname}
	}`;
	});

	const queries = Object.keys(schema.getQueryType().getFields()).map((fieldname) => {
		const field = schema.getQueryType().getFields()[fieldname];
		const args = field.astNode.arguments
			.map((arg) => '$' + arg.name.value + ': ' + getTypeFromNode(arg.type))
			.join(', ');

		const argnames = field.astNode.arguments
			.map((arg) => arg.name.value + ': $' + arg.name.value)
			.join(', ');

		const typeName = fieldname.charAt(0).toUpperCase() + fieldname.slice(1);
		if (args) {
			imports.add('Query' + typeName + 'Args');
		}

		imports.add(getType(field.type, { nolist: true }));

		return `
	${fieldname} = async (${args && `args: Query${typeName}Args, `}info: string) => {
		return (await this._request<
			{ ${fieldname}: ${getType(field.type)} },
			${args ? `Query${typeName}Args` : null}
		>(
			\`query ${fieldname}${args && `(${args})`} {
				${fieldname}${args && `(${argnames})`} \${info}
			}\`,
			${args && `args`}
		)).${fieldname}
	}`;
	});

	return `/**
 * This client module is auto generated on the server.
 *
 * Generated on ${new Date().toISOString()}
 */

import { AxiosInstance } from 'axios'
import FormData from 'form-data'
import {
	${Array.from(imports).join(`,\n	`).replace(`	,\n`, '')}
} from '../types'

export * from "../types"

export class AccelerexClient {
	constructor(
		private instance: AxiosInstance,
		private errorHandler?: (e: any) => any,
	) {}

	private _token?: string

	public set token(token: string) {
		this._token = token
	}

	private _handleError = (e: any) => {
		if (this.errorHandler) this.errorHandler(e)
	}

	private _request = async <T, V = any>(
		query: string | FormData,
		variables: V = {} as any,
		headers?: { [key: string]: string },
	): Promise<T> => {
		variables = variables || ({} as any)
		headers = this._token
			? { ...(headers || {}), authorization: 'Bearer ' + this._token }
			: headers || {}

		try {
			const { data } = await this.instance.post<{ data: T }>('/graphql',
				query instanceof FormData ? query : { query, variables },
				{
					headers,
				},
			)

			if ((data as any).errors) {
				throw (data as any).errors
			}

			return data.data
		} catch (e) {
			this._handleError(e)
			return Promise.reject(e)
		}
	}

	${mutations.join(`\n`)}
	${queries.join(`\n`)}
}
`;
};
