import React, { useEffect, useState } from 'react';
import './StatsCard.scss';

export default function StatsCard({stat, name, color} : {stat: any, name: string, color: string}) {

  return (
    <React.Fragment>
      <div className='relative flex flex-row flex-wrap py-5 px-10 card-background shadow-md'>
          <div className="absolute left-8 top-8 w-1/4 h-1/4 blur-lg" style={{backgroundColor: color+'99'}}></div>  
          <div className="z-10 gap-3 flex flex-row items-end">
              <p className="text-5xl font-bold" style={{color: color}}>{stat}</p>
              <p className='text-2xl font-bold'>{name}</p>
          </div>
      </div>
  </React.Fragment>

  )
}
