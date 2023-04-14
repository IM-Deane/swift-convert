import React, { createContext, useContext, useState, useEffect } from "react";

import { SettingsKeys } from "@/types/index";

type Settings = {
	fileInputId: string;
	fileOutputId: string;
	imageQuality: number;
};

type SettingsContextProperties = {
	settings: Settings | null;
	updateSettings: ({
		fileInputId,
		fileOutputId,
		imageQuality,
	}: Settings) => void;
};

const SettingsContext = createContext<SettingsContextProperties>({
	settings: null,
	updateSettings: ({ fileInputId, fileOutputId, imageQuality }) => undefined,
});

interface Properties {
	children: React.ReactNode;
}

const SettingsProvider = ({ ...properties }: Properties) => {
	const [settings, setSettings] = useState<Settings>(null);

	const updateSettings = ({
		fileInputId,
		fileOutputId,
		imageQuality,
	}: Settings) => {
		localStorage.setItem(SettingsKeys.FILE_INPUT_TYPE, fileInputId);
		localStorage.setItem(SettingsKeys.FILE_OUTPUT_TYPE, fileOutputId);
		localStorage.setItem(SettingsKeys.IMAGE_QUALITY, imageQuality.toString());

		setSettings({
			fileInputId: fileInputId,
			fileOutputId: fileOutputId,
			imageQuality: imageQuality,
		});
	};

	const returnValue = {
		settings,
		updateSettings,
	};

	useEffect(() => {
		if (!settings) {
			const input = localStorage.getItem(SettingsKeys.FILE_INPUT_TYPE);
			const output = localStorage.getItem(SettingsKeys.FILE_OUTPUT_TYPE);
			const imageQuality = localStorage.getItem(SettingsKeys.IMAGE_QUALITY);

			updateSettings({
				fileInputId: input,
				fileOutputId: output,
				imageQuality: Number(imageQuality),
			});
		}
	}, []);

	return <SettingsContext.Provider value={returnValue} {...properties} />;
};

const useSettingsContext = () => {
	const context = useContext(SettingsContext);
	if (!context)
		throw new Error(
			"useSettingsContext must be used within a SettingsProvider"
		);

	return context;
};

export {
	SettingsContext,
	SettingsProvider as SettingsProvider,
	useSettingsContext,
};
