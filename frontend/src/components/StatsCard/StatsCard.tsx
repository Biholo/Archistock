import React, { useEffect, useState } from 'react';
import './StatsCard.scss';

export default function StatsCard({stat, name, color} : {stat: number, name:string, color: string}) {

  return (
    <React.Fragment>
        <div className='flex flex-row flex-wrap py-5 px-10 items-end card-background shadow-md'>
          <div className="blur-2xl" style={{backgroundColor: color}}>
            32
          </div>  
            <p className="text-4xl font-bold" style={{color: color}}>{stat}</p>
          <p className='text-lg font-bold'>{name}</p>
        </div>
    </React.Fragment>
  )
}
