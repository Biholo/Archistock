import React, { useState, useEffect } from 'react'
import AsideItem from '../AsideItem/AsideItem'
import { Cloud, Lightning, UploadSimple , Sliders, Cube } from '@phosphor-icons/react'

export default function Aside() {

  const [active, setActive] = useState('storage' as string)

  useEffect(() => {
    setActive(window.location.pathname.split('/')[1])
  }, [window.location.pathname])

  const handleChangeItem = (item: string) => {
    setActive(item)
  }

  return (
    <React.Fragment>
        <div className="flex flex-col my-4 mx-4">
          <div className='title flex flex-row justify-center md:justify-between items-center'>
            <h1>
              <span className='font-bold hidden md:block text-lg xl:text-xl'>🔗Archistock</span>
              <span className='font-black block md:hidden text-xl text-center'>AS</span>
            </h1>
            <p className='text-xs hidden lg:block'>1.0.0</p>
          </div>
          <hr className="w-full h-0.5 mx-auto my-4 bg-gray-300 border-0 rounded" />
          <AsideItem title='Your storage' icon={<Cloud size={20} weight="bold" />} link='storage' active={active === 'storage'} onClick={() => handleChangeItem('storage')}></AsideItem>
          <AsideItem title='Extend storage' icon={<Lightning size={20} weight="bold" />} link='extend' active={active === 'extend'} onClick={() => handleChangeItem('extend')}></AsideItem>
          <AsideItem title='Upload files' icon={<UploadSimple size={20} weight="bold" />} link='upload' active={active === 'upload'} onClick={() => handleChangeItem('upload')}></AsideItem>
          <AsideItem title='Settings' icon={<Sliders size={20} />} link='settings' active={active === 'settings'} onClick={() => handleChangeItem('settings')}></AsideItem>
          <AsideItem title='Components' icon={<Cube size={20} />} link='components' active={active === 'components'} onClick={() => handleChangeItem('components')}></AsideItem>
        </div>
    </React.Fragment>
  )
}
