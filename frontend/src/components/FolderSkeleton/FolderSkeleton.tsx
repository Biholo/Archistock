
import { Folder } from '@phosphor-icons/react';
import React from 'react';

const FolderSkeleton = () => {
    return (

        <div className='flex flex-col mt-2 items-center'>
            <Folder size={42} className='text-amber-400 animate-pulse' weight="fill"  />
            <div role="status" className="flex items-center justify-center h-3 w-14 mt-2 bg-gray-300 rounded-lg animate-pulse dark:bg-gray-300"></div>

        </div>

    );
}

export default FolderSkeleton;