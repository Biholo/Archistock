import React from 'react';
import './ProgressBar.scss';

interface ProgressBarProps {
    value: number;
    maxValue: number;
    css: string;
    label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, maxValue, css, label }) => {
    const progress = (value / maxValue) * 100;

    return (
        <div className={"progress-bar w-full rounded bg-slate-300 shadow " + css}>
            <div className="progress-bar__fill bg-emerald-400" style={{ width: `${progress}%` }}></div>
            <span className="progress-bar__text">{label}</span>

        </div>
    );
};

export default ProgressBar;
