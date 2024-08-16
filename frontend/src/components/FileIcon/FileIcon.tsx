import { File, FilePng, FileJpg, FileTxt, FilePdf, FileZip, FileDoc, FileXls, FileSvg, MicrosoftWordLogo } from '@phosphor-icons/react';
import React, { Fragment, useEffect } from 'react';


const FileIcon = ({ type }: { type: string }) => {

    useEffect(() => {
        console.log(type);
    }, []);
    return (
        <Fragment>
            {
                type === 'png' ? <FilePng size={40} className='text-sky-600'  weight="fill"/> :
                type === 'jpg' ? <FileJpg size={40} className="text-sky-600" weight="fill"/> :
                type === 'txt' ? <FileTxt size={40} className="text-slate-400" weight="fill"/> :
                type === 'pdf' ? <FilePdf size={40} className="text-red-600" weight="fill"/> :
                type === 'zip' ? <FileZip size={40} className="text-violet-600" weight="fill"/> :
                type === 'doc' ? <FileDoc size={40} className="text-cyan-500" weight="fill"/> :
                type === 'docx' ? <MicrosoftWordLogo size={40} className="text-cyan-500" weight="fill"/> :
                type === 'xls' || type === 'xls' ? <FileXls size={40} className="text-lime-500" weight="fill"/> :
                type === 'svg' ? <FileSvg size={40} className="text-amber-200" weight="fill"/> :
                <File size={40} />
            }
        </Fragment>
    )
}

export default FileIcon;