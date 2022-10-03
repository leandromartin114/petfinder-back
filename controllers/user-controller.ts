import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { Auth } from "../models";
import { User } from "../models";

const SECRET = process.env.JWT_SECRET;

//generate the encripted pass
function getSHA256ofString(text) {
	return crypto.createHash("sha256").update(text).digest("hex");
}

//find user by email
export async function findUser(data) {
	try {
		const userFinded = await User.findOne({
			where: { email: data.email },
		});
		if (userFinded) {
			return "Yes";
		} else {
			return "No";
		}
	} catch (error) {
		console.log(error);
	}
}
//create user and his auth element if it doesn't exist
export async function findOrCreateUser(bodyData) {
	const { email, fullName, password } = bodyData;
	try {
		const [user, created] = await User.findOrCreate({
			where: { email: email },
			defaults: {
				email,
				fullName,
			},
		});
		const [auth, authCreated] = await Auth.findOrCreate({
			where: { userId: user.get("id") },
			defaults: {
				email,
				password: getSHA256ofString(password),
				userId: user.get("id"),
			},
		});
		return user;
	} catch (error) {
		console.log(error);
	}
}
//generate the token for validation
export async function generateToken(bodyData) {
	const { email, password } = bodyData;
	const passwordHash = getSHA256ofString(password);
	try {
		const auth = await Auth.findOne({
			where: {
				email,
				password: passwordHash,
			},
		});
		if (auth) {
			const token = jwt.sign({ id: auth.get("userId") }, SECRET);
			return token;
		} else {
			const token = "invalid password";
			return token;
		}
	} catch (error) {
		console.log(error);
	}
}
//getting the user data
export async function getUserData(userId: number) {
	try {
		const user = await User.findByPk(userId);
		return user;
	} catch (error) {
		console.log(error);
	}
}
//updating a user
export async function updateUser(userId: number, data) {
	if (data.password) {
		const dataForUser = {
			fullName: data.fullName,
			email: data.email,
		};
		const passwordHash = getSHA256ofString(data.password);
		const dataForAuth = {
			fullName: data.fullName,
			email: data.email,
			password: passwordHash,
		};
		try {
			const userUpdated = await User.update(dataForUser, {
				where: { id: userId },
			});
			const authUpdated = await Auth.update(dataForAuth, {
				where: { userId: userId },
			});
			return userUpdated;
		} catch (error) {
			console.log(error);
		}
	} else {
		const dataForUpdate = {
			fullName: data.fullName,
			email: data.email,
		};
		try {
			const userUpdated = await User.update(dataForUpdate, {
				where: { id: userId },
			});
			const authUpdated = await Auth.update(dataForUpdate, {
				where: { userId: userId },
			});
			return userUpdated;
		} catch (error) {
			console.log(error);
		}
	}
}
