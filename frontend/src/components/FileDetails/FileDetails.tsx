import { Fragment, useState, useEffect, useRef } from "react";
import FileIcon from "../FileIcon/FileIcon";
import ArchistockApiService from "../../services/ArchistockApiService";
import { toast } from "react-toastify";

const archistockApiService = new ArchistockApiService();

const FileDetails = ({ file, onClick, onDelete, onViewProperties, onUpdate }: any) => {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [editFile, setEditFile] = useState(false);
    const [fileName, setFileName] = useState(file.name);
    const menuRef = useRef(null);
    

    const handleRightClick = (e: any) => {
        e.preventDefault();
        setShowMenu(true);
        setMenuPosition({ x: 50, y: 40 });
    };

    const handleClickOutside = (e: any) => {
        if (menuRef.current && !(menuRef.current as HTMLElement).contains(e.target)) {
            setShowMenu(false);
        }
    };

    const handleUpdateFile = () => {
        setEditFile(false);
        archistockApiService.updateFile(file.id, { name: fileName }).then((res) => {
            console.log(res.status);
            if(res.status === 201) {
                toast.success("File updated successfully");
                onUpdate();
            } else {
                toast.error("An error occured while updating file. Please retry.");
            }
        });
    }

    useEffect(() => {
        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    return (
        <div
            className="relative flex flex-col items-center hover:bg-slate-200 p-2 rounded cursor-pointer min-w-30"
            onClick={() => editFile ? null : onClick(file)}
            onContextMenu={handleRightClick}
        >
            <FileIcon type={file.format} />
            {editFile ? (
                <input
                    type="text"
                    className="text-md w-16 bg-slate-200 rounded"
                    value={fileName}
                    onChange={(e) => {console.log(e.target.value); setFileName(e.target.value)}}
                    onBlur={() => handleUpdateFile()}
                />
            ) : (
                <p className="text-md max-w-20 word-wrap">{fileName}.{file.format}</p>
            )}

            {showMenu && (
                <div
                    ref={menuRef}
                    className="absolute rounded z-10"
                    style={{ top: menuPosition.y, left: menuPosition.x }}
                >
                    <ul className="menu bg-base-100 rounded-box text-white">
                        <li>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(false);
                                    onViewProperties(file);  // Par exemple pour afficher les propriétés
                                }}
                            >
                                <p className="text-sm">Propriétés</p>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditFile(true);
                                    setShowMenu(false);
                                }}
                            >
                                <p className="text-sm">Renommer</p>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(file);
                                    setShowMenu(false);
                                }}
                            >
                                <p className="text-sm">Supprimer</p>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FileDetails;
