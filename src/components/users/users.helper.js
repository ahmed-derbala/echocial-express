const { errorHandler } = require('../../core/utils/error')

module.exports.makeAuthKeyQuery = ({ key, kind }) => {
	let authKeyQuery = {}

	switch (kind) {
		case 'email':
			authKeyQuery.email = key
			break

		case 'username':
			authKeyQuery.username = key
			break

		case 'phone':
			authKeyQuery.phone = key
			break
	}
	console.log({ authKeyQuery })
	return authKeyQuery
}

module.exports.pickOneFilter = ({ filters }) => {
	console.log(filters)
	const keyWithValue = Object.keys(filters).find((key) => filters[key] !== null && filters[key] !== undefined)

	return { [keyWithValue]: filters[keyWithValue] }
}
