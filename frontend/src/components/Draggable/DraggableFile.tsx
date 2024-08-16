import { useDrag } from 'react-dnd';
import { ItemTypes } from '../../models/ItemTypes';
import FileDetails from '../FileDetails/FileDetails';

const DraggableFile = ({ file, onClick, onDelete, onUpdate }: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FILE,
    item: { file },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <FileDetails file={file} onClick={(e:any) => { onClick(e) }} onDelete={onDelete} onUpdate={onUpdate} />
    </div>
  );
};

export default DraggableFile;
