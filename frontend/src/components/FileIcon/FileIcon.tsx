import { File, FilePng, FileJpg, FileTxt, FilePdf, FileZip, FileDoc, FileXls, FileSvg, MicrosoftWordLogo } from '@phosphor-icons/react';
import React, { Fragment, useEffect } from 'react';


const FileIcon = ({ type }: { type: string }) => {

    useEffect(() => {
        console.log(type);
    }, []);
    return (
        <Fragment>
            {
                type === 'png' ? <FilePng size={32} color='primary' /> :
                type === 'jpg' ? <FileJpg size={32} color='primary' /> :
                type === 'txt' ? <FileTxt size={32} color='primary' /> :
                type === 'pdf' ? <FilePdf size={32} color='primary' /> :
                type === 'zip' ? <FileZip size={32} color='primary' /> :
                type === 'doc' ? <FileDoc size={32} color='primary' /> :
                type === 'docx' ? <MicrosoftWordLogo size={32} color='primary' /> :
                type === 'xls' || type === 'xls' ? <FileXls size={32} color='primary' /> :
                type === 'svg' ? <FileSvg size={32} color='primary' /> :
                <File size={32} />
            }
        </Fragment>
    )
}

export default FileIcon;