import React from 'react';
import Card from '../../components/Card/Card';
import StatsCard from '../../components/StatsCard/StatsCard';


export default function ComponentsTest() {
  return (
    <React.Fragment>
        <div className='min-h-dvh'>
          <h2 className='font-bold'>Card:</h2>
          <Card title='test' css="f">
            <p>Test</p>
          </Card>
          
          <h2 className='pt-5'>Stats Card:</h2>
          <div className="flex flex-row justify-between">
            <StatsCard stat={32} name="State" color="#FFA800"></StatsCard>
            <StatsCard stat={32} name="Name"></StatsCard>
            <StatsCard stat={32} name="Name"></StatsCard>
            <StatsCard stat={32} name="Name"></StatsCard>
          </div>
        </div>
    </React.Fragment>
  )
}
