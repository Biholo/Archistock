import { HardDrive } from "@phosphor-icons/react";
import { Fragment, useState, useEffect, useRef } from "react";
import ArchistockApiService from "../../services/ArchistockApiService";
import { toast } from "react-toastify";

const archistockApiService = new ArchistockApiService();

const HardDriveStorage = ({ storage, onStorageClick, onUpdate}: { storage: any, onStorageClick: any, onUpdate: any}): any => {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [editStorage, setEditStorage] = useState(false);
    const [storageName, setStorageName] = useState(storage.name);
    const menuRef = useRef(null);

    const handleRightClick = (e: any) => {
        e.preventDefault();
        setShowMenu(true);
        setMenuPosition({ x: e.clientX - 300, y: e.clientY - 250 });
    };

    const handleClickOutside = (e: any) => {
        if (menuRef.current && !(menuRef.current as HTMLElement).contains(e.target)) {
            setShowMenu(false);
        }
    };

    const handleUpdateStorage = () => {
        setEditStorage(false);
        archistockApiService.updateStorage(storage.id, { name: storageName }).then((res) => {
            if(res.status === 201) {
                toast.success("Storage updated successfully");
                onUpdate();
            } else {
                toast.error("An error occured while updating storage. Please retry.");
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

    const getFilesSize = () => {
        let totalSize = 0;
        storage.files.forEach((file: any) => {
            totalSize += parseFloat(file.size) / 1000;
        });
        return totalSize.toFixed(2);
    }

    const getStorageColor = () => {
        let totalSize = 0;
        storage.files.forEach((file: any) => {
            totalSize += parseFloat(file.size) / 1000;
        });
        let percentage = (totalSize / storage.subscription.size) * 100;

        if (percentage < 50) {
            return 'progress-primary';
        } else if (percentage < 80) {
            return 'progress-warning';
        } else {
            return 'progress-error ';
        }
    }

    return (
        <Fragment>
            <div
                className="relative flex flex-row items-center hover:bg-slate-200 p-2 rounded cursor-pointer"
                onClick={() => editStorage ? null : onStorageClick(storage)}
                onContextMenu={handleRightClick}
            >
                <HardDrive size={40} />
                <div className="ml-2">
                    {editStorage ? (
                        <>
                            <input
                                type="text"
                                className="text-sm font-semibold text-gray-600 bg-slate-200 rounded"
                                value={storageName}
                                onChange={(e) => setStorageName(e.target.value)}
                                onBlur={handleUpdateStorage}
                            />
                            <br />
                        </>
                    ) : (
                        <p className="text-md font-semibold text-gray-600">{storageName}</p>
                    )}
                    <progress className={`progress ${getStorageColor()} w-56 h-3.5`} value={getFilesSize()} max={storage.subscription.size / 1000}></progress>
                    <p className="text-sm text-gray-400">{getFilesSize()} Go / {(storage.subscription.size / 1000).toFixed(2)} Go</p>
                </div>
            </div>

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
                                    setEditStorage(true);
                                    setShowMenu(false);
                                }}
                            >
                                <p className="text-sm">Renommer</p>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </Fragment>
    );
}

export default HardDriveStorage;
