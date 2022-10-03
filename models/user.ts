import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connection";

export const User = sequelize.define("user", {
	fullName: DataTypes.STRING,
	email: DataTypes.STRING,
});

// export class User extends Model {}

// User.init(
// 	{
// 		fullName: DataTypes.STRING,
// 		email: DataTypes.STRING,
// 	},
// 	{ sequelize, modelName: "user" }
// );
