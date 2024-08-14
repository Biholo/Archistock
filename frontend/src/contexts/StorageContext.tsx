import React, { createContext, useContext, useState, useEffect } from 'react';
import ArchistockApiService from '../services/ArchistockApiService';

// Création du StorageContext
const StorageContext = createContext<any>(null);

export const StorageProvider = ({ children }: any) => {
    const archistockApiService = new ArchistockApiService();

    const [storages, setStorages] = useState<any>([]);
    const [files, setFiles] = useState<any>([]);
    const [breadcrumb, setBreadcrumb] = useState<string[]>(['Subscriptions']);
    const [displayStorage, setDisplayStorage] = useState<boolean>(true);
    const [parentId, setParentId] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<any>(null);

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

    return (
        <StorageContext.Provider value={{
            storages,
            files,
            breadcrumb,
            displayStorage,
            parentId,
            selectedFile,
            setSelectedFile,
            getAllFilesSize,
            getTotalStorageSize,
            onStorageClick,
            onFolderClick,
            onBreadcrumbClick
        }}>
            {children}
        </StorageContext.Provider>
    );
};

// Hook pour utiliser le StorageContext
export const useStorage = () => {
    return useContext(StorageContext);
}
