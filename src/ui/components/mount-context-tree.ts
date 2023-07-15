import { createContextTreesFor } from "./create-context-trees-for";
import BetterBacklinksPlugin from "../../plugin";
import { LinkCache, TAbstractFile } from "obsidian";

// import { renderContextTree } from "../solid/render-context-tree";

interface MountContextTreeProps {
	path: string;
	plugin: BetterBacklinksPlugin;
	el: HTMLElement;
}

export interface PathsWithLinks {
	[path: string]: LinkCache[];
}

declare module "obsidian" {
	interface MetadataCache {
		getBacklinksForFile: (file: TAbstractFile) => {
			data: PathsWithLinks;
		};
	}
}

export async function mountContextTree({
	path,
	plugin,
	el,
}: MountContextTreeProps) {

	const activeFile = plugin.app.workspace.getActiveFile();
	if (!activeFile) {
		throw new Error(`No active file`);
	}
	const { data } = plugin.app.metadataCache.getBacklinksForFile(activeFile);

	const contextTrees = await createContextTreesFor(
		data,
		plugin.app.vault,
		plugin.app.metadataCache
	);

	el.createEl("pre", { text: JSON.stringify(contextTrees, null, 2)})

	// await renderContextTree({
	// 	resultCount: countOfRefs,
	// 	contextTrees,
	// 	el,
	// 	plugin,
	// });
}
