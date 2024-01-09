import { useSettingsContext } from "@/context/SettingsProvider";
import React, { useState } from "react";

const MIN_QUALITY = 30;
const MAX_QUALITY = 100;
const STEP = 10;

interface ImageSliderProps {
	onQualityChange: (value: number) => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ onQualityChange }) => {
	const [selectedImageQuality, setSelectedImageQuality] = useState(30);

	const { settings, updateSettings } = useSettingsContext();

	const handleImageQualityChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const quality = parseInt(event.target.value, 10);
		console.log("quality", quality);
		setSelectedImageQuality(quality);
		onQualityChange(quality);
		updateSettings({ ...settings, imageQuality: quality });
	};

	const generateStepIntervals = () => {
		const intervals = [];
		for (let i = MIN_QUALITY; i <= MAX_QUALITY; i += STEP) {
			intervals.push(
				<li key={i} className="flex justify-center relative">
					<span
						className={`absolute ${
							selectedImageQuality === i ? "text-md font-bold" : "text-sm"
						}`}
					>
						{i}
					</span>
				</li>
			);
		}
		return intervals;
	};

	return (
		<div>
			<label
				htmlFor="image-quality"
				className="mb-2 text-sm font-medium text-gray-900"
			>
				Output quality
			</label>
			<input
				id="image-quality"
				type="range"
				min={MIN_QUALITY}
				max={MAX_QUALITY}
				step={STEP}
				value={selectedImageQuality}
				onChange={handleImageQualityChange}
				className="w-full h-2 accent-pink-500 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
			/>
			<ul className="flex justify-between w-full px-[10px]">
				{generateStepIntervals()}
			</ul>
		</div>
	);
};

export default ImageSlider;
