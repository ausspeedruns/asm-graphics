import { useDroppable } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";
import styles from "./container.module.css";

interface ContainerProps {
	id: string;
	title: string;
	items: string[];
}

export function Container({ id, title, items }: ContainerProps) {
	const { setNodeRef } = useDroppable({ id });

	return (
    <div className={styles.containerBox} ref={setNodeRef}>
      <h3 className={styles.containerTitle}>{title}</h3>
			<SortableContext items={items} strategy={horizontalListSortingStrategy}>
        <div className={styles.itemList} style={{ minHeight: "80px", flex: 1 }}>
					{items.map((itemId) => (
						<SortableItem key={itemId} id={itemId} />
					))}
        </div>
			</SortableContext>
    </div>
	);
}
