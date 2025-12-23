export async function queryGraphQL(uri: string, query: string, variables: Record<string, any> = {}) {
	const response = await fetch(uri, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	const result = await response.json();

	if (!result || typeof result !== 'object') {
		console.error('Invalid GraphQL response:', result);
		return null;
	}

	if ('errors' in result) {
		console.error('GraphQL Errors:', result.errors);
		throw new Error('GraphQL request failed');
	}

	if (!('data' in result)) {
		console.error('No data field in GraphQL response:', result);
		return null;
	}

	return result.data;
}
