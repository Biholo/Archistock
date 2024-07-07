import React from 'react';
import Card from '../../components/Card/Card';
import StatsCard from '../../components/StatsCard/StatsCard';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

export default function ComponentsTest() {
  return (
    <React.Fragment>
        <div className='min-h-dvh m-5'>
          <h2 className='font-bold'>Card:</h2>
          <Card title='test' css="f">
            <p>Test</p>
          </Card>
          
          <h2 className='pt-5'>Stats Card:</h2>
          <div className="flex flex-row justify-between">
            <StatsCard stat={32} name="State" color="#FFA800"></StatsCard>
            <StatsCard stat={32} name="Name" color="#E757B6"></StatsCard>
            <StatsCard stat={32} name="Name" color="#24B34C"></StatsCard>
            <StatsCard stat={32} name="Name" color='#7C57E7'></StatsCard>
          </div>

          <h2 className='pt-5'>Input:</h2>
          <Input label='Email' labelWeight="bold" placeholder='email@mail.com' pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$" onChange={() => { } } type='email' name='email' required={true} disabled={false} color='' value={''} css={''}></Input>
          <Input label='Password' labelWeight="black" placeholder='Test' pattern="" onChange={() => { } } type='password' name='test' required={true} disabled={false} color='primary' value={''} css={''}></Input>
          <Input label='Test' labelWeight="" placeholder='Test' pattern="" onChange={() => { } } type='text' name='test' required={false} disabled={true} color='danger' value={''} css={''}></Input>

          <h2 className='pt-5'>Button:</h2>
          <Button label='Primary' onClick={()=>{}} color='primary'></Button>
          <Button label='Secondary' onClick={()=>{}} color='secondary'></Button>
          <Button label='Success' onClick={()=>{}} color='success'></Button>
          <Button label='Danger' onClick={()=>{}} color='danger'></Button>
          <Button label='Warning' onClick={()=>{}} color='warning'></Button>
          <Button label='Info' onClick={()=>{}} color='info'></Button>
        
        </div>

    </React.Fragment>
  )
}
