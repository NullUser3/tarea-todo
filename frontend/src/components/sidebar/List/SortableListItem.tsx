import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CSSProperties, useEffect, useState } from 'react';
import { ListTypes } from '../../customHooks/usePersonalList';
import { Menu, Square } from 'lucide-react';
import { TextLimit } from '../../mainSidebar/MainProfile';
import { ListDropdown } from './Lists';
import { useNavigate, useParams } from 'react-router-dom';
import { boolean } from 'zod';
import {EditList} from './EditList';
import { useMenu } from './MenuProvider';

export const ListDragPreview = ({ item }: { item: ListTypes }) => {
  return (
    <div data-id={item.id} className="px-4 cursor-move h-full text-sm text-gray-800 pointer-events-none p-2 flex items-center justify-between dark:text-texto font-normal bg-main dark:bg-dd">
      <div className='flex items-center space-x-2'>
        <div>
            <Menu size={17} className='text-darko dark:text-white' />
          </div>
<Square
            className={`w-4 h-4`}
            style={{ fill: item.color, stroke: item.color }}
          />
      <TextLimit text={item.name} limit={10} />
      </div>
      
      <div className='flex items-center justify-center w-5 h-5 group-hover:hidden bg-dmain dark:bg-ddd dark:text-texto text-gray-800 text-xs font-semibold rounded-md'>
            {item.taskCount}
          </div>
    </div>
  );
};

export const SortableListItem = ({ item,loading,onSetDelete}: { item: ListTypes,loading:boolean,onSetDelete:(id:string)=>void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });
  const {id} = useParams<{id:string}>();
  const[selectedList,setSelectedList] = useState<string|null>(null);
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const navigate = useNavigate();

const handleClick = (id: string) => {
  navigate(`/lists/${id}`);
};

const {setId,setOpenEdit} = useMenu();

const openingEditMenu =(id:string) =>{
setId(id);
setOpenEdit(true);
}


  return (
    <>
    {loading &&(
<div className="w-full max-w-md mx-auto animate-pulse p-9">
    <h1 className="h-2 bg-gray-300 rounded-lg w-52 dark:bg-gray-600"></h1>

    <p className="w-48 h-2 mt-6 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
    <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
    <p className="w-64 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
    <p className="w-4/5 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
</div>
    )}
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      data-id={item.id}
      className="group flex px-2 pr-4"
    >
      <button
      onClick={()=>{handleClick(item.id)}}
        className={`group p-2 flex justify-between w-full font-normal transition-all duration-75 rounded-lg hover:bg-main ${item.id===id?'bg-main dark:bg-dd dark:text-white text-d':''} dark:hover:bg-dd text-darko dark:text-lighto hover:dark:text-white hover:text-d`}
      >
        <div className='flex space-x-2 items-center h-full text-sm'>
          <div role="button" {...listeners}>
            <Menu size={17} className='text-darko dark:text-white cursor-move' />
          </div>
          <Square
            className={`w-4 h-4`}
            style={{ fill: item.color, stroke: item.color }}
          />
          <TextLimit text={item.name} limit={8} />
        </div>
        <div role="button" className="group-hover: flex items-center justify-center">
          <div className='flex items-center justify-center w-5 h-5 group-hover:hidden  dark:text-white text-darko text-xs font-semibold rounded-md'>
            {item.taskCount>0?item.taskCount:<></>}
          </div>
          <ListDropdown share="" edit={item.id} onEdit={(edit)=>{openingEditMenu(edit)}} archive="" deletee={item.id} onDelete={onSetDelete}/>
        </div>
      </button>
    </li>
    </>
  );
  
};
