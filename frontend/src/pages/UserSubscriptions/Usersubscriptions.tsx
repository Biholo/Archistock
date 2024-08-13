import { Fragment, useEffect, useState } from "react";
import ArchistockApiService from "../../services/ArchistockApiService";
import StatsCard from "../../components/StatsCard/StatsCard";
import Card from "../../components/Card/Card";
import FileDetails from "../../components/FileDetails/FileDetails";
import HardDriveStorage from "../../components/HardDrive/HardDrive";
import FolderIcon from "../../components/FolderIcon/FolderIcon";
import PreviewFileModal from "../../components/Modals/PreviewFileModal";
import Button from "../../components/Button/Button";
import { FolderSimplePlus } from "@phosphor-icons/react";
import FolderCreate from "../../components/FolderIcon/FolderCreate";
import { toast } from "react-toastify";

const archistockApiService = new ArchistockApiService();

const Usersubscriptions = () => {
    // Services

    // Variables d'état
    const [storages, setStorages] = useState<any>([]);
    const [files, setFiles] = useState<any>([]);
    const [updated, setUpdated] = useState<boolean>(false);
    const [createFolder, setCreateFolder] = useState<boolean>(false);

    // Gestion navigation 
    const [breadcrumb, setBreadcrumb] = useState<string[]>(['Subscriptions']);

    // Gestion des dossiers et fichiers
    const [selectedStorage, setSelectedStorage] = useState<any>(null);
    const [displayStorage, setDisplayStorage] = useState<boolean>(true);
    const [parentId, setParentId] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<any>(null);

    // Récupération des données 
    useEffect(() => {
        archistockApiService.getUserStorageWithFiles().then((res) => {
            setStorages(res);
            setFiles(res.flatMap((storage: any) => storage.files));
            if (selectedStorage) {
                setSelectedStorage(res.find((storage: any) => storage.id === selectedStorage.id));
            }
        });
    }, [updated]);

    // Récupération de la taille totale des fichiers
    const getAllFilesSize = (files: any) => {
        let totalSize = 0;
        files.forEach((file: any) => {
            totalSize += parseFloat(file.size) / 1000;
        });
        return totalSize.toFixed(2);
    }

    // Récupération de la taille totale du stockage
    const getTotalStorageSize = (storages: any) => {
        let totalSize = 0;
        storages.forEach((storage: any) => {
            totalSize += parseFloat(storage.subscription.size);
        });
        return totalSize;
    }

    // Gestion des événements

    // Clic sur un stockage, affiche les dossiers et fichiers
    const onStorageClick = (storage: any) => {
        setBreadcrumb([...breadcrumb, storage.name]);
        setSelectedStorage(storage);
        setDisplayStorage(false);
        setParentId(null); // Reset parentId to start from the root of the selected storage
    }

    // Clic sur un dossier, affiche les sous-dossiers et fichiers
    const onFolderClick = (folder: any) => {
        setBreadcrumb([...breadcrumb, folder.name]);
        setParentId(folder.id);
    }

    // Clic sur un élément du breadcrumb, affiche les éléments correspondants
    const onBreadcrumbClick = (index: number) => {
        const newBreadcrumb = breadcrumb.slice(0, index + 1);
        setBreadcrumb(newBreadcrumb);
    
        if (index === 0) {
            setParentId(null);
            setDisplayStorage(true);
        } else {
            let currentParentId:any = null;
            for (let i = 1; i <= index; i++) {
                const folder = storages.flatMap((storage: any) => storage.folders)
                    .find((folder: any) => folder.name === newBreadcrumb[i] && folder.parentId === currentParentId);
                currentParentId = folder ? folder.id : null;
            }
            setParentId(currentParentId);
            setDisplayStorage(false);
        }
    }

    // Création d'un dossier puis mise à jour de la liste des dossiers
    const handleCreateFolder = (folderName: string) => {
        archistockApiService.createFolder({name: folderName, parentId: parentId, userSubscriptionId: selectedStorage.id}).then((res) => {
            if (res.status === 201) {
                toast.success("Folder created successfully");
                setCreateFolder(false);
                setUpdated(!updated);
            } else {
                toast.error("An error occured while creating folder. Please retry.");
            }
        });
    }

    // Suppression d'un dossier puis mise à jour de la liste des dossiers
    const onDeleteFolder = (folder: any) => {
        archistockApiService.deleteFolder(folder.id).then((res) => {
            if (res.status === 201) {
                toast.success("Folder deleted successfully");
                setUpdated(!updated);
            } else {
                toast.error("An error occured while deleting folder. Please retry.");
            }
        });
    }
    
    return (
        <Fragment>
            {storages.length > 0 && (
                <div className='m-5'>
                    <h1 className='text-xl font-bold mb-3'>Your storage</h1>
                    <div className="flex flex-wrap flex-row justify-between mt-5">
                        <StatsCard name="Storage" stat={storages.length} color="#FFA800" />
                        <StatsCard name="Files" stat={files.length} color="#E757B6" />
                        <StatsCard name="Go" stat={getAllFilesSize(files)} color="#24B34C" />
                        <StatsCard name="Total Go" stat={getTotalStorageSize(storages)} color='#7C57E7' />
                    </div>

                    <Card css="mt-10">
                        <div className="flex flex-row justify-between">
                            <div className="breadcrumbs text-sm">
                                <ul>
                                    {breadcrumb.map((item, index) => (
                                        <li key={index} className={"cursor-pointer " + (index === breadcrumb.length - 1 ? 'font-bold' : '')} onClick={() => onBreadcrumbClick(index)}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            {!displayStorage &&  (
                                <Button color="primary" onClick={() => { setCreateFolder(true) }} css="btn-sm">
                                    <FolderSimplePlus size={16} />
                                </Button>
                            )}
                        </div>
                        {displayStorage ? (
                            <div className="flex flex-row mt-5">
                                {storages.map((storage: any, index: number) => (
                                    <div key={index} className="mr-5">
                                        <HardDriveStorage storage={storage} onStorageClick={onStorageClick} onUpdate={() => { setUpdated(!updated) }}  />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-row flex-wrap gap-5 mt-5">
                                <FolderIcon folder={{name: '...', id: null, parentId: null, files: []}} onFolderClick={() => onBreadcrumbClick(breadcrumb.length - 2)} />
                                    {selectedStorage.folders.map((folder: any, index: number) => (
                                        folder.parentId === parentId && (
                                            <Fragment key={index}>
                                                <FolderIcon folder={folder} onFolderClick={onFolderClick} onUpdate={() => { setUpdated(!updated) }}  onDelete={(e:any) => { onDeleteFolder(e) }}/>
                                            </Fragment>
                                        )
                                    ))}
                                    {createFolder && (
                                            <FolderCreate onCreate={(e:any) => { handleCreateFolder(e) }} />
                                        )}
                                    {selectedStorage.files.map((file: any, index: number) => (
                                        file.parentId === parentId && (
                                            <Fragment key={index}>
                                                <FileDetails key={index} file={file} onClick={(e:any) => setSelectedFile(e)} onUpdate={() => { setUpdated(!updated) }} />
                                            </Fragment>
                                        )
                                    ))}
                            </div>
                        )}
                    </Card>
                </div>
            )}
            {selectedFile && (
                <PreviewFileModal show={selectedFile} file={selectedFile} onClose={() => setSelectedFile(null)} />
            )}
        </Fragment>
    );
}

export default Usersubscriptions;
