import type { NextApiRequest, NextApiResponse } from "next";

import { Client, APIErrorCode, ClientErrorCode } from "@notionhq/client";

import type { WaitListBodyContents } from "types/api";

import * as EmailValidator from "email-validator";

const notion = new Client({
	auth: process.env.NOTION_TOKEN,
});
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

	try {
		const body: WaitListBodyContents = req.body;
		const email = parseAndValidateEmail(body.email, res);
		await addUserToWaitList({ ...body, email }); // FIXME: use better error handling

		res.status(200).send("User added to waitlist");
	} catch (error: any) {
		console.error(error);
		res.status(500).send(error.message);
	}
}

async function addUserToWaitList(body: WaitListBodyContents) {
	const response = await notion.databases.query({
		database_id: NOTION_DATABASE_ID,
	});

	response.results.forEach((result: any) => {
		console.log(result.properties.Features.multi_select);
		if (
			result.properties.Email.email.toLowerCase() === body.email.toLowerCase()
		) {
			if (
				result.properties.Features.multi_select.find(
					(feature) => feature.id === body.featureId
				)
			) {
				throw new Error("User is already on waitlist for this feature");
			} else {
				const newFeatureList = [
					...result.properties.Features.multi_select,
					{ id: body.featureId },
				];
				updateUserFeatureList(result.id, newFeatureList).catch((error) => {
					throw new Error(error);
				});
			}
		}
	});

	const createResponse = await createNotionRowEntry(body);
	return createResponse;
}

function parseAndValidateEmail(email: string, res: NextApiResponse) {
	if (!email) {
		res.status(400).send("Missing email");
	} else if (email.length > 300) {
		res.status(400).send("Email is too long");
	} else if (!EmailValidator.validate(email)) {
		res.status(400).send("Invalid email");
	}
	return email;
}

async function createNotionRowEntry(body: WaitListBodyContents) {
	const userRowProperties = {
		Name: {
			id: "title",
			type: "title",
			title: [
				{
					type: "text",
					text: {
						content: body.name,
					},
				},
			],
		},
		Email: {
			id: "oZbC",
			type: "email",
			email: body.email,
		},
		"Early Adopter": {
			id: "BBla",
			type: "checkbox",
			checkbox: body.isEarlyAdopter,
		},
		Priority: {
			id: "%26~vW",
			type: "select",
			select: {
				id: "c320c398-6b44-456b-a761-df09ee5b820d",
				name: "Medium",
				color: "orange",
			},
		},
		Status: {
			id: "'!~!",
			type: "select",
			select: {
				id: "06740eb8-fdbf-4a3b-8706-d24efa61648b",
				name: "Lead",
				color: "pink",
			},
		},
		Features: {
			id: "%60Zy%3F",
			type: "multi_select",
			// FIXME: use a global enum for the ids her
			multi_select: [{ id: "{fw=", name: "Email Images" }],
		},
	};
	return await notion.pages.create({
		parent: {
			type: "database_id",
			database_id: NOTION_DATABASE_ID,
		},
		properties: userRowProperties,
	});
}

async function updateUserFeatureList(
	pageId: string,
	updatedFeatureList: any[]
) {
	return await notion.pages.update({
		page_id: pageId,
		properties: {
			Features: {
				type: "multi_select",
				// FIXME: use a global enum for the ids her
				multi_select: updatedFeatureList,
			},
		},
	});
}
