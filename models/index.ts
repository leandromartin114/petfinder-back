import { User } from "./user";
import { Auth } from "./auth";
import { Pet } from "./pet";
import { Report } from "./report";

Auth.belongsTo(User);
Pet.belongsTo(User);
User.hasMany(Pet);
Pet.hasMany(Report);

export { User, Auth, Pet, Report };
