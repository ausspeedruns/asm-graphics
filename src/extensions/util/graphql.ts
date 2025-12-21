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

	if (result.errors) {
		console.error('GraphQL Errors:', result.errors);
		throw new Error('GraphQL request failed');
	}

	return result.data;
}
