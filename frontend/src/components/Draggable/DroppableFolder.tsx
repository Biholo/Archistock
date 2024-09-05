import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../models/ItemTypesModel';
import DraggableFolder from './DraggableFolder';

const DroppableFolder = ({ folder, onDrop, onClick, onDelete, onUpdate }: any) => {
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.FILE],
    drop: (item: any) => {
      onDrop(item.file, folder);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} style={{ backgroundColor: isOver ? 'lightgrey' : ""}}>
      <DraggableFolder folder={folder} onFolderClick={onClick} onDelete={onDelete} onUpdate={onUpdate} />
    </div>
  );
};

export default DroppableFolder;
