import { useState, useEffect, useRef } from "react";
import { Folder } from "@phosphor-icons/react";

const FolderCreate = ({ onCreate }: any) => {
    const [folderName, setFolderName] = useState("");

    const handleCreateFolder = (e:any) => {
        e.preventDefault();
        onCreate(folderName);
        setFolderName("");
    }

    return (
        <div
            className="relative flex flex-col items-center hover:bg-slate-200 p-2 rounded cursor-pointer w-20"
        >
            <Folder size={32} className="text-amber-400" weight="fill" />
           
            <form onSubmit={handleCreateFolder}>
                <input
                    type="text"
                    className="text-sm font-semibold text-gray-600 bg-slate-200 rounded w-20"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onBlur={handleCreateFolder}
                />
            </form>
               
        </div>
    );
};

export default FolderCreate;
