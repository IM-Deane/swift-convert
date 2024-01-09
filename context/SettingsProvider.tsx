import React, { createContext, useContext, useState, useEffect } from "react";

import { FileType, SettingsKeys } from "@/types/index";
import { FeatureDiscoveryItem } from "@/types/site-config";
import siteConfig from "site.config";

type Settings = {
	fileInputId: string;
	fileOutputId: string;
	imageQuality: number;
	fileTypes?: string[];
};

type SettingsContextProperties = {
	settings: Settings | null;
	selectedFeature: FeatureDiscoveryItem;
	knownUploadedFileTypes: { [key: string]: string };
	updateSettings: ({
		fileInputId,
		fileOutputId,
		imageQuality,
	}: Settings) => void;
	handleSelectFeature: (featureId: string) => void;
	handleknownUploadedFileTypes: (fileExt: string) => void;
};

export const defaultSettings: Settings = {
	fileInputId: FileType.heic,
	fileOutputId: FileType.jpeg,
	imageQuality: 70,
	fileTypes: ["image/*", ".heif", ".heic"],
};

const SettingsContext = createContext<SettingsContextProperties>({
	settings: defaultSettings,
	selectedFeature: null,
	knownUploadedFileTypes: {},
	updateSettings: () => undefined,
	handleSelectFeature: () => undefined,
	handleknownUploadedFileTypes: () => undefined,
});

interface Properties {
	children: React.ReactNode;
}

const SettingsProvider = ({ ...properties }: Properties) => {
	const [settings, setSettings] = useState<Settings>(null);
	const [selectedFeature, setSelectedFeature] =
		useState<FeatureDiscoveryItem>(null);
	const [knownUploadedFileTypes, setKnownUploadedFileTypes] = useState<any>({});

	/**
	 * Handles changes regarding custom file settings.
	 */
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

	/**
	 * Searches the object keys for the feature with the given ID.
	 */
	const handleSelectFeature = (featureId: string) => {
		for (let key in siteConfig.featureDiscovery) {
			if (siteConfig.featureDiscovery[key].id === featureId) {
				setSelectedFeature(siteConfig.featureDiscovery[key]);
			}
		}
	};

	const handleknownUploadedFileTypes = (fileExt: string) => {
		if (!fileExt) {
			setKnownUploadedFileTypes({});
		} else if (!knownUploadedFileTypes[fileExt]) {
			setKnownUploadedFileTypes({
				...knownUploadedFileTypes,
				[fileExt]: `.${fileExt}`,
			});
		}
	};

	const returnValue = {
		settings,
		selectedFeature,
		knownUploadedFileTypes,
		updateSettings,
		handleSelectFeature,
		handleknownUploadedFileTypes,
	};

	useEffect(() => {
		if (!settings) {
			const input = localStorage.getItem(SettingsKeys.FILE_INPUT_TYPE);
			const output = localStorage.getItem(SettingsKeys.FILE_OUTPUT_TYPE);
			const imageQuality = Number(
				localStorage.getItem(SettingsKeys.IMAGE_QUALITY)
			);
			updateSettings({
				fileInputId: input === null ? defaultSettings.fileInputId : input,
				fileOutputId: output === null ? defaultSettings.fileOutputId : output,
				imageQuality: imageQuality === 0 ? 85 : imageQuality,
			});
		}
	}, [settings]);

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
