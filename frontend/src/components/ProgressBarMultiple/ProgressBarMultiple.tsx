import React from 'react';
import './ProgressBarMutiple.scss';

interface ProgressBarProps {
    values: number[];   // Liste de valeurs
    maxValue: number;
    css: string;
    labels: string[];   // Liste de labels
    colors: string[];   // Liste de couleurs pour chaque segment
}

const ProgressBarMultiple: React.FC<ProgressBarProps> = ({ values, maxValue, css, labels, colors }) => {
    const totalValue = values.reduce((acc, value) => acc + value, 0);
    const adjustedMaxValue = maxValue || totalValue; // Utilisez maxValue si défini, sinon utilisez totalValue

    return (
        <div className={"progress-bar w-full rounded bg-slate-300 shadow " + css} style={{ display: 'flex' }}>
            {values.map((value, index) => {
                const progress = (value / adjustedMaxValue) * 100;

                return (
                    <div 
                        key={index} 
                        className="progress-bar__fill relative inline-block h-full text-center"
                        style={{ width: `${progress}%`, backgroundColor: colors[index], position: 'relative' }}
                    >
                        <span 
                            className="progress-bar__label"
                            style={{ 
                                position: 'absolute', 
                                left: '50%', 
                                top: '50%', 
                                transform: 'translate(-50%, -50%)', 
                                color: '#000', 
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {labels[index]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default ProgressBarMultiple;
