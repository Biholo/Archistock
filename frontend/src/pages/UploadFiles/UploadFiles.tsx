import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import Card from "../../components/Card/Card";
import ArchistockApiService from "../../services/ArchistockApiService";
import Input from "../../components/Input/Input";
import { toast } from "react-toastify";

const archistockApiService = new ArchistockApiService();

const UploadFiles = () => {
    const [storage, setStorage] = useState<any>(null);
    const [selectedStorage, setSelectedStorage] = useState<any>(null);
    const [progress, setProgress] = useState<number>(0);
    const [progressColor, setProgressColor] = useState<string>("");
    const [files, setFiles] = useState<any>([]);
    const [successfulFiles, setSuccessfulFiles] = useState<string[]>([]);
    const [failedFiles, setFailedFiles] = useState<{name: string, reason: string}[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        archistockApiService.getUserStorage().then((res) => {
            setStorage(res);
            console.log(res);
        });
    }, []);

    useEffect(() => {
        if (progress < 50) {
            setProgressColor("bg-red-500");
        } else if (progress < 75) {
            setProgressColor("bg-yellow-500");
        } else {
            setProgressColor("bg-green-500");
        }
    }, [progress]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (!selectedStorage) {
            toast.error("Veuillez sélectionner un espace de stockage.");
            return;
        }

        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('files', file);
            setFiles((prevFiles:any) => [...prevFiles, file]);
        });
        formData.append('userSubscriptionId', selectedStorage.toString());

        archistockApiService.uploadFileWithProgress(formData, setProgress)
            .then((res) => {
                console.log(res);
                setError(null);

                // Mise à jour des fichiers réussis et échoués avec raisons
                const saved = res.savedFiles || [];
                const unsaved = res.unsavedFiles || [];
                setSuccessfulFiles(saved);
                setFailedFiles(unsaved.map((file: string) => {
                    const [name, reason] = file.split(": ");
                    return { name, reason };
                }));

                if (unsaved.length > 0) {
                    setError("Un ou plusieurs fichiers ont été rejetés. Vérifiez les raisons ci-dessous.");
                    toast.error("Erreur lors de l'upload des fichiers.");
                }
            })
            .catch((err) => {
                console.error("Failed to upload file:", err);
                setProgressColor("bg-red-500");
                setError("Erreur lors de l'upload des fichiers.");
                toast.error("Erreur lors de l'upload des fichiers.");
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
                                <option value="">Select Storage</option>
                                {storage.map((item: any, index: number) => (
                                    <option key={index} value={item.id}>{item.name} - {(parseInt(item.totalSize) / 1000).toFixed(2)} / {item.subscription.size.toFixed(2)} Go</option>
                                ))}
                            </Input>

                            <div {...getRootProps()} className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-700 dark:hover:bg-gray-100 dark:bg-gray-50 hover:bg-gray-200 dark:border-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-200">
                                <input {...getInputProps()} id="dropzone-file" className="hidden" />
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-400 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-400 dark:text-gray-700"><span className="font-semibold">Cliquez pour envoyer des fichiers</span> ou glissez les ici</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-700">50 fichiers maximum. 2Go max par fichier.</p>
                                </div>
                            </div>

                            {progress > 0 && (
                                <Fragment>
                                    <div className="flex flex-row gap-3">
                                        <div className="w-full">
                                            <div className="w-full h-3 bg-gray-200 rounded-lg">
                                                <div className={`h-full ${progressColor} rounded-lg`} style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                {error ? (
                                                    <p className="font-semibold text-red-500">{error}</p>
                                                ) : (
                                                    <p className="font-semibold">{progress === 100 ? "Files uploaded!" : "Uploading files..."}</p>
                                                )}
                                                {successfulFiles.length > 0 && (
                                                    <div>
                                                        <h2 className="font-semibold text-green-500">Fichiers téléchargés avec succès:</h2>
                                                        {successfulFiles.map((file: string, index: number) => (
                                                            <p key={index}>{file}</p>
                                                        ))}
                                                    </div>
                                                )}
                                                {failedFiles.length > 0 && (
                                                    <div>
                                                        <h2 className="font-semibold text-red-500">Fichiers échoués:</h2>
                                                        {failedFiles.map(({name, reason}, index: number) => (
                                                            <div key={index}>
                                                                <p>{name}</p>
                                                                <p className="text-xs text-red-400">Raison: {reason}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </Fragment>
    );
}

export default UploadFiles;
