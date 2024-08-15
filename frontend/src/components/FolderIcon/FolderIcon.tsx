import { useState, useEffect, useRef } from "react";
import { Folder } from "@phosphor-icons/react";
import ArchistockApiService from "../../services/ArchistockApiService";
import { toast } from "react-toastify";

const archistockApiService = new ArchistockApiService();

const FolderDetails = ({ folder, onFolderClick, onDelete, onViewProperties, onUpdate }: any) => {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [editFolder, setEditFolder] = useState(false);
    const [folderName, setFolderName] = useState(folder.name);
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

    const handleUpdateFolder = () => {
        setEditFolder(false);
        archistockApiService.updateFolder(folder.id, { name: folderName }).then((res) => {
            if(res.status === 201) {
                toast.success("Folder updated successfully");
                onUpdate();
            } else {
                toast.error("An error occured while updating folder. Please retry.");
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
            className="relative flex flex-col items-center hover:bg-slate-200 p-2 rounded cursor-pointer min-w-20"
            onClick={() => editFolder ? null : onFolderClick(folder)}
            onContextMenu={handleRightClick}
        >
            <Folder size={40} className="text-amber-400" weight="fill" />
            {editFolder ? (
                <input
                    type="text"
                    className="text-md w-20 bg-slate-200 rounded"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onBlur={handleUpdateFolder}
                />
            ) : (
                <p className="text-md truncate">{folderName}</p>
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
                                    onViewProperties(folder);
                                }}
                            >
                                <p className="text-sm">Propriétés</p>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditFolder(true);
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
                                    onDelete(folder);
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

export default FolderDetails;
