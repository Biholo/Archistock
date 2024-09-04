import { Fragment, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ArchistockApiService from '../../services/ArchistockApiService';
import StatsCard from '../../components/StatsCard/StatsCard';
import Card from '../../components/Card/Card';
import HardDriveStorage from '../../components/HardDrive/HardDrive';
import PreviewFileModal from '../../components/Modals/PreviewFileModal';
import Button from '../../components/Button/Button';
import { Download, Eye, FolderSimplePlus, Funnel, Trash } from '@phosphor-icons/react';
import FolderCreate from '../../components/FolderIcon/FolderCreate';
import { toast } from 'react-toastify';
import FolderSkeleton from '../../components/FolderSkeleton/FolderSkeleton';
import DroppableFolder from '../../components/Draggable/DroppableFolder';
import DraggableFile from '../../components/Draggable/DraggableFile';
import DebouncedInput from '../../components/Input/DebouncedInput';
import FileIcon from '../../components/FileIcon/FileIcon';

// Services
const archistockApiService = new ArchistockApiService();

const UserSubscriptions = () => {
  // Variables d'état
  const [storages, setStorages] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [updated, setUpdated] = useState<boolean>(false);
  const [createFolder, setCreateFolder] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Gestion de la navigation
  const [breadcrumb, setBreadcrumb] = useState<{ name: string, id: string | null }[]>([{ name: 'Subscriptions', id: null }]);

  // Gestion des dossiers et fichiers
  const [selectedStorage, setSelectedStorage] = useState<any>(null);
  const [selectedFolderContent, setSelectedFolderContent] = useState<any>(null);
  const [displayStorage, setDisplayStorage] = useState<boolean>(true);
  const [parentId, setParentId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [search, setSearch] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('');

  // Récupération des données
  useEffect(() => {
    setLoading(true);
    const searchTerm = search.trim().replace(/\s+/g, ' ');
    if(searchTerm !== '') {
      archistockApiService.searchFiles(search).then((res) => {
        console.log("RESULT", res);
        console.log("SEARCH", search);
        setSearchResults(res);
        setLoading(false);
      });
    }
    else if (selectedStorage && parentId) {
      archistockApiService.getFolder(parseInt(parentId!)).then((res) => {
        console.log(res);
        setSelectedFolderContent(res);
        setLoading(false);
      });
    } else if (selectedStorage && !parentId) {
      archistockApiService.getStorageRoot(selectedStorage.id).then((res) => {
        setSelectedFolderContent(res);
        setLoading(false);
      });
    } else {
      archistockApiService.getUserStorageWithFiles().then((res) => {
        setStorages(res);
        setFiles(res.flatMap((storage: any) => storage.files));
        setLoading(false);
      });
    }
  }, [updated, selectedStorage, parentId]);

  useEffect(() => {
    if(search !== "") {
      console.log("SEARCH", search);
      let filteredFiles = [...searchResults];
      switch (filter) {
        case 'name':
          filteredFiles.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'altname':
          filteredFiles.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'date':
          filteredFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'altdate':
          filteredFiles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'size':
          filteredFiles.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
          break;
        case 'altsize':
          filteredFiles.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
          break;
        case 'format':
          filteredFiles.sort((a, b) => a.format.localeCompare(b.format));
          break;
        case 'altformat':
          filteredFiles.sort((a, b) => b.format.localeCompare(a.format));
          break;
        default:
          break;
      }
      setSearchResults(filteredFiles);
    } else {
      if (selectedFolderContent && selectedFolderContent.files) {
        let filteredFiles = [...selectedFolderContent.files];
    
        switch (filter) {
          case 'name':
            filteredFiles.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'altname':
            filteredFiles.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'date':
            filteredFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'altdate':
            filteredFiles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
          case 'size':
            filteredFiles.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
            break;
          case 'altsize':
            filteredFiles.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
            break;
          case 'format':
            filteredFiles.sort((a, b) => a.format.localeCompare(b.format));
            break;
          case 'altformat':
            filteredFiles.sort((a, b) => b.format.localeCompare(a.format));
            break;
          default:
            break;
        }
    
        setSelectedFolderContent({
          ...selectedFolderContent,
          files: filteredFiles
        });
      }
    }
  }, [filter]);
  

  // Récupération de la taille totale des fichiers
  const getAllFilesSize = (files: any[]) => {
    return files.reduce((totalSize, file) => totalSize + parseFloat(file.size) / 1000, 0).toFixed(2);
  };

  // Récupération de la taille totale du stockage
  const getTotalStorageSize = (storages: any[]) => {
    return storages.reduce((totalSize, storage) => totalSize + parseFloat(storage.subscription.size), 0);
  };

  // Gestion des événements
  const onStorageClick = (storage: any) => {
    setSelectedStorage(storage);
    setDisplayStorage(false);
    setParentId(null);
    setBreadcrumb([{ name: 'Subscriptions', id: null }, { name: storage.name, id: storage.id }]);
    setUpdated(!updated);
  };

  const onFolderClick = (folder: any) => {
    // Mise à jour du breadcrumb
    setParentId(folder.id);
    setBreadcrumb(prevBreadcrumb => [...prevBreadcrumb, { name: folder.name, id: folder.id }]);
    setUpdated(!updated);
  };

  const onBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setDisplayStorage(true);
      setParentId(null);
      setBreadcrumb([{ name: 'Subscriptions', id: null }]);
    } else if (index === 1) {
      setDisplayStorage(false);
      setParentId(null);
      setBreadcrumb([{ name: 'Subscriptions', id: null }, { name: selectedStorage.name, id: selectedStorage.id }]);
    } else {
      setParentId(breadcrumb[index].id);
      setBreadcrumb(breadcrumb.slice(0, index + 1));
    }
    setUpdated(!updated);
  };

  const handleCreateFolder = (folderName: string) => {
    archistockApiService.createFolder({ name: folderName, parentId, userSubscriptionId: selectedStorage.id }).then((res) => {
      if (res.status === 201) {
        toast.success("Folder created successfully");
        setCreateFolder(false);
        setUpdated(!updated);
      } else {
        toast.error("An error occurred while creating the folder. Please retry.");
      }
    });
  };

  const onDeleteFolder = (folder: any) => {
    archistockApiService.deleteFolder(folder.id).then((res) => {
      if (res.status === 201) {
        toast.success("Folder deleted successfully");
        setUpdated(!updated);
      } else {
        toast.error("An error occurred while deleting the folder. Please retry.");
      }
    });
  };

  const handleDrop = (file: any, folder: any) => {
    const data = {
      parentId: folder.id,
    };

    console.log(folder.id);

    archistockApiService.updateFile(file.id, data).then((res) => {
      if (res.status === 201) {
        toast.success("File moved successfully");
        setUpdated(!updated);
      } else {
        console.log(res);
        toast.error("An error occurred while moving the file. Please retry.");
      }
    })
  };

  const handleDownload = (filename: string) => {
    archistockApiService.downloadFile(filename).then((res) => {
      console.log(res);
    });
  }

  return (
    <Fragment>
        <DndProvider backend={HTML5Backend}>
        <Fragment>
          {storages.length > 0 && (
            <div className="m-5">
              <h1 className="text-xl font-bold mb-3">Your storage</h1>
              <div className="flex flex-wrap justify-between mt-5">
                <StatsCard name="Storage" stat={storages.length} color="#FFA800" />
                <StatsCard name="Files" stat={files.length} color="#E757B6" />
                <StatsCard name="Go" stat={getAllFilesSize(files)} color="#24B34C" />
                <StatsCard name="Total Go" stat={getTotalStorageSize(storages)} color="#7C57E7" />
              </div>

              <Card css="mt-10">
                <div className="flex justify-between">
                  <div className="breadcrumbs text-sm">
                    <ul>
                      {breadcrumb.map((item, index) => (
                        <li key={index} className="inline-block">
                          {index === breadcrumb.length - 1 ? (
                            <span className="font-bold">{item.name}</span>
                          ) : (
                            <span className="cursor-pointer" onClick={() => onBreadcrumbClick(index)}>{item.name}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {!displayStorage && (
                    <Button color="primary" onClick={() => setCreateFolder(true)} css="btn-md">
                      <FolderSimplePlus size={24} />
                    </Button>
                  )}
                </div>
                <div className='flex flex-row'>
                <DebouncedInput placeholder='Rechercher des fichiers' onChange={(e) => { setSearch(e); setUpdated(!updated) }} css='w-11/12' />
                <details className="dropdown dropdown-bottom dropdown-end">
                  <summary className="btn m-1">Filters <Funnel /></summary>
                  <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-white">
                    <li className="menu-title">Sort by</li>
                    <li className={filter == "" ? 'bg-gray-700 w-full rounded' : ''}>
                      <a onClick={() => setFilter('')}>None</a>
                    </li>
                    <li className={filter == "name" || filter == 'altname' ? 'bg-gray-700 w-full rounded' : ''}>
                      <a onClick={() => filter === 'name' ? setFilter('altname') : setFilter("name")}>Name</a>
                    </li>
                    <li className={filter == "date" || filter == 'altdate' ? 'bg-gray-700 w-full rounded' : ''}>
                      <a onClick={() => filter === 'date' ? setFilter('altdate') : setFilter("date")}>Date</a>
                    </li>
                    <li className={filter == "size" || filter == 'altsize' ? 'bg-gray-700 w-full rounded' : ''}>
                      <a onClick={() => filter === 'size' ? setFilter('altsize') : setFilter("size")}>Size</a>
                    </li>
                    <li className={filter == "format" || filter == 'altformat' ? 'bg-gray-700 w-full rounded' : ''}>
                      <a onClick={() => filter === 'format' ? setFilter('altformat') : setFilter("format")}>Format</a>
                    </li>
                  </ul>
                </details>
                </div>
                {search.trim().replace(/\s+/g, ' ') !== "" ? (
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
                            {searchResults.map((file, index) => (
                              <tr className={index%2===0 ? "bg-blue-100" : ""}>
                                <th className='flex flex-row items-center gap-3'>
                                  <FileIcon type={file.format} />
                                  <p className="">{file.name}.{file.format}</p>
                                </th>
                                <td>{file.format}</td>
                                <td>{(parseFloat(file.size) / 1000).toFixed(2)} Go</td>
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
                  
                ) : (
                  displayStorage ? (
                    <div className="flex flex-row flex-wrap mt-5">
                      {storages.map((storage, index) => (
                        <div key={index} className="mr-5">
                          <HardDriveStorage storage={storage} onStorageClick={onStorageClick} onUpdate={() => setUpdated(!updated)} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    selectedFolderContent && (
                      <div className="flex flex-wrap gap-5 mt-5 w-full">
                        <DroppableFolder 
                          folder={{ name: "...", id: breadcrumb.length > 2 ? breadcrumb[breadcrumb.length - 3].id : null }}
                          onDrop={(file: any, folder: any) => handleDrop(file, folder)}
                          onClick={() => onBreadcrumbClick(breadcrumb.length - 2)}
                          onDelete={() => {}}
                          onUpdate={() => setUpdated(!updated)}
  
                        />
                        {loading ? (
                          <Fragment>
                            <FolderSkeleton />
                          </Fragment>
                        ) : (
                          <Fragment>
                            {selectedFolderContent && (
                              <Fragment>
                                {selectedFolderContent.children.map((folder: any, index: number) => (
                                  <DroppableFolder 
                                    key={index} 
                                    folder={folder} 
                                    onDrop={(file: any) => handleDrop(file, folder)} 
                                    onClick={() => { onFolderClick(folder) }} 
                                    onDelete={() => { onDeleteFolder(folder) }}
                                    onUpdate={() => setUpdated(!updated)}
                                />
                                ))}
                                {createFolder && (
                                  <FolderCreate onCreate={(e: any) => handleCreateFolder(e)} />
                                )}
                                {selectedFolderContent.files.map((file: any, index: number) => (
                                  <div className='flex flex-col gap-0'>
                                    <DraggableFile 
                                      key={index} 
                                      file={file} 
                                      onDrop={(folder: any) => console.log(`Dropping file ${file.name} into folder ${folder.name}`)}
                                      onClick={() => {console.log("File clicked"); setSelectedFile(file)}}
                                      onDelete={() => {setUpdated(!updated)}}
                                      onUpdate={() => setUpdated(!updated)}
                                    />
                                    <div className='flex flex-row items-center justify-center'>
                                      {filter === 'name' || filter === 'altname' ? (
                                        <p className='text-xs text-center'>{file.name}</p>
                                      ) : null}
                                      {filter === 'date' || filter === 'altdate' ? (
                                        <p className='text-xs text-center'>{new Date(file.createdAt).toLocaleDateString()}</p>
                                      ) : null}
                                      {filter === 'size' || filter === 'altsize' ? (
                                        <p className='text-xs text-center'>{(parseFloat(file.size) / 1000).toFixed(2)} Go</p>
                                      ) : null}
                                      {filter === 'format' || filter === 'altformat' ? (
                                        <p className='text-xs text-center'>{file.format}</p>
                                      ) : null}


                                    </div>
                                  </div>
                                ))}
                              </Fragment>
                            )}
                          </Fragment>
                        )}
                      </div>
                    )
                    )
                )}
              </Card>
              </div>
          )}
          </Fragment>
      </DndProvider>
      {selectedFile && (
          <PreviewFileModal show={true} file={selectedFile} onClose={() => setSelectedFile(null)} />
      )}
    </Fragment>
    );
}

export default UserSubscriptions;
