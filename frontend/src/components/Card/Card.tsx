import React, { PropsWithChildren } from 'react';
import './Card.scss';

export default function Card({title, css, children} : {title: string, css:string, children: any}) {
  return (
    <React.Fragment>
        <div className={"card card-background shadow-sm " + css }>
            {title && (
              <div className="card-header p-4">
                <h3>{title}</h3>
              </div>
            )}
            <div className="card-body">
              {children}
            </div>
        </div>
    </React.Fragment>
  )
}
