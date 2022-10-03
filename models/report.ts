import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connection";

export const Report = sequelize.define("report", {
	fullName: DataTypes.STRING,
	phoneNumber: DataTypes.BIGINT,
	placeDescription: DataTypes.STRING,
	petId: DataTypes.INTEGER,
});

// export class Report extends Model {}

// Report.init(
// 	{
// 		fullName: DataTypes.STRING,
// 		phoneNumber: DataTypes.BIGINT,
// 		placeDescription: DataTypes.STRING,
// 		petId: DataTypes.INTEGER,
// 	},
// 	{ sequelize, modelName: "report" }
// );
