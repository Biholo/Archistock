import { Fragment, useEffect, useState } from "react";
import ArchistockApiService from "../../services/ArchistockApiService";
import StatsCard from "../../components/StatsCard/StatsCard";
import Card from "../../components/Card/Card";

const Usersubscriptions = () => {
    const archistockApiService = new ArchistockApiService();

    const [storages, setStorages] = useState<any>([]);
    const [files, setFiles] = useState<any>([]);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        archistockApiService.getUserStorageWithFiles().then((res) => {
            console.log(res);
            setStorages(res);
            setFiles(res.flatMap((storage: any) => storage.files)); // Collect all files from storages
        });
    }, []);

    const getAllFilesSize = (files: any) => {
        let totalSize = 0;
        // files are in Mo, we need to convert them to Go
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
                        <div className="join join-vertical w-full mt-5">
                            {storages.map((storage: any, index: number) => (
                                <div key={index} className="collapse collapse-arrow join-item">
                                    <input type="radio" name="my-accordion-4" />
                                    <div className="collapse-title text-xl font-medium">
                                        {`Storage ${index + 1}: ${storage.subscription.name}`}
                                    </div>
                                    <div className="collapse-content">
                                        {storage.files.length > 0 ? (
                                            <ul className="list-disc list-inside">
                                                {storage.files.map((file: any, index: number) => (
                                                    <li key={index}>{file.name} - {file.size} Mo</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No files</p>
                                        )}
                                    </div>
                                    <hr className="my-1 border border-slate-400" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </Fragment>
    );
}

export default Usersubscriptions;
