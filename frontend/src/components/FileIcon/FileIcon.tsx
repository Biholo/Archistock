import { File, FilePng, FileJpg, FileTxt, FilePdf, FileZip, Gear, FileDoc, FileImage, FileXls, FileSvg, MicrosoftWordLogo, Gif, FileVideo, FileIni, FileMd, FileSql, FileJs, FileJsx, FileTs, FileTsx, FileHtml, FileCss, FileCSharp, FilePy, FileVue, FileText } from '@phosphor-icons/react';
import React, { Fragment, useEffect } from 'react';


const FileIcon = ({ type }: { type: string }) => {

    useEffect(() => {
        console.log(type);
    }, []);
    return (
        <Fragment>
            {
                type === 'png' ? <FilePng size={40} className='text-sky-600'  weight="fill"/> :
                type === 'jpg' || type === "jpeg" ? <FileJpg size={40} className="text-sky-600" weight="fill"/> :
                type === 'webp' ? <FileImage size={40} className="text-sky-600" weight="fill"/> :
                type === 'txt' ? <FileTxt size={40} className="text-slate-400" weight="fill"/> :
                type === 'pdf' ? <FilePdf size={40} className="text-red-600" weight="fill"/> :
                type === 'zip' || type === "x-zip" || type === "x-zip-compressed" ? <FileZip size={40} className="text-violet-500" weight="fill"/> :
                type === 'doc' ? <FileDoc size={40} className="text-cyan-500" weight="fill"/> :
                type === 'docx' ? <MicrosoftWordLogo size={40} className="text-cyan-500" weight="fill"/> :
                type === 'xlsx' || type === 'xls' ? <FileXls size={40} className="text-green-500" weight="fill"/> :
                type === 'svg' ? <FileSvg size={40} className="text-amber-200" weight="fill"/> :
                type === "gif" ? <Gif size={40} className="text-blue-400" weight="fill"/> :
                type === "mp4" ? <FileVideo size={40} className="text-red-400" weight="fill"/> :
                type === "sql" ? <FileSql size={40} className="text-blue-400" weight="fill"/> :
                type === "ini" ? <FileIni size={40} className="text-blue-400" weight="fill"/> :
                type === "md" ? <FileMd size={40} className="text-blue-400" weight="fill"/> :
                type === "js" ? <FileJs size={40} className="text-yellow-400" weight="fill"/> :
                type === "jsx" ? <FileJsx size={40} className="text-yellow-400" weight="fill"/> :
                type === "ts" ? <FileTs size={40} className="text-blue-400" weight="fill"/> :
                type === "tsx" ? <FileTsx size={40} className="text-blue-400" weight="fill"/> :
                type === "html" ? <FileHtml size={40} className="text-yellow-400" weight="fill"/> :
                type === "css" ? <FileCss size={40} className="text-blue-400" weight="fill"/> :
                type === "cs" ? <FileCSharp size={40} className="text-blue-400" weight="fill"/> :
                type === "py" ? <FilePy size={40} className="text-blue-400" weight="fill"/> :
                type === "vue" ? <FileVue size={40} className="text-green-400" weight="fill"/> :
                type === "json" || type === "yaml" || type === "yml" ? <FileText size={40} className="text-blue-400" weight="fill"/> :
                type === "exe" || type === "msi" ? <Gear size={40} className="text-blue-400" weight="fill"/> :
                <File size={40} />
            }
        </Fragment>
    )
}

export default FileIcon;