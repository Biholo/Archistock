import React, { useEffect, useState, Fragment } from 'react';


const PreviewFolderModal = ({ show, folder, onClose } : any) => {

    useEffect(() => {
        // if echap key is pressed, close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        });
    }, []);

    useEffect(() => {
        console.log(folder);
    }, [folder]);

    const getFolderSize = (folder: any) => {
        let size = 0;
        folder.files.forEach((file: any) => {
            size += parseFloat(file.size) / 1000;
        });
        return size.toFixed(2);
    }

    // Return DD/MM/YYYY, HH:MM:SS
    const refactorDate = (date: string) => {
        const dateObj = new Date(date);
        return `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}, ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;
    }



    return (
        <Fragment>
            <div className={`fixed z-10 inset-0 overflow-y-auto ${show ? "block" : "hidden"}`}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex flex-col">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    Propriétés du dossier
                                </h3>
                                {folder && (
                                    // using tailwind col 
                                    <div className='flex flex-col gap-5 mt-5'>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <p className='text-sm text-gray-600'>Nom dossier:</p>
                                            <p className='text-sm font-semibold ml-2'>{folder.name}</p>
                                        </div>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <p className='text-sm text-gray-600'>Taille dossier:</p>
                                            <p className='text-sm font-semibold ml-2'>{getFolderSize(folder)} Go</p>
                                        </div>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <p className='text-sm text-gray-600'>Fichiers:</p>
                                            <p className='text-sm font-semibold ml-2'>{folder.files.length}</p>
                                        </div>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <p className='text-sm text-gray-600'>Créer:</p>
                                            <p className='text-sm font-semibold ml-2'>{refactorDate(folder.createdAt)}</p>
                                        </div>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <p className='text-sm text-gray-600'>Mis à jour:</p>
                                            <p className='text-sm font-semibold ml-2'>{refactorDate(folder.updatedAt)}</p>
                                        </div>
                                    </div>

                                )}
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default PreviewFolderModal;
