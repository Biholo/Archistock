import React from 'react';
import './StatsCard.scss';

export default function StatsCard({ stat, name, color, icon }: { stat: any, name: string, color: string, icon?: any }) {
  return (
    <div className='relative flex items-center py-4 px-6 card-background shadow-md rounded-lg min-w-[250px]'>
      {icon && 
        <div className='flex-shrink-0 mr-4'>
          <div className='w-12 h-12 flex items-center justify-center rounded-full' style={{ backgroundColor: `${color}18`, color: color }}>
            {icon}
          </div>
        </div>
      }
      <div className='flex-1 flex flex-col items-start'>
      <p className='text-5xl font-bold' style={{ color }}>{stat}</p>
      <p className='text-md font-semibold'>{name}</p>
      </div>
    </div>
  );
}
