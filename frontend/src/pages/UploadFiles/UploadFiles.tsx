import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import Card from "../../components/Card/Card";
import ArchistockApiService from "../../services/ArchistockApiService";
import Input from "../../components/Input/Input";

const archistockApiService = new ArchistockApiService();

const UploadFiles = () => {
    const [storage, setStorage] = useState<any>(null);
    const [selectedStorage, setSelectedStorage] = useState<any>(null);
    const [progress, setProgress] = useState<number>(0);  // Nouvel état pour la progression

    useEffect(() => {
        archistockApiService.getUserStorage().then((res) => {
            setStorage(res);
            console.log(res);
        });
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (!selectedStorage) {
            console.error("Storage not selected.");
            return;
        }
    
        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('files', file);
        });
        formData.append('userSubscriptionId', selectedStorage.toString());

        archistockApiService.uploadFileWithProgress(formData, setProgress).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.error("Failed to upload file:", err);
        });
    }, [selectedStorage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <Fragment>
            {storage && (
                <div className='m-5'>
                    <h1 className='text-3xl font-black mb-3'>Extending Storage</h1>
                    <Card css="mt-10">
                        <div className="flex flex-col justify-center w-full gap-5">
                            <Input type="select" label="Select Storage" onChange={(e: any) => setSelectedStorage(e.target.value)}>
                                <option>Select Storage</option>
                                {storage && storage.map((item: any, index: number) => (
                                    <option key={index} value={item.id}>{item.name} - {(parseInt(item.totalSize) / 1000).toFixed(2)} / {item.subscription.size.toFixed(2)} Go</option>
                                ))}
                            </Input>

                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-700 dark:hover:bg-gray-100 dark:bg-gray-50 hover:bg-gray-200 dark:border-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-200">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6" {...getRootProps()}>
                                    <svg className="w-8 h-8 mb-4 text-gray-400 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-400 dark:text-gray-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-700">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" {...getInputProps()} disabled={!selectedStorage} />
                            </label>

                            {/* Affichage de la barre de progression */}
                            {progress > 0 && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </Fragment>
    )
}

export default UploadFiles;