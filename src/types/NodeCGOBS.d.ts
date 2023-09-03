// Retrived from the source file
export interface OBSSceneItemProperties {
	rotation?: number;
	visible?: boolean;
	locked?: boolean;
	bounds: { y?: number; type?: string; alignment?: number; x?: number };
	scale: { x?: number; y?: number };
	crop: { top?: number; left?: number; right?: number; bottom?: number };
	position: { x?: number; y?: number; alignment?: number };
}
