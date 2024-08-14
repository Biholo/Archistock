import React, { Fragment, useCallback } from "react";
import {useDropzone} from 'react-dropzone'
import Card from "../../components/Card/Card";

const UploadFiles = () => {

    const onDrop = useCallback((acceptedFiles:any) => {
        console.log(acceptedFiles)
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


    
    return (
        <Fragment>
             <div className='m-5'>
                <h1 className='text-xl font-bold mb-3'>Extending Storage</h1>
                <Card css="mt-10">
                    
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-700 dark:hover:bg-gray-100 dark:bg-gray-50 hover:bg-gray-800 dark:border-gray-500 dark:hover:border-gray-600 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6" {...getRootProps()}>
                                <svg className="w-8 h-8 mb-4 text-gray-400 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-400 dark:text-gray-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-400 dark:text-gray-700">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" {...getInputProps()}/>
                        </label>
                    </div> 

                </Card>
            </div>
           
        </Fragment>
    )
}

export default UploadFiles;