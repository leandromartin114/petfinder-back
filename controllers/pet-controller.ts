import { Pet } from "../models";
import { index } from "../lib/algolia";
import { cloudinary } from "../lib/cloudinary";

function bodyToIndex(body, id) {
	const result: any = {};
	if (id) {
		result.objectID = id;
	}
	if (body.name) {
		result.name = body.name;
	}
	if (body.description) {
		result.description = body.description;
	}
	if (body.location) {
		result.location = body.location;
	}
	if (body.lat && body.lng) {
		result._geoloc = {
			lat: body.lat,
			lng: body.lng,
		};
	}
	if (body.email) {
		result.email = body.email;
	}
	if (body.state) {
		result.state = body.state;
	}
	if (body.imgURL) {
		result.imgURL = body.imgURL;
	}
	return result;
}
//create a new pet to report
export async function createPet(userId: number, petData) {
	let image;
	if (petData.imgURL) {
		image = await cloudinary.uploader.upload(petData.imgURL, {
			resource_type: "image",
			discard_original_filename: true,
			width: 500,
		});
		const newPetReported = await Pet.create({
			name: petData.name,
			description: petData.description,
			imgURL: image.secure_url,
			location: petData.location,
			lat: petData.lat,
			lng: petData.lng,
			state: petData.state,
			email: petData.email,
			userId: userId,
		});
		const petDataForIndex = {
			name: petData.name,
			description: petData.description,
			imgURL: image.secure_url,
			location: petData.location,
			lat: petData.lat,
			lng: petData.lng,
			state: petData.state,
			email: petData.email,
		};
		const indexFormatted = bodyToIndex(
			petDataForIndex,
			newPetReported.get("id")
		);
		const newIndex = await index.saveObject(indexFormatted);
		return newPetReported;
	} else {
		const newPetReported = await Pet.create({
			name: petData.name,
			description: petData.description,
			imgURL: "img",
			location: petData.location,
			lat: petData.lat,
			lng: petData.lng,
			state: petData.state,
			email: petData.email,
			userId: userId,
		});
		const indexFormatted = bodyToIndex(petData, newPetReported.get("id"));
		const newIndex = await index.saveObject(indexFormatted);
		return newPetReported;
	}
}
//update an existing pet
export async function uptadePet(petId: number, petData) {
	let image;
	if (petData.imgURL) {
		image = await cloudinary.uploader.upload(petData.imgURL, {
			resource_type: "image",
			discard_original_filename: true,
			width: 1000,
		});
		const petUpdated = await Pet.update(
			{
				name: petData.name,
				description: petData.description,
				imgURL: image.secure_url,
				location: petData.location,
				lat: petData.lat,
				lng: petData.lng,
				state: petData.state,
				email: petData.email,
			},
			{
				where: { id: petId },
			}
		);
		const petDataForIndex = {
			...petData,
			imgURL: image.secure_url,
		};
		const indexFormatted = bodyToIndex(petDataForIndex, petId);
		const indexUpdated = await index.partialUpdateObject(indexFormatted);
		return petUpdated;
	} else {
		const petUpdated = await Pet.update(
			{
				...petData,
			},
			{
				where: { id: petId },
			}
		);
		const indexFormatted = bodyToIndex(petData, petId);
		const indexUpdated = await index.partialUpdateObject(indexFormatted);
		return petUpdated;
	}
}
//get all my pets
export async function getAllMyPets(userId: number) {
	const allMyPets = await Pet.findAll({
		where: { userId: userId },
	});
	return allMyPets;
}
//get pet by id
export async function getPetById(petId: number) {
	const petFinded = await Pet.findByPk(petId);
	return petFinded;
}
//get pets near by
export async function getPetsNearBy(data) {
	const { lat, lng } = data;
	const petsFinded = await index.search("", {
		aroundLatLng: [lat, lng].join(","),
		aroundRadius: 10000,
	});
	return petsFinded.hits;
}
