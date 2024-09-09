import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import ArchistockApiService from "../../services/ArchistockApiService";
import FileIcon from "../../components/FileIcon/FileIcon";
import Button from "../../components/Button/Button";
import { Download, Eye, Trash } from "@phosphor-icons/react";
import PreviewFileModal from "../../components/Modals/PreviewFileModal";
import DebouncedInput from "../../components/Input/DebouncedInput";

const archistockApiService = new ArchistockApiService();

const UserStorage = () => {

    const id = useParams().id;
    const { user } = useAuth();
    const navigate = useNavigate();

    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState<string>("");
    const [filteredFiles, setFilteredFiles] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<any>();

    useEffect(() => {
        if(id)
        {
            archistockApiService.findUserStorageById(parseInt(id)).then((data:any) => {
                console.log("Data received:", data); // Check the structure of data
                setSearchResults(data);
                setFilteredFiles(data);
            });
        }
    }, [id]);


    useEffect(() => {
        let filteredFiles = [...searchResults];
        filteredFiles = searchResults.filter((file) => file.name.toLowerCase().includes(search.toLowerCase()));
        switch (filter) {
        case 'name':
            filteredFiles.sort((a, b) => a.name.localeCompare(b.name));
            setFilteredFiles(filteredFiles);
            break;
        case 'altname':
            filteredFiles.sort((a, b) => b.name.localeCompare(a.name));
            setFilteredFiles(filteredFiles);
            break;
        case 'date':
            filteredFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setFilteredFiles(filteredFiles);
            break;
        case 'altdate':
            filteredFiles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setFilteredFiles(filteredFiles);
            break;
        case 'size':
            filteredFiles.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
            setFilteredFiles(filteredFiles);
            break;
        case 'altsize':
            filteredFiles.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
            setFilteredFiles(filteredFiles);
            break;
        case 'format':
            filteredFiles.sort((a, b) => a.format.localeCompare(b.format));
            setFilteredFiles(filteredFiles);
            break;
        case 'altformat':
            filteredFiles.sort((a, b) => b.format.localeCompare(a.format));
            setFilteredFiles(filteredFiles);
            break;
        default:
            setFilteredFiles(filteredFiles);
            break;
        }
      }, [filter, search]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }

        if(user.role !== "admin") {
            navigate("/storaged");
            toast.error("Vous n'avez pas les droits pour accéder à cette page.");
        }
        
        archistockApiService.findUserStorageById(id).then((data:any) => {
            console.log("Data received:", data); // Check the structure of data
        });
    }, [id]);
    
    const handleDownload = (filename: string) => {
        archistockApiService.downloadFile(filename).then((res) => {
          console.log(res);
        });
      }

    return (
        <div className="m-5">
            <h1 className="text-2xl font-bold mb-3">Abonnements de l'utilisateur {id}</h1>
            <DebouncedInput placeholder='Rechercher des fichiers' onChange={(e) => { setSearch(e) }} css='w-11/12' />
                <details className="dropdown dropdown-bottom dropdown-end">
                  <summary className="btn m-2">Filtres</summary>
                  <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-white">
                    <li className="menu-title">Filter par</li>
                    <li className={filter == "" ? 'bg-gray-700 w-full rounded' : ''}>
                      <a onClick={() => setFilter('')}>Aucun</a>
                    </li>
                    <li className={filter == "name" || filter == 'altname' ? 'bg-gray-700 w-full rounded' : ''}>
                      <a onClick={() => filter === 'name' ? setFilter('altname') : setFilter("name")}>Nom</a>
                    </li>
                    <li className={filter == "date" || filter == 'altdate' ? 'bg-gray-700 w-full rounded' : ''}>
                      <a onClick={() => filter === 'date' ? setFilter('altdate') : setFilter("date")}>Date</a>
                    </li>
                    <li className={filter == "size" || filter == 'altsize' ? 'bg-gray-700 w-full rounded' : ''}>
                      <a onClick={() => filter === 'size' ? setFilter('altsize') : setFilter("size")}>Taille</a>
                    </li>
                    <li className={filter == "format" || filter == 'altformat' ? 'bg-gray-700 w-full rounded' : ''}>
                      <a onClick={() => filter === 'format' ? setFilter('altformat') : setFilter("format")}>Format</a>
                    </li>
                  </ul>
                </details>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr className='text-black'>
                            <th>Nom</th>
                            <th>Type</th>
                            <th>Taille</th>
                            <th>Storage</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    <Fragment>
                        {filteredFiles.map((file, index) => (
                        <tr className={index%2===0 ? "bg-blue-100" : ""}>
                            <th className='flex flex-row items-center gap-3'>
                            <FileIcon type={file.format} />
                            <p className="">{file.name}.{file.format}</p>
                            </th>
                            <td>{file.format}</td>
                            <td>{(parseFloat(file.size)).toFixed(2)} Mo</td>
                            <td className='link'>{file.usersubscription.name}</td>
                            <td>
                            <ul className="flex flex-row gap-5">
                                <li>
                                <Button color="primary" onClick={() => handleDownload(file.name)}>
                                    <Download size={16} />
                                </Button>
                                </li>
                                <li>
                                <Button color="info" onClick={() => setSelectedFile(file)}>
                                    <Eye size={16} />
                                </Button>
                                </li>
                                <li>
                                <Button color="danger" onClick={() => {}}>
                                    <Trash size={16} />
                                </Button>
                                </li>
                            </ul>
                            </td>
                        </tr>
                        ))}
                    </Fragment>
                    
                    </tbody>
                </table>
            </div>
            {selectedFile && (
                <PreviewFileModal show={true} file={selectedFile} onClose={() => setSelectedFile(null)} />
            )}  
        </div>
    )
}

export default UserStorage;