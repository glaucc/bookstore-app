'use client';

import { useState, useEffect } from 'react';
import styles from '../../../styles/Home.module.css';

import { Folder, Upload, X } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const HomePage = () => {
  const [displayName, setDisplayName] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [refreshData, setRefreshData] = useState(false);
  const [isFilePopoverOpen, setIsFilePopoverOpen] = useState(false);
  const [viewedFileData, setViewedFileData] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const authHeaders = {
    Cookie: 'ALFRESCO_REMEMBER_ME=1',
    Authorization: 'Basic cmVhY3Q6MTIzNDU2', // Add your Base64 encoded credentials here
  };

  const handleCreateFolder = () => {
    const name = document.getElementById('name') as HTMLInputElement;
    const title = document.getElementById('title') as HTMLInputElement;
    const desc = document.getElementById('desc') as HTMLInputElement;

    const folderName = name.value;
    const folderTitle = title.value;
    const folderDescription = desc.value;

    const data = {
      nodeType: 'cm:folder',
      name: folderName,
      properties: {
        'cm:title': folderTitle,
        'cm:description': folderDescription,
      },
    };

    createFolder(data);
    setRefreshData(!refreshData);
  };

  const createFolder = async (data:any) => {
    const url =
      'https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/382b3102-ffba-422e-8711-d7f330fb5468/children';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic cmVhY3Q6MTIzNDU2', // Add your Base64 encoded credentials here
        },
        body: JSON.stringify(data),
      });
      console.log('Folder created!');

      // Add animation logic here
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleFileUpload = async (file:File) => {
    const url = `https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/382b3102-ffba-422e-8711-d7f330fb5468/children?autoRename=true&include=allowableOperations`;

    const formData = new FormData();
    formData.append('filedata', file);
    formData.append('relativePath', '');
    formData.append('include', 'allowableOperations');
    formData.append('autoRename', 'true');
    formData.append('nodeType', 'cm:content');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Basic cmVhY3Q6MTIzNDU2',
        },
        body: formData,
      });

      console.log('File uploaded!');
      setIsFilePopoverOpen(false); // Close the file upload popover after successful upload
      setRefreshData(!refreshData);
      // Trigger data refresh here if necessary
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleViewFile = async (fileId:string) => {
    try {
      const response = await fetch(
        `https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/${fileId}/content?attachment=false`,
        { headers: authHeaders }
      );

    const data = await response.text(); // Read the response as text
    console.log('Retrieved text data:', data); // Log the retrieved text data

    setViewedFileData(data);
    
  } catch (error) {
    console.error('Error viewing file:', error);
  }

  };

  const handleFolderDoubleClick = async (folderId:any) => {
    try {
      const response = await fetch(
          `https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/${folderId}/children?maxItems=25&orderBy=isFolder%20desc%2Cname%20ASC&include=path%2Cproperties%2CallowableOperations%2Cpermissions%2CaspectNames%2CisFavorite%2Cdefinition&includeSource=true`,
        {
          headers: authHeaders,
        }
      );
      const data = await response.json();
      const entries = data.list.entries;
      console.log(data)
      setFiles(entries);
      setSelectedFolder(folderId);
    } catch (error) {
      console.error('Error fetching folder contents:', error);
    }
  };

  useEffect(() => {
    fetch('https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/alfresco/versions/1/people/-me-', {
      headers: authHeaders,
    })
      .then((response) => response.json())
      .then((data) => {
        setDisplayName(data.entry.displayName);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

      

    fetch(
      'https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/382b3102-ffba-422e-8711-d7f330fb5468/children?maxItems=25&orderBy=isFolder%20desc%2Cname%20ASC&include=path%2Cproperties%2CallowableOperations%2Cpermissions%2CaspectNames%2CisFavorite%2Cdefinition&includeSource=true',
      {
        headers: authHeaders,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const entries = data.list.entries;
        setFiles(entries);
      })
      .catch((error) => {
        console.error('Error fetching files:', error);
      });

      if (selectedFolder) {
        handleFolderDoubleClick(selectedFolder);
      }

  }, [refreshData, selectedFolder]);

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Bookworm</h1>
          <nav className={styles.navbar}>
            <ul className={styles.navbarList}>
              <li>Home</li>
              <li>Books</li>
              <li>Authors</li>
              <li>Categories</li>
              <li>{displayName || 'My Account'}</li>
            </ul>
          </nav>
        </header>
    <div className={styles.actionButtons}>

        


        <Popover>
      <PopoverTrigger asChild>
        <Button className={styles.createFolderButton}>Create Folder</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create Folder</h4>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name">Folder Name</Label>
              <Input
                id="name"
                defaultValue=""
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                defaultValue=""
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="desc">Description</Label>
              <Input
                id="desc"
                defaultValue=""
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4 pt-4">
            <Button className={styles.createFolderButton} onClick={handleCreateFolder}>Create</Button>
            </div>
            
          </div>
        </div>
      </PopoverContent>
      </Popover>




      <Popover>
      <PopoverTrigger asChild>
        <Button className={styles.uploadFileButton}>Upload File</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          
        <input
          type="file"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
            
            
        </div>
      </PopoverContent>
      </Popover>




    </div>
        <div className={styles.dashboard}>
          <h2>Dashboard</h2>
          <div className={styles.horizontalDashboard}>
            {files.map((file, index) => (
              <div key={index} 
              className={styles.bookContainer}
              onDoubleClick={() => {
                if (file.entry.isFolder) {
                  handleFolderDoubleClick(file.entry.id);
                }
              }}
              >
                <div 
                className={styles.book}
                style={{ cursor: file.entry.isFile ? 'pointer' : 'auto' }}
                onClick={() => {
                  if (file.entry.isFile) {
                    handleViewFile(file.entry.id);
                    setIsPopoverOpen(true);
                  }
                }}                
                >
                  {!file.entry.isFile ? <Folder className={styles.folderIcon} /> : ''}
                  <p>{file.entry.name}</p>
                </div>
                

              </div>
            ))}
            
            
            
          {isPopoverOpen && viewedFileData && (
            <div className={styles.dataDiv}>
              <p className={styles.fileData}>{viewedFileData}</p>
              <div className={styles.closeButton} onClick={() => setIsPopoverOpen(false)}>
                <X size={40} className={styles.X} />
                <span className={styles.hoverText}>Close</span>
              </div>
            </div>
          )}

          </div>
        </div>
        <footer className={styles.footer}>
          <p>© 2023 Bookworm. All Rights Reserved.</p>
        </footer>
      </div>
      
    </div>
  );
};

export default HomePage;
