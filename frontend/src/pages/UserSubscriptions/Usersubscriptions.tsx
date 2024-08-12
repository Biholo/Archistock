import { Fragment, useEffect, useState } from "react";
import ArchistockApiService from "../../services/ArchistockApiService";
import StatsCard from "../../components/StatsCard/StatsCard";
import Card from "../../components/Card/Card";
import FileDetails from "../../components/FileDetails/FileDetails";
import HardDriveStorage from "../../components/HardDrive/HardDrive";
import FolderIcon from "../../components/FolderIcon/FolderIcon";
import PreviewFileModal from "../../components/Modals/PreviewFileModal";

const Usersubscriptions = () => {
    // Services
    const archistockApiService = new ArchistockApiService();

    // Variables d'état
    const [storages, setStorages] = useState<any>([]);
    const [files, setFiles] = useState<any>([]);

    // Gestion navigation 
    const [breadcrumb, setBreadcrumb] = useState<string[]>(['Subscriptions']);

    // Gestion des dossiers et fichiers
    const [displayStorage, setDisplayStorage] = useState<boolean>(true);
    const [parentId, setParentId] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<any>(null);

    // Récupération des données
    useEffect(() => {
        archistockApiService.getUserStorageWithFiles().then((res) => {
            setStorages(res);
            setFiles(res.flatMap((storage: any) => storage.files)); // Collect all files from storages
            console.log(res);
        });
    }, []);

    const getAllFilesSize = (files: any) => {
        let totalSize = 0;
        files.forEach((file: any) => {
            totalSize += parseFloat(file.size) / 1000;
        });
        return totalSize.toFixed(2);
    }

    const getTotalStorageSize = (storages: any) => {
        let totalSize = 0;
        storages.forEach((storage: any) => {
            totalSize += parseFloat(storage.subscription.size);
        });
        return totalSize;
    }

    const onStorageClick = (storage: any) => {
        setBreadcrumb([...breadcrumb, storage.name]);
        setDisplayStorage(false);
        setParentId(null); // Reset parentId to start from the root of the selected storage
    }

    const onFolderClick = (folder: any) => {
        setBreadcrumb([...breadcrumb, folder.name]);
        setParentId(folder.id);
    }

    const onBreadcrumbClick = (index: number) => {
        const newBreadcrumb = breadcrumb.slice(0, index + 1);
        setBreadcrumb(newBreadcrumb);
    
        if (index === 0) {
            // If the user clicks on the first breadcrumb, return to the storage view
            setParentId(null);
            setDisplayStorage(true);
        } else {
            // Find the corresponding folder based on breadcrumb trail
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
                        <div className="breadcrumbs text-sm">
                            <ul>
                                {breadcrumb.map((item, index) => (
                                   // if last, font-bold, onclikc onBreadcrumbClick
                                    <li key={index} className={"cursor-pointer " + (index === breadcrumb.length - 1 ? 'font-bold' : '')} onClick={() => onBreadcrumbClick(index)}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        {displayStorage ? (
                            <div className="flex flex-row mt-5">
                                {storages.map((storage: any, index: number) => (
                                    <div key={index} className="mr-5">
                                        <HardDriveStorage storage={storage} onStorageClick={onStorageClick} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-row flex-wrap gap-5 mt-5">
                                <FolderIcon folder={{name: '...', id: null, parentId: null, files: []}} onFolderClick={() => onBreadcrumbClick(breadcrumb.length - 2)} />
                                {storages.flatMap((storage: any) => 
                                    storage.folders.map((folder: any, index: number) => (
                                        folder.parentId === parentId && (
                                            <Fragment key={index}>
                                                <FolderIcon folder={folder} onFolderClick={onFolderClick} />
                                                {folder.files.map((file: any, index: number) => (
                                                    <FileDetails key={index} file={file} onClick={(e:any) => setSelectedFile(e)} />
                                                ))}
                                            </Fragment>
                                        )
                                    ))
                                )}
                               
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
