import React, { useEffect, useState, Fragment } from 'react';


const PreviewFileModal = ({ show, file, onClose } : any) => {

    useEffect(() => {
        // if echap key is pressed, close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        });
    }, []);

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
                                    File Preview
                                </h3>
                                {file.format === 'jpg' || file.format === 'png' || file.format === 'jpeg' || file.format === 'gif' || file.format === 'svg' ? (
                                    <img src={`http://localhost:8000/files/${file.name}.${file.format}`} alt={file.name} className="w-full h-auto" />
                                ) : file.format === 'mp4' || file.format === 'avi' || file.format === 'mov' || file.format === 'wmv' ? (
                                    <video src={`http://localhost:8000/files/${file.name}.${file.format}`} className="w-full h-auto" controls></video>
                                ) : file.format === 'mp3' || file.format === 'wav' || file.format === 'flac' || file.format === 'aac' ? (
                                    <audio src={`http://localhost:8000/files/${file.name}.${file.format}`} controls></audio>
                                ) : file.format === 'pdf' ? (
                                    <embed src={`http://localhost:8000/files/${file.name}.${file.format}`} type="application/pdf" width="100%" height="600px" />
                                ) : (
                                    <p>File format not supported.</p>
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

export default PreviewFileModal;
