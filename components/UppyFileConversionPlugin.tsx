/** @jsxRuntime classic */
/** @jsx h */
import { Uppy, UIPlugin, UIPluginOptions } from "@uppy/core";
import ConvertToDropdown from "./CustomDropdown";
import { Input } from "@/types/index";
import { h } from "preact";

interface UppyFileConversionPluginOptions extends UIPluginOptions {
	target?: any;
	formats: Input[];
	id?: string;
}

class UppyFileConversionPlugin extends UIPlugin<UppyFileConversionPluginOptions> {
	selectedFormat: Input | null;
	opts: any;

	constructor(uppy: Uppy, opts: UppyFileConversionPluginOptions) {
		super(uppy, opts);
		this.id = opts.id || "UppyFileConversionPlugin";
		this.type = "editor";

		this.opts = {
			formats: opts.formats || [],
		};

		this.selectedFormat = opts.formats[0]; // TODO: pass in default format?
	}

	selectFile = (fileId: string) => {
		const file = this.uppy.getFile(fileId);
		if (!file) return;
		if (!this.canEditFile(file)) return;
		console.log("selectFile", file);

		this.uppy.emit("preprocess-progress", file, {
			mode: "indeterminate",
			message: "Converting...",
		});

		this.uppy.emit("preprocess-complete", file);
	};

	canEditFile(file) {
		console.log("canEditFile", file);
		// TODO: Implement logic to check if the file type is supported
		return true; // Placeholder
	}

	handleFormatChange = (format: Input) => {
		this.selectedFormat = format;
		// Logic to apply the format to files
	};

	install() {
		this.setPluginState({
			currentFormat: null,
		});

		const { target } = this.opts;
		if (target) {
			this.mount(target, this);
		}
	}

	uninstall() {
		console.log("UppyFileConversionPlugin uninstall");
		this.unmount();
	}

	render() {
		const { currentFormat } = this.getPluginState();

		return (
			<ConvertToDropdown
				inputLabel="Convert to"
				inputList={this.opts.formats}
				selectedInput={currentFormat as Input}
				handleSelectedInput={this.handleFormatChange}
			/>
		);
	}
}

export default UppyFileConversionPlugin;
