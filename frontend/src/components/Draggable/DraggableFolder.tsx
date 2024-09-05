import { useDrag } from 'react-dnd';
import { ItemTypes } from '../../models/ItemTypesModel';
import FolderIcon from '../FolderIcon/FolderIcon';

const DraggableFolder = ({ folder, onFolderClick, onDelete }: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FOLDER,
    item: { folder },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <FolderIcon folder={folder} onFolderClick={onFolderClick} onDelete={onDelete} />
    </div>
  );
};

export default DraggableFolder;
