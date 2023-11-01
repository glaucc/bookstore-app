'use client';

import { useState, useEffect } from 'react';
import styles from '../../../styles/Home.module.css';
import { Folder } from 'lucide-react';

const dashboardData = [
  { entry: { isFile: true, name: "Sample Book 1" } },
  { entry: { isFile: true, name: "Sample Book 2" } },
  { entry: { isFile: false, name: "Sample Book 3" } },
  { entry: { isFile: false, name: "Sample Book 3" } },
  { entry: { isFile: false, name: "Sample Book 3" } },
  { entry: { isFile: false, name: "Sample Book 3" } },
  // Add more data as needed
];

const HomePage = () => {
  const [displayName, setDisplayName] = useState('');
  // const [files, setFiles] = useState([]); for real API
  const [files, setFiles] = useState(dashboardData);

  

  useEffect(() => {
    fetch('https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/alfresco/versions/1/people/-me-', {
      headers: {
        'Cookie': 'ALFRESCO_REMEMBER_ME=1',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDisplayName(data.displayName);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    fetch(
      'https://1curd3ms.trials.alfresco.com/alfresco/api/-default-/public/alfresco/versions/1/nodes/382b3102-ffba-422e-8711-d7f330fb5468/children?maxItems=25&orderBy=isFolder%20desc%2Cname%20ASC&include=path%2Cproperties%2CallowableOperations%2Cpermissions%2CaspectNames%2CisFavorite%2Cdefinition&includeSource=true',
      {
        headers: {
          'Cookie': 'ALFRESCO_REMEMBER_ME=1',
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const entries = data.list.entries;
        const filteredFiles = entries.filter((entry:any) => entry.entry.isFile && entry.entry.name);
        setFiles(filteredFiles);
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
      <div className={styles.dashboard}>
        <h2>Dashboard</h2>
        <div className={styles.horizontalDashboard}>
          {files.map((file) => (
            <div key={file.entry.id} className={styles.bookContainer}>
              <div className={styles.book}>
                {file.entry.isFile ? <Folder className={styles.folderIcon} /> : ""}
                <p>{file.entry.name}</p>
              </div>
            </div>
          ))}
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