'use client';

import { useState, useEffect } from 'react';
import styles from '../../../styles/Home.module.css';

import { Folder } from 'lucide-react';

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderTitle, setFolderTitle] = useState('');
  const [folderDescription, setFolderDescription] = useState('');

  const authHeaders = {
    Cookie: 'ALFRESCO_REMEMBER_ME=1',
    Authorization: 'Basic cmVhY3Q6MTIzNDU2', // Add your Base64 encoded credentials here
  };

  const createFolder = async () => {
    const url =
      'https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/382b3102-ffba-422e-8711-d7f330fb5468/children';
    const data = {
      nodeType: 'cm:folder',
      name: folderName,
      properties: {
        'cm:title': folderTitle,
        'cm:description': folderDescription,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic cmVhY3Q6MTIzNDU2', // Add your Base64 encoded credentials here
        },
        body: JSON.stringify(data),
      });
      console.log('Folder created:', response);

      // Add animation logic here
    } catch (error) {
      console.error('Error creating folder:', error);
    }
    setModalIsOpen(false);
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
  }, []);

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
            <Button className={styles.createFolderButton}>Create</Button>
            </div>
            
          </div>
        </div>
      </PopoverContent>
    </Popover>

          <Button className={styles.uploadFileButton}>Upload File</Button>
        </div>
        <div className={styles.dashboard}>
          <h2>Dashboard</h2>
          <div className={styles.horizontalDashboard}>
            {files.map((file, index) => (
              <div key={index} className={styles.bookContainer}>
                <div className={styles.book}>
                  {file.entry && !file.entry.isFile ? <Folder className={styles.folderIcon} /> : ''}
                  <p>{file.entry && file.entry.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <footer className={styles.footer}>
          <p>© 2023 Bookworm. All Rights Reserved.</p>
        </footer>
      </div>
      {modalIsOpen && (
        <Modal onClose={() => setModalIsOpen(false)}>
          <div className={styles.modalContent}>
            <h2>Create Folder</h2>
            <form onSubmit={createFolder}>
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Title:</label>
                <input
                  type="text"
                  value={folderTitle}
                  onChange={(e) => setFolderTitle(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description:</label>
                <input
                  type="text"
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                />
              </div>
              <Button type="submit" className={styles.createButton}>Create</Button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
