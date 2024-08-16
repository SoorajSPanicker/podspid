const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const fs = require('fs'); // Add this line to import the fs module
const url = require('url');
const path = require('path');
const sqlite3 = require('sqlite3').verbose(); // SQLite3 library for database operations
const { v4: uuidv4 } = require('uuid');
const xlsx = require('xlsx');

let mainWindow;
let db;
let selectedFolderPath;
let projectdb
let projectdBPath;
let databasePath
let projectPath

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Electron App',
        width: 1500,
        height: 800,
        minWidth: 840,
        minHeight: 600,
        // maxHeight:800, 
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // mainWindow.webContents.openDevTools();

    const startUrl = url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file',
    });

    mainWindow.loadURL(startUrl);

}


function deleteprojectdb() {
    const dbPath = path.join(app.getPath('userData'), 'project.db');

    // Check if the database file exists
    if (fs.existsSync(dbPath)) {
        // Delete the database file
        fs.unlink(dbPath, (err) => {
            if (err) {
                console.error('Error deleting database file:', err);
            } else {
                console.log('Database file deleted successfully.');
            }
        });
    } else {
        console.error('Database file does not exist.');
    }
}

function deleteProjectDetails(projectNumber) {
    // Check if the projectdb is initialized
    if (!projectdb) {
        console.error('Database not initialized.');
        return;
    }

    // Prepare the SELECT statement to get the project name
    const selectSql = 'SELECT projectName FROM projectdetails WHERE projectId = ?';

    // Execute the SELECT statement
    projectdb.get(selectSql, [projectNumber], (err, row) => {
        if (err) {
            console.error('Error fetching project name:', err.message);
            return;
        }

        // If the project does not exist
        if (!row) {
            console.error('Project not found.');
            return;
        }

        const projectName = row.projectName;
        console.log(projectName);

        // Prepare the DELETE statement
        const deleteSql = 'DELETE FROM projectdetails WHERE projectId = ?';

        // Execute the DELETE statement
        projectdb.run(deleteSql, projectNumber, function (err) {
            if (err) {
                console.error('Error deleting project details:', err.message);
                return;
            }

            // Check how many rows were affected
            console.log(`Rows deleted: ${this.changes}`);

            // Send the response with the project name
            mainWindow.webContents.send('delete-project-response', projectName);
        });
    });
}

function deleteAllProjectDetails() {
    // Check if the projectdb is initialized
    if (!projectdb) {
        console.error('Database not initialized.');
        return;
    }

    // Prepare the DELETE statement to remove all rows from the table
    const deleteSql = 'DELETE FROM projectdetails';

    // Execute the DELETE statement
    projectdb.run(deleteSql, function (err) {
        if (err) {
            console.error('Error deleting all project details:', err.message);
            return;
        }

        // Check how many rows were affected
        console.log(`Rows deleted: ${this.changes}`);

        // Send the response after deletion
        mainWindow.webContents.send('delete-all-project-response');
    });
}

function createProjectDatabase() {
    const dbPath = path.join(app.getPath('userData'), 'project.db');
    projectdBPath = dbPath
    projectdb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the database.', dbPath);
            // Create tables if they don't exist
            projectdb.run(`CREATE TABLE IF NOT EXISTS projectdetails (
                                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                                 projectId TEXT,
                                 projectNumber TEXT,
                                projectName TEXT,
                                 projectDescription TEXT,
                                 projectPath TEXT,
                                 TokenNumber TEXT
                             )`);
        }
    });

}

// Function to create or connect to the database in the specified folder
function createDatabase() {
    if (!selectedFolderPath) {
        console.error('No folder selected.');
        return;
    }
    const dbPath = path.join(selectedFolderPath, 'database.db');
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the database.', dbPath);
            db.run("CREATE TABLE IF NOT EXISTS Tags ( tagId TEXT,tagNumber TEXT, tagName TEXT, tagType TEXT, PRIMARY KEY(tagId))");
            db.run("CREATE TABLE IF NOT EXISTS Flags ( flagId TEXT,elementId TEXT, parentDoc TEXT, connectDoc TEXT , connectFlag TEXT , adjTag TEXT)");
            db.run('CREATE TABLE IF NOT EXISTS Documents (docId TEXT,number TEXT UNIQUE, title TEXT, descr TEXT, type TEXT, filename TEXT, PRIMARY KEY(docId))')
            db.run('CREATE TABLE IF NOT EXISTS Elements (elementId TEXT,tagNumber TEXT, filename TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS LineList (tagId TEXT,tag TEXT, fluidCode TEXT, lineId TEXT, medium TEXT, lineSizeIn REAL, lineSizeNb REAL,'
                + 'pipingSpec TEXT, insType TEXT, insThickness TEXT, heatTrace TEXT, lineFrom TEXT, lineTo TEXT, pnid TEXT, pipingIso TEXT,'
                + 'pipingStressIso TEXT, maxOpPress REAL, maxOpTemp REAL, dsgnPress REAL, minDsgnTemp REAL, maxDsgnTemp REAL, testPress REAL,'
                + 'testMedium TEXT, testMediumPhase TEXT, massFlow REAL, volFlow REAL, density REAL, velocity REAL, paintSystem TEXT, ndtGroup TEXT,'
                + 'chemCleaning TEXT, pwht TEXT, PRIMARY KEY(tag))')
            db.run('CREATE TABLE IF NOT EXISTS EquipmentList (tagId TEXT, tag TEXT, descr TEXT, qty TEXT, capacity REAL, type TEXT, materials TEXT,'
                + 'capacityDuty TEXT, dims TEXT, dsgnPress REAL, opPress REAL, dsgnTemp REAL, opTemp REAL, dryWeight REAL, opWeight REAL, pnid TEXT,'
                + 'supplier TEXT, remarks TEXT, initStatus TEXT, revision TEXT, revisionDate TEXT, PRIMARY KEY(tag))')
            db.run('CREATE TABLE IF NOT EXISTS Area (areaId TEXT,areaNumber TEXT,areaName TEXT)')
            // db.run(`CREATE TABLE IF NOT EXISTS TagInfo (tagId TEXT,tag TEXT,type TEXT,taginfo1 TEXT,taginfo2 TEXT,taginfo3 TEXT,taginfo4 TEXT,taginfo5 TEXT,taginfo6 TEXT,taginfo7 TEXT,taginfo8 TEXT,taginfo9 TEXT,taginfo10 TEXT,taginfo11 TEXT,taginfo12 TEXT,taginfo13 TEXT,taginfo14 TEXT,taginfo15 TEXT,taginfo16 TEXT,taginfo17 TEXT,PRIMARY KEY(tagId)
            // )`);
            db.run("CREATE TABLE IF NOT EXISTS CommentTable (docNumber TEXT,number TEXT,comment TEXT,statusname TEXT,priority TEXT,createdby TEXT,createddate TEXT,coOrdinateX REAL,coOrdinateY REAL,closedBy TEXT,closedDate TEXT)");
            db.run('CREATE TABLE IF NOT EXISTS CommentStatus (number TEXT,statusname TEXT,color TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS TagInfoCustom (HeadField TEXT,FieldName TEXT,Unit TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS Master (masterId TEXT,docId TEXT,number TEXT UNIQUE, title TEXT, descr TEXT, type TEXT, filename TEXT, PRIMARY KEY(masterId))')
            db.run(`CREATE TABLE IF NOT EXISTS TagInfo (
                tagId TEXT,
                tag TEXT,
                type TEXT,
                taginfo1 TEXT,
                taginfo2 TEXT,
                taginfo3 TEXT,
                taginfo4 TEXT,
                taginfo5 TEXT,
                taginfo6 TEXT,
                taginfo7 TEXT,
                taginfo8 TEXT,
                taginfo9 TEXT,
                taginfo10 TEXT,
                taginfo11 TEXT,
                taginfo12 TEXT,
                taginfo13 TEXT,
                taginfo14 TEXT,
                taginfo15 TEXT,
                taginfo16 TEXT,
                taginfo17 TEXT,
                taginfo18 TEXT,
                taginfo19 TEXT,
                taginfo20 TEXT,
                taginfo21 TEXT,
                taginfo22 TEXT,
                taginfo23 TEXT,
                taginfo24 TEXT,
                taginfo25 TEXT,
                taginfo26 TEXT,
                taginfo27 TEXT,
                taginfo28 TEXT,
                taginfo29 TEXT,
                taginfo30 TEXT,
                taginfo31 TEXT,
                taginfo32 TEXT,
                taginfo33 TEXT,
                taginfo34 TEXT,
                taginfo35 TEXT,
                taginfo36 TEXT,
                taginfo37 TEXT,
                taginfo38 TEXT,
                taginfo39 TEXT,
                taginfo40 TEXT,
                taginfo41 TEXT,
                taginfo42 TEXT,
                taginfo43 TEXT,
                taginfo44 TEXT,
                taginfo45 TEXT,
                taginfo46 TEXT,
                taginfo47 TEXT,
                taginfo48 TEXT,
                taginfo49 TEXT,
                taginfo50 TEXT,
            
                PRIMARY KEY(tagId)
            )`);
            db.run('CREATE TABLE IF NOT EXISTS UserTagInfoFieldUnits (id INTEGER PRIMARY KEY AUTOINCREMENT, field TEXT, unit TEXT, statuscheck TEXT)');
            // db.run('CREATE TABLE IF NOT EXISTS Layers (layerId TEXT,areaId TEXT,x REAL,y REAL,width TEXT,height TEXT,filename TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS Layers (areaNumber TEXT,x REAL, y REAL, width TEXT, height TEXT,docId TEXT)')
            db.run('CREATE TABLE IF NOT EXISTS PidAreaTag (tagNumber text,areaNumber TEXT)')
            // db.run('CREATE TABLE IF NOT EXISTS TagInfoName (id INTEGAR PRIMARY KEY,field TEXT,unit Text)')
        }
    });
    databasePath = path.join(selectedFolderPath, 'database.db');
}




function selectFolderAndCreateDatabase(event) {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    }).then(result => {
        const folderPath = result.filePaths[0];
        if (folderPath) {
            console.log(folderPath)
            selectedFolderPath = folderPath;
            console.log("Sent 'data-fetched' event to renderer process");
            mainWindow.webContents.send('select-folder-fetched', selectedFolderPath);
        }
    }).catch(err => {
        console.error("Error selecting folder:", err);
    });
}

function generateCustomID(prefix) {
    const uuid = uuidv4();
    const uniqueID = prefix + uuid.replace(/-/g, '').slice(0, 6);
    return uniqueID;
}

function initializeProjectDatabase(databasePath, mainWindow) {
    const projectDb = new sqlite3.Database(databasePath, async (err) => {
        if (err) {
            console.error('Error opening project database:', err.message);
            return;
        }
        console.log("databasePath", databasePath);

        const statuses = [
            { number: '1', statusname: 'open', color: '#ff0000' },
            { number: '2', statusname: 'closed', color: '#00ff00' }
        ];

        const userDefinedFields = Array.from({ length: 50 }, (_, i) => ({
            taginfo: `Taginfo${i + 1}`,
            taginfounit: `Taginfounit${i + 1}`,
            tagcheck: `unchecked`
        }));

        const runQuery = (query, params = []) => {
            return new Promise((resolve, reject) => {
                projectDb.run(query, params, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        };

        const selectQuery = (query) => {
            return new Promise((resolve, reject) => {
                projectDb.all(query, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        };

        try {
            for (let status of statuses) {
                await runQuery(`INSERT OR IGNORE INTO CommentStatus (number, statusname, color) VALUES (?, ?, ?)`, [status.number, status.statusname, status.color]);
            }

            let allStatuses = await selectQuery("SELECT * FROM CommentStatus");
            mainWindow.webContents.send('all-comments-fetched', allStatuses);

            for (let { taginfo, taginfounit, tagcheck } of userDefinedFields) {

                // Insert into UserTagInfoFieldUnits table
                await runQuery(
                    `INSERT OR IGNORE INTO UserTagInfoFieldUnits (field, unit, statuscheck) VALUES (?, ?, ?)`,
                    [taginfo, taginfounit, tagcheck]
                );
            }

            // Retrieve all inserted fields
            let allUserDefinedFields = await selectQuery("SELECT * FROM UserTagInfoFieldUnits");
            mainWindow.webContents.send('all-fields-user-defined', allUserDefinedFields);

        } catch (error) {
            console.error('Error:', error.message);
        }
    });
}

app.whenReady().then(() => {
    createMainWindow();
    // deleteprojectdb();

    createProjectDatabase();
    // deleteProjectDetails('3');
    // allcolumns();

    ipcMain.on('select-folder', () => {
        console.log("Received 'select-folder' request from renderer process");
        selectFolderAndCreateDatabase();
    });

    ipcMain.on('open-project', (event, projectNumber) => {
        console.log(`Received 'open-project' request for project with ID: ${projectNumber}`);

        // Check if the project database is initialized
        if (!projectdb) {
            console.error('Project database not initialized.');
            return;
        }

        // Query the project database to check if the project with the given ID exists
        projectdb.get('SELECT * FROM projectdetails WHERE projectNumber = ?', projectNumber, (err, row) => {
            if (err) {
                console.error('Error querying project database:', err.message);
                return;
            }

            if (row) {

                selectedFolderPath = row.projectPath;
                console.log(`Project path retrieved from database: ${selectedFolderPath}`);

                // Construct the path to the database file
                databasePath = path.join(selectedFolderPath, 'database.db');
                console.log(`Opening database file: ${databasePath}`);

                // Open the database file
                const db = new sqlite3.Database(databasePath, (err) => {
                    if (err) {
                        console.error('Error opening database:', err.message);
                        return;
                    }

                    db.all("SELECT * FROM Tags", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the Tag table:', rows);
                        mainWindow.webContents.send('all-tags-fetched', rows);
                    });
                    db.all("SELECT * FROM Documents", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the Documents table:', rows);
                        mainWindow.webContents.send('all-docs-fetched', rows);
                    });

                    db.all("SELECT * FROM Documents WHERE type = ?", ["iXB"], (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Documents table:', err.message);
                            return;
                        }

                        console.log('Data in the Documents table:', rows);
                        mainWindow.webContents.send('spid-docs-fetched', rows);
                    });
                    db.all("SELECT * FROM Elements", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the Elements table:', rows);
                        mainWindow.webContents.send('all-elements-fetched', rows);
                    });
                    db.all("SELECT * FROM Area", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the Area table:', rows);
                        mainWindow.webContents.send('all-area-fetched', rows);
                    });
                    db.all("SELECT * FROM LineList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the LineList table:', rows);
                        mainWindow.webContents.send('all-line-fetched', rows);
                    });
                    db.all("SELECT * FROM EquipmentList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the EquipmentList table:', rows);
                        mainWindow.webContents.send('all-equ-fetched', rows);
                    });
                    db.all("SELECT * FROM tagInfo", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the tagInfo table:', rows);
                        mainWindow.webContents.send('all-taginfo-fetched', rows);
                    });
                    db.all("SELECT * FROM Flags", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the Flags table:', rows);
                        mainWindow.webContents.send('all-flags-fetched', rows);
                    });
                    db.all("SELECT * FROM CommentTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }
                        console.log('Data in the CommentTable table:', rows)

                        mainWindow.webContents.send('all-comments', rows);
                    });
                    db.all("SELECT * FROM CommentStatus", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the CommentStatus table:', rows);
                        mainWindow.webContents.send('all-comments-fetched', rows);
                    });
                    db.all("SELECT * FROM UserTagInfoFieldUnits", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from UserTagInfoFieldUnits table:', err.message);
                            return;
                        }
                        console.log("all-fields-user-defined", rows);
                        mainWindow.webContents.send('all-fields-user-defined', rows);
                    });
                    // db.all("SELECT * FROM TagInfoName", (err, rows) => {
                    //     if (err) {
                    //         console.error('Error fetching data from TagInfoName table:', err.message);
                    //         return;
                    //     }
                    //     console.log('all-taginfoname-fetched', rows);
                    //     mainWindow.webContents.send('all-taginfoname-fetched', rows);
                    // });
                });



            } else {
                console.error(`Project with ID ${projectNumber} not found.`);
            }
        });
    });

    ipcMain.on('all-tags-fetched', (event) => {
        if (!projectdb) {
            console.error('Database not initialized.');
            return;
        }

        projectdb.all("SELECT * FROM Tags", (err, rows) => {
            if (err) {
                console.error('Error fetching data:', err.message);
                return;
            }
            console.log("Fetched data:", rows);
            // Send fetched data to renderer process
            // event.sender.send('data-fetched', rows);
            // console.log("Sent 'data-fetched' event to renderer process");
            mainWindow.webContents.send('all-tags-fetched', rows);
        });
    })

    ipcMain.on('fetch-data', (event) => {
        console.log("Received 'fetch-data' request from renderer process");
        if (!projectdb) {
            console.error('Database not initialized.');
            return;
        }
        // Query database for user data
        projectdb.all('SELECT * FROM projectdetails', (err, rows) => {
            if (err) {
                console.error('Error fetching data:', err.message);
                return;
            }
            console.log("Fetched data:", rows);
            // Send fetched data to renderer process
            // event.sender.send('data-fetched', rows);
            // console.log("Sent 'data-fetched' event to renderer process");
            mainWindow.webContents.send('data-fetched', rows);
        });
    });



    // ipcMain.on('save-data', (event, data) => {
    //     if (!projectdb) {
    //         console.error('Database not initialized.');
    //         return;
    //     }
    //     const projectFolderName = data.projectName;
    //     const projectFolderPath = path.join(selectedFolderPath, projectFolderName);
    //     try {
    //         // Create a new folder for the project
    //         if (!fs.existsSync(projectFolderPath)) {
    //             fs.mkdirSync(projectFolderPath);
    //             console.log(`Created folder: ${projectFolderPath}`);
    //         }
    //         selectedFolderPath = projectFolderPath;

    //         // Set the database path to the newly created project folder
    //         const dbPath = path.join(projectFolderPath, 'database.db');
    //         createDatabase(dbPath);
    //         // Insert project details into the database
    //         // const projectId = uuid.v4();
    //         const projectId = generateCustomID('P');
    //         projectdb.run('INSERT INTO projectdetails(projectId, projectNumber, projectName, projectDescription, projectPath) VALUES(?, ?, ?,?,?)',
    //             [projectId, data.projectNumber, data.projectName, data.projectDescription, selectedFolderPath],
    //             function (err) {
    //                 if (err) {
    //                     return console.error('Error inserting data:', err.message);
    //                 }
    //                 console.log(`Row inserted with ID: ${this.lastID}`);
    //             });

    //         projectdb.all('SELECT * FROM projectdetails', (err, rows) => {
    //             if (err) {
    //                 console.error('Error fetching data:', err.message);
    //                 return;
    //             }
    //             console.log("Fetched data:", rows);
    //             // Send fetched data to renderer process
    //             event.sender.send('data-fetched', rows);
    //             console.log("Sent 'data-fetched' event to renderer process");
    //         });
    //     } catch (error) {
    //         console.error('Error in save-data handler:', error);
    //         event.reply('save-data-response', { success: false, message: 'Error saving project' });
    //     }

    // });

    ipcMain.on('save-data', (event, data) => {
        if (!projectdb) {
            console.error('Database not initialized.');
            return;
        }

        const projectFolderName = data.projectNumber;
        const projectFolderPath = path.join(selectedFolderPath, projectFolderName);
        const projectId = generateCustomID('P');

        try {
            // Create a new folder for the project if it doesn't exist
            if (!fs.existsSync(projectFolderPath)) {
                fs.mkdirSync(projectFolderPath);
                console.log(`Created folder: ${projectFolderPath}`);
            }
            selectedFolderPath = projectFolderPath;

            // Set the database path to the newly created project folder
            const dbPath = path.join(projectFolderPath, 'database.db');
            createDatabase(dbPath);

            // Check if projectNumber already exists in the database
            projectdb.get('SELECT projectId FROM projectdetails WHERE projectNumber = ?', [data.projectNumber], (err, row) => {
                if (err) {
                    console.error('Error checking project number:', err.message);
                    event.reply('save-data-response', { success: false, message: 'Error saving project' });
                    return;
                }

                if (row) {
                    // Project number already exists
                    mainWindow.webContents.send('save-data-response', { success: false, message: 'Project number already exists' });
                    console.log('Project number already exists');
                    return;
                }

                // Insert project details into the database
                projectdb.run(
                    `INSERT INTO projectdetails (projectId, projectNumber, projectName, projectDescription, projectPath) VALUES (?, ?, ?, ?, ?)`,
                    [projectId, data.projectNumber, data.projectName, data.projectDescription, selectedFolderPath],
                    function (err) {
                        if (err) {
                            console.error('Error inserting data:', err.message);
                            event.reply('save-data-response', { success: false, message: 'Error inserting data into database' });
                        } else {
                            console.log(`Row inserted with ID: ${this.lastID}`);
                            mainWindow.webContents.send('save-data-response', {
                                success: true,
                                message: 'Project saved successfully',
                                project: {
                                    projectId: projectId,
                                    projectNumber: data.projectNumber,
                                    projectName: data.projectName,
                                    projectDescription: data.projectDescription,
                                    projectPath: selectedFolderPath
                                }
                            });
                            projectdb.all('SELECT * FROM projectdetails', (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data:', err.message);
                                    return;
                                }
                                console.log("Fetched data:", rows);
                                mainWindow.webContents.send('data-fetched', rows);
                            });


                            const projectDetails = {
                                projectId: projectId,
                                projectNumber: data.projectNumber,
                                projectName: data.projectName,
                                projectDescription: data.projectDescription,
                                projectPath: selectedFolderPath
                            };

                            const jsonFilePath = path.join(projectFolderPath, 'project_details.json');
                            fs.writeFileSync(jsonFilePath, JSON.stringify(projectDetails, null, 2));
                            console.log(`Project details written to: ${jsonFilePath}`);

                            initializeProjectDatabase(dbPath, mainWindow);
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Error in save-data handler:', error);
            event.reply('save-data-response', { success: false, message: 'Error saving project' });
        }
    });

    ipcMain.on('save-tag-data', (event, data) => {
        console.log("Received request to save tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // const tagId = uuid.v4();
            const tagId = generateCustomID('T');
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO Tags (tagId,tagNumber,tagName,tagType) VALUES (?,?,?,?)', [tagId, data.tagNumber, data.tagName, data.tagType], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with tag number: ${data.tagNumber}`);
            });

            projectDb.run('INSERT INTO TagInfo (tagId,tag,type) VALUES (?,?,?)', [tagId, data.tagNumber, data.tagType], function (err) {
                if (err) {
                    console.error('Error inserting data into tagInfo table:', err.message);
                    return;
                }
                console.log(`Row inserted into tagInfo table with tag number: ${data.tagNumber}`);
            });


            // Based on tagtype, insert data into either LineList or EquipmentList table
            if (data.tagType === 'Line') {
                console.log("line");
                projectDb.run('INSERT INTO LineList (tagId,tag) VALUES (?,?)', [tagId, data.tagNumber], function (err) {
                    if (err) {
                        console.error('Error inserting data into LineList table:', err.message);
                        return;
                    }
                    console.log(`Row inserted into LineList table with tag number: ${data.tagNumber}`);
                    projectDb.all("SELECT * FROM LineList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the LineList table:', rows);
                        mainWindow.webContents.send('all-line-fetched', rows);
                    });
                    projectDb.all("SELECT * FROM Tags", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }
        
                        console.log('Data in the Tag table:', rows);
                        mainWindow.webContents.send('all-tags-fetched', rows);
                    });
        
        
                    projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }
        
                        console.log('Data in the TagInfo table:', rows);
                        mainWindow.webContents.send('all-taginfo-fetched', rows);
                    });
                });

            } else if (data.tagType === 'Equipment') {
                console.log("Equipement");
                projectDb.run('INSERT INTO EquipmentList (tagId,tag) VALUES (?,?)', [tagId, data.tagNumber], function (err) {
                    if (err) {
                        console.error('Error inserting data into EquipmentList table:', err.message);
                        return;
                    }
                    console.log(`Row inserted into EquipmentList table with tag number: ${data.tagNumber}`);
                    projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        console.log('Data in the EquipmentList table:', rows);
                        mainWindow.webContents.send('all-equ-fetched', rows);
                    });
                    projectDb.all("SELECT * FROM Tags", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }
        
                        console.log('Data in the Tag table:', rows);
                        mainWindow.webContents.send('all-tags-fetched', rows);
                    });
        
        
                    projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }
        
                        console.log('Data in the TagInfo table:', rows);
                        mainWindow.webContents.send('all-taginfo-fetched', rows);
                    });
                });

            } else {
                console.error('Invalid tag type:', data.tagtype);
            }
            // projectDb.all("SELECT * FROM Tags", (err, rows) => {
            //     if (err) {
            //         console.error('Error fetching data from Tree table:', err.message);
            //         return;
            //     }

            //     console.log('Data in the Tag table:', rows);
            //     mainWindow.webContents.send('all-tags-fetched', rows);
            // });


            // projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
            //     if (err) {
            //         console.error('Error fetching data from Tree table:', err.message);
            //         return;
            //     }

            //     console.log('Data in the TagInfo table:', rows);
            //     mainWindow.webContents.send('all-taginfo-fetched', rows);
            // });
        });
    })



    ipcMain.on('delete-all-project', (event,) => {
        console.log("receive delete message")
        if (!projectdb) {
            console.error('Project database not initialized.');
            return;
        }
        deleteAllProjectDetails();

    });

    ipcMain.on('delete-project', (event, projectNumber) => {
        console.log("receive delete message")

        // Check if the project database is initialized
        if (!projectdb) {
            console.error('Project database not initialized.');
            return;
        }
        deleteProjectDetails(projectNumber);

    });


    ipcMain.on('save-ele-tag', (event, data) => {
        console.log("Received request to save tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO Elements (elementId,tagNumber,filename) VALUES (?,?,?)', [data.elementId, data.tagNumber, data.filename], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with element id: ${data.elementId}`);
            });

            projectDb.all("SELECT * FROM Elements", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Elements table:', rows);
                mainWindow.webContents.send('all-elements-fetched', rows);
            });
        });
    })


    ipcMain.on('save-layer', (event, data) => {
        console.log("Received request to save layer");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO Layers (areaNumber,  x, y, width, height,  docId) VALUES (?,?,?,?,?,?)', [data.areaNumber, data.x, data.y, data.width, data.height, data.docId], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with areaNNumber: ${data.areaNumber}`);
            });

            projectDb.all("SELECT * FROM Layers", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Layers table:', rows);
                mainWindow.webContents.send('all-layers-fetched', rows);
            });
        });
    })



    ipcMain.on('save-flag-ele', (event, data) => {
        console.log("Received request to save tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Insert data into the Flags table of the project's database
            // const flagId = uuid.v4();
            const flagId = generateCustomID('F');
            projectDb.serialize(() => {
                const stmt = projectDb.prepare('INSERT INTO Flags (flagId, elementId, parentDoc, connectDoc) VALUES (?, ?, ?, ?)');
                data.elementIds.forEach(elementId => {
                    stmt.run([flagId, elementId, data.parentDoc, data.connectDoc], (err) => {
                        if (err) {
                            console.error('Error inserting data:', err.message);
                        } else {
                            console.log(`Row inserted with element id: ${elementId}`);
                        }
                    });
                });
                stmt.finalize();

                // Fetch all data from the Flags table after insertion
                projectDb.all("SELECT * FROM Flags", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from Flags table:', err.message);
                        return;
                    }

                    console.log('Data in the Flags table:', rows);
                    mainWindow.webContents.send('all-flags-fetched', rows);
                });
            });
        });
    });




    ipcMain.on('save-doc-data', (event, data) => {
        console.log("Received request to save document");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }


            // const docId = uuid.v4();
            const docId = generateCustomID('D');
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO Documents (docId,number,title,descr,type,filename) VALUES (?,?,?,?,?,?)', [docId, data.number, data.title, data.descr, data.type, data.filename], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log(`Row inserted with document number: ${data.number}`);
            });
            // Create a folder named 'Documents' in the project folder
            const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
            if (!fs.existsSync(documentsFolderPath)) {
                fs.mkdirSync(documentsFolderPath);
                console.log('Documents folder created.');
            }

            // Move the file into the 'Documents' folder
            const fileToMove = data.filePath;
            const fileName = path.basename(fileToMove);
            const destinationPath = path.join(documentsFolderPath, fileName);
            fs.copyFileSync(fileToMove, destinationPath);
            console.log(`File '${fileName}' moved to 'Documents' folder.`);


            projectDb.all("SELECT * FROM Documents", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Documents table:', rows);
                mainWindow.webContents.send('all-docs-fetched', rows);
            });
            projectDb.all("SELECT * FROM Documents WHERE type = ?", ["iXB"], (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Documents table:', err.message);
                    return;
                }

                console.log('Data in the Documents table:', rows);
                mainWindow.webContents.send('spid-docs-fetched', rows);
            });
        });
    });


    ipcMain.on('fetch-sin-doc', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT filename FROM Documents WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('tag-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
                    const filePath = path.join(documentsFolderPath, row.filename);

                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', { success: true, filePath: filePath });
                        mainWindow.webContents.send('sin-doc-fetched', filePath);
                        projectDb.all("SELECT * FROM CommentStatus", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from CommentStatus table:', err.message);
                                return;
                            }
                            mainWindow.webContents.send('all-comments-fetched', rows);
                        });
                    } else {
                        console.error('File not found in Documents folder');
                        event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                    }
                } else {
                    console.error('Document not found in database');
                    event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                }
            });
        });
    });

    ipcMain.on('fetch-condoc-path', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT filename FROM Documents WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('tag-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
                    const filePath = path.join(documentsFolderPath, row.filename);

                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', { success: true, filePath: filePath });
                        mainWindow.webContents.send('condoc-path-fetched', filePath);
                    } else {
                        console.error('File not found in Documents folder');
                        event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                    }

                } else {
                    console.error('Document not found in database');
                    event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                }
            });
        });
    });

    ipcMain.on('fetch-sin-ele', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    // event.sender.send('doc-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    console.log(`Element details: ${row}`);
                    // event.sender.send('doc-found', { success: true, filePath: filePath });
                    mainWindow.webContents.send('sin-ele-fetched', row);
                } else {
                    console.error('Element not found in Elements table');
                    // event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                }
                // } 
                // else {
                //     console.error('Document not found in database');
                //     event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                // }
            });
        });
    });


    ipcMain.on('tag-doc-con', (event, tagNumber) => {
        console.log("Received request to search filename by tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Elements WHERE tagNumber = ?', [tagNumber], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    // event.sender.send('doc-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    console.log(`Element details: ${row}`);
                    // event.sender.send('doc-found', { success: true, filePath: filePath });
                    mainWindow.webContents.send('con-doc-tag', row);
                } else {
                    console.error('Element not found in Elements table');
                    // event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                }
                // } 
                // else {
                //     console.error('Document not found in database');
                //     event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                // }
            });
        });
    });

    ipcMain.on('tag-doc-det', (event, filename) => {
        console.log("Received request to search document by filename");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Documents WHERE filename = ?', [filename], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    // event.sender.send('doc-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    console.log(`Documents details: ${row}`);
                    // event.sender.send('doc-found', { success: true, filePath: filePath });
                    mainWindow.webContents.send('det-doc-tag', row);
                } else {
                    console.error('Documents not found in Documents table');
                    // event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                }
                // } 
                // else {
                //     console.error('Document not found in database');
                //     event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                // }
            });
        });
    });

    ipcMain.on('show-doc-area', (event, docId) => {
        console.log("Received request to search area by docId");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Layers WHERE docId = ?', [docId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    // event.sender.send('doc-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    console.log(`Area details: ${row}`);
                    // event.sender.send('doc-found', { success: true, filePath: filePath });
                    mainWindow.webContents.send('doc-area-fetched', row);
                } else {
                    console.error('Element not found in Elements table');
                    // event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                }
            });
        });
    });

    ipcMain.on('is-element-tag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            projectDb.get('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    mainWindow.webContents.send('element-tag-is', row);
                } else {
                    console.error('Element not found in Elements table');
                }

            });
        });
    });



    ipcMain.on('fetch-con-doc', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Flags WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }

                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('con-doc-fetched', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });




    ipcMain.on('fetch-tag-ele', (event, tagNumber) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Elements WHERE tagNumber = ?', [tagNumber], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    mainWindow.webContents.send('tag-ele-fetched', row);
                } else {
                    console.error('Element not found in Elements table');
                }
            });
        });
    });

    ipcMain.on('is-ele-tag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    mainWindow.webContents.send('tag-ele-is', row);
                } else {
                    console.error('Element not found in Elements table');
                }
            });
        });
    });




    ipcMain.on('sel-tag-ele', (event, tagNumber) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Elements WHERE tagNumber = ?', [tagNumber], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    mainWindow.webContents.send('ele-tag-sel', row);
                } else {
                    console.error('Element not found in Elements table');
                }
            });
        });
    });




    ipcMain.on('fetch-sin-docdetails', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Documents WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Document details: ${row}`);
                    mainWindow.webContents.send('sin-docdetails-fetched', row);
                } else {
                    console.error('Document not found in Documents table');
                }
            });
        });
    });

    ipcMain.on('fetch-sin-flag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('sin-flag-fetched', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('double-sin-flag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('sin-flag-double', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('fetch-flag-tag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('flag-tag-fetched', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });



    ipcMain.on('sin-flag-conflag', (event, connectFlag) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE connectFlag = ?', [connectFlag], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('flag-conflag-sin', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('ele-flag-sel', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    // console.log(`Flag details: ${row}`);
                    // if (row.length > 0) {
                    //     const flagId = row[0].flagId
                    //     projectDb.all('SELECT * FROM Flags WHERE flagId = ?', [flagId], (err, frow) => {
                    //         if (err) {
                    //             console.error('Error querying the database:', err.message);
                    //             return;
                    //         }
                    //         if (frow) {
                    //             console.log(`Flag details: ${frow}`);
                    //             mainWindow.webContents.send('sel-flag-ele', frow);
                    //         } else {
                    //             console.error('Flag not found in Flags table');
                    //         }
                    //     });
                    // }


                    mainWindow.webContents.send('ele-flag-out', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('flag-dou-sel', (event, flagId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE flagId = ?', [flagId], (err, frow) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (frow) {
                    console.log(`Flag details: ${frow}`);
                    mainWindow.webContents.send('sel-flag-ele', frow);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });

    });




    ipcMain.on('fetch-info-tag', (event, tag) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM TagInfo WHERE tag = ?', [tag], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    mainWindow.webContents.send('info-tag-fetched', row);
                } else {
                    console.error('Element not found in Elements table');
                }
            });
        });
    });



    ipcMain.on('save-area-data', (event, data) => {
        console.log("Received request to save tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // db.run("CREATE TABLE IF NOT EXISTS Tags ( tagId TEXT,tagNumber TEXT, tagName TEXT, tagType TEXT)");
            // const areaId = uuid.v4();
            const areaId = generateCustomID('A');
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO Area (areaId,areaNumber,areaName) VALUES (?,?,?)', [areaId, data.areaNumber, data.areaName], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log('Row inserted with Area number: ${data.areaNumber}');
                projectDb.all("SELECT * FROM Area", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from Tree table:', err.message);
                        return;
                    }

                    console.log('Data in the Area table:', rows);
                    mainWindow.webContents.send('all-area-fetched', rows);
                });
            });
        });
    })

    ipcMain.on('update-linelist-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        console.log(updatedData);
        // Extracting updated data
        const { tag, fluidCode, lineId, medium, lineSizeIn, lineSizeNb, pipingSpec, insType, insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup, chemCleaning, pwht } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE LineList SET fluidCode = ?, lineId = ?, medium = ?, lineSizeIn = ?, lineSizeNb = ?,pipingSpec = ?,insType = ?,insThickness = ?,heatTrace = ?,lineFrom = ? ,lineTo = ?,maxOpPress = ?,maxOpTemp = ?,dsgnPress = ? ,minDsgnTemp = ?,maxDsgnTemp = ? ,testPress = ? ,testMedium = ?,testMediumPhase = ?,massFlow = ?,volFlow = ? ,density = ?, velocity = ?,paintSystem = ?,ndtGroup = ? ,chemCleaning = ? ,pwht = ?  WHERE tag = ?',
                [fluidCode, lineId, medium, lineSizeIn, lineSizeNb, pipingSpec, insType, insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup, chemCleaning, pwht, tag],
                (err) => {
                    if (err) {
                        console.error('Error updating LineList table:', err.message);
                        return;
                    }

                    console.log('LineList table updated successfully.');
                    projectDb.get(
                        'SELECT * FROM LineList WHERE tag = ?',
                        [tag],
                        (err, row) => {
                            if (err) {
                                console.error('Error retrieving updated row:', err.message);
                                return;
                            }

                            console.log('Updated row:', row);
                        }
                    );
                }
            );

            // Fetch updated data from the LineList table
            projectDb.all("SELECT * FROM LineList", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from LineList table:', err.message);
                    return;
                }

                mainWindow.webContents.send('all-line-fetched', rows);
            });
        });
    });

    ipcMain.on('update-comment-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        console.log(updatedData);
        // Extracting updated data
        const { statusname, color } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE CommentStatus SET statusname = ?, color = ? WHERE statusname = ?',
                [statusname, color],
                (err) => {
                    if (err) {
                        console.error('Error updating CommentStatus table:', err.message);
                        return;
                    }

                    console.log('CommentStatus table updated successfully.');
                    // projectDb.get(
                    //     'SELECT * FROM CommentStatus WHERE tag = ?',
                    //     [tag],
                    //     (err, row) => {
                    //         if (err) {
                    //             console.error('Error retrieving updated row:', err.message);
                    //             return;
                    //         }

                    //         console.log('Updated row:', row);
                    //     }
                    // );
                }
            );

            // Fetch updated data from the CommentStatus table
            projectDb.all("SELECT * FROM CommentStatus", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from CommentStatus table:', err.message);
                    return;
                }

                mainWindow.webContents.send('all-comments-fetched', rows);
            });
        });
    });

    ipcMain.on('update-check-sta', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        console.log(updatedData);
        // Extracting updated data
        const { id, statuscheck } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE UserTagInfoFieldUnits SET statuscheck = ? WHERE id = ?',
                [statuscheck,id],
                (err) => {
                    if (err) {
                        console.error('Error updating UserTagInfoFieldUnits table:', err.message);
                        return;
                    }

                    console.log('UserTagInfoFieldUnits table updated successfully.');
                    // Fetch updated data from the UserTagInfoFieldUnits table
                    projectDb.all("SELECT * FROM UserTagInfoFieldUnits", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from UserTagInfoFieldUnits table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-fields-user-defined', rows);
                    });
                }
            );


        });
    });



    ipcMain.on('update-equlist-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Extracting updated data
        const {
            tag, descr, qty, capacity, type, materials, capacityDuty, dims, dsgnPress, opPress, dsgnTemp, opTemp, dryWeight, opWeight, supplier, remarks, initStatus, revision, revisionDate } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run(`UPDATE EquipmentList SET 
                descr = ?, qty = ?, capacity = ?, type = ?, materials = ?, 
                capacityDuty = ?, dims = ?, dsgnPress = ?, opPress = ?, 
                dsgnTemp = ?, opTemp = ?, dryWeight = ?, opWeight = ?, 
                supplier = ?, remarks = ?, initStatus = ?, revision = ?, 
                revisionDate = ? WHERE tag = ?`,
                [
                    descr, qty, capacity, type, materials,
                    capacityDuty, dims, dsgnPress, opPress,
                    dsgnTemp, opTemp, dryWeight, opWeight,
                    supplier, remarks, initStatus, revision,
                    revisionDate, tag
                ],
                (err) => {
                    if (err) {
                        console.error('Error updating EquipmentList table:', err.message);
                        return;
                    }

                    console.log('EquipmentList table updated successfully.');
                    projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }

                        mainWindow.webContents.send('all-equ-fetched', rows);
                    });

                }
            );

        });
    });



    ipcMain.on('update-taginfo-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        console.log(updatedData);
        // Extracting updated data
        const { taginfo1, taginfo2, taginfo3, taginfo4, taginfo5, taginfo6, taginfo7, taginfo8, taginfo9, taginfo10, taginfo11, taginfo12, taginfo13, taginfo14, taginfo15, taginfo16, taginfo17, taginfo18, taginfo19, taginfo20, taginfo21, taginfo22, taginfo23, taginfo24, taginfo25, taginfo26, taginfo27, taginfo28, taginfo29, taginfo30, taginfo31, taginfo32, taginfo33, taginfo34, taginfo35, taginfo36, taginfo37, taginfo38, taginfo39, taginfo40, taginfo41, taginfo42, taginfo43, taginfo44, taginfo45, taginfo46, taginfo47, taginfo48, taginfo49, taginfo50, tagId } = updatedData;
        console.log(tagId);

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE tagInfo SET taginfo1 = ? ,taginfo2 = ? ,taginfo3 = ? ,taginfo4 = ? ,taginfo5 = ?, taginfo6 = ?,taginfo7 = ?,taginfo8 = ?,taginfo9 = ?,taginfo10 = ?,taginfo11 = ? ,taginfo12 = ? ,taginfo13 = ? ,taginfo14 = ? ,taginfo15 = ?, taginfo16 = ?,taginfo17 = ?,taginfo18 = ?,taginfo19 = ?,taginfo20 = ?,taginfo21 = ? ,taginfo22 = ? ,taginfo23 = ? ,taginfo24 = ? ,taginfo25 = ?, taginfo26 = ?,taginfo27 = ?,taginfo28 = ?,taginfo29 = ?,taginfo30 = ?,taginfo31 = ? ,taginfo32 = ? ,taginfo33 = ? ,taginfo34 = ? ,taginfo35 = ?, taginfo36 = ?,taginfo37 = ?,taginfo38 = ?,taginfo39 = ?,taginfo40 = ?,taginfo41 = ? ,taginfo42 = ? ,taginfo43 = ? ,taginfo44 = ? ,taginfo45 = ?, taginfo46 = ?,taginfo47 = ?,taginfo48 = ?,taginfo49 = ?,taginfo50 = ? WHERE tagId = ?',
                [taginfo1, taginfo2, taginfo3, taginfo4, taginfo5, taginfo6, taginfo7, taginfo8, taginfo9, taginfo10, taginfo11, taginfo12, taginfo13, taginfo14, taginfo15, taginfo16, taginfo17, taginfo18, taginfo19, taginfo20, taginfo21, taginfo22, taginfo23, taginfo24, taginfo25, taginfo26, taginfo27, taginfo28, taginfo29, taginfo30, taginfo31, taginfo32, taginfo33, taginfo34, taginfo35, taginfo36, taginfo37, taginfo38, taginfo39, taginfo40, taginfo41, taginfo42, taginfo43, taginfo44, taginfo45, taginfo46, taginfo47, taginfo48, taginfo49, taginfo50, tagId],
                (err) => {
                    if (err) {
                        console.error('Error updating tagInfo table:', err.message);
                        return;
                    }

                    console.log('tagInfo table updated successfully.');
                    projectDb.get(
                        'SELECT * FROM tagInfo WHERE tagId = ?',
                        [tagId],
                        (err, row) => {
                            if (err) {
                                console.error('Error retrieving updated row:', err.message);
                                return;
                            }

                            console.log('Updated row:', row);
                        }
                    );
                }
            );

            // Fetch updated data from the LineList table
            projectDb.all("SELECT * FROM tagInfo", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from tagInfo table:', err.message);
                    return;
                }

                mainWindow.webContents.send('all-taginfo-fetched', rows);
            });
        });
    });


    // ipcMain.on('update-taginfo-table', (event, updatedData) => {
    //     console.log("Received update message");
    //     if (!databasePath) {
    //         console.error('Project database path not available.');
    //         return;
    //     }

    //     // Extracting updated data
    //     const { tag, taginfo1, taginfo2, taginfo3, taginfo4, taginfo5, taginfo6, taginfo7, taginfo8, taginfo9, taginfo10, taginfo11, taginfo12, taginfo13, taginfo14, taginfo15, taginfo16, taginfo17 } = updatedData;

    //     // Open the project's database
    //     const projectDb = new sqlite3.Database(databasePath, (err) => {
    //         if (err) {
    //             console.error('Error opening project database:', err.message);
    //             return;
    //         }

    //         // Update the record in the database
    //         projectDb.run('UPDATE tagInfo SET taginfo1 = ? ,taginfo2 = ? ,taginfo3 = ? ,taginfo4 = ? ,taginfo5 = ?,,taginfo6=? ,taginfo7=? ,taginfo8=? ,taginfo9=? ,taginfo10=? ,taginfo11=? ,taginfo12=? ,taginfo13=? ,taginfo14=? ,taginfo15=? ,taginfo16=? ,taginfo17=? WHERE tag = ?',
    //             [taginfo1, taginfo2, taginfo3, taginfo4, taginfo5, taginfo6, taginfo7, taginfo8, taginfo9, taginfo10, taginfo11, taginfo12, taginfo13, taginfo14, taginfo15, taginfo16, taginfo17, tag],
    //             (err) => {
    //                 if (err) {
    //                     console.error('Error updating tagInfo table:', err.message);
    //                     return;
    //                 }

    //                 console.log('tagInfo table updated successfully.');
    //                 projectDb.get(
    //                     'SELECT * FROM tagInfo WHERE tag = ?',
    //                     [tag],
    //                     (err, row) => {
    //                         if (err) {
    //                             console.error('Error retrieving updated row:', err.message);
    //                             return;
    //                         }

    //                         console.log('Updated row:', row);
    //                     }
    //                 );
    //             }
    //         );

    //         // Fetch updated data from the tagInfo table
    //         projectDb.all("SELECT * FROM tagInfo", (err, rows) => {
    //             if (err) {
    //                 console.error('Error fetching data from tagInfo table:', err.message);
    //                 return;
    //             }

    //             mainWindow.webContents.send('all-taginfo-fetched', rows);
    //         });
    //     });
    // });



    ipcMain.on('remove-line-table', (event, tagNumber) => {
        console.log("Received delete message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch the table schema to get all column names except 'tag'
            projectDb.all("PRAGMA table_info(LineList)", (err, columns) => {
                if (err) {
                    console.error('Error fetching table info:', err.message);
                    return;
                }

                // Prepare the list of columns to set to NULL
                const updateColumns = columns
                    .map(col => col.name)
                    .filter(colName => colName !== 'tag')
                    .map(colName => `${colName} = NULL`)
                    .join(', ');

                // Update the row to set all columns except 'tag' to NULL
                projectDb.run(`UPDATE LineList SET ${updateColumns} WHERE tag = ?`, [tagNumber], (err) => {
                    if (err) {
                        console.error('Error updating LineList table:', err.message);
                        return;
                    }

                    // Fetch and send updated data to the renderer process
                    projectDb.all("SELECT * FROM LineList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from LineList table:', err.message);
                            return;
                        }

                        console.log('Data in the LineList table:', rows);
                        mainWindow.webContents.send('all-line-fetched', rows);
                    });
                });
            });
        });
    });

    ipcMain.on('remove-equipement-table', (event, tagNumber) => {
        console.log("Received delete message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch the table schema to get all column names except 'tag'
            projectDb.all("PRAGMA table_info(EquipmentList)", (err, columns) => {
                if (err) {
                    console.error('Error fetching table info:', err.message);
                    return;
                }

                // Prepare the list of columns to set to NULL
                const updateColumns = columns
                    .map(col => col.name)
                    .filter(colName => colName !== 'tag')
                    .map(colName => `${colName} = NULL`)
                    .join(', ');

                // Update the row to set all columns except 'tag' to NULL
                projectDb.run(`UPDATE EquipmentList SET ${updateColumns} WHERE tag = ?`, [tagNumber], (err) => {
                    if (err) {
                        console.error('Error updating EquipmentList table:', err.message);
                        return;
                    }

                    // Fetch and send updated data to the renderer process
                    projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from EquipmentList table:', err.message);
                            return;
                        }

                        console.log('Data in the EquipmentList table:', rows);
                        mainWindow.webContents.send('all-equ-fetched', rows);
                    });
                });
            });
        });
    });

    ipcMain.on('delete-taginfoname-row', (event, indexNumber) => {
        console.log("Received delete message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch the table schema to get all column names except 'tag'
            projectDb.all("PRAGMA table_info(TagInfoName)", (err, columns) => {
                if (err) {
                    console.error('Error fetching table info:', err.message);
                    return;
                }

                // Prepare the list of columns to set to NULL
                // const updateColumns = columns
                //     .map(col => col.name)
                //     .filter(colName => colName !== 'tag')
                //     .map(colName => `${colName} = NULL`)
                //     .join(', ');

                // Update the row to set all columns except 'tag' to NULL
                projectDb.run(`DELETE FROM TagInfoName WHERE  id= ?`, [indexNumber], (err) => {
                    if (err) {
                        console.error('Error updating TagInfoName table:', err.message);
                        return;
                    }

                    // Fetch and send updated data to the renderer process
                    projectDb.all("SELECT * FROM TagInfoName", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from TagInfoName:', err.message);
                            return;
                        }

                        console.log('Data in the TagInfoName table:', rows);
                        mainWindow.webContents.send('all-taginfoname-fetched', rows);
                    });
                });
            });
        });
    });


    ipcMain.on('remove-taginfo-table', (event, tagNumber) => {
        console.log("Received delete message", tagNumber);
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch the table schema to get all column names except 'tag'
            projectDb.all("PRAGMA table_info(TagInfo)", (err, columns) => {
                if (err) {
                    console.error('Error fetching table info:', err.message);
                    return;
                }

                // Prepare the list of columns to set to NULL
                const updateColumns = columns
                    .map(col => col.name)
                    .filter(colName => colName !== 'tagId' && colName !== 'tag' && colName !== 'type')
                    .map(colName => `${colName} = NULL`)
                    .join(', ');

                // Update the row to set all columns except 'tag' to NULL
                projectDb.run(`UPDATE TagInfo SET ${updateColumns} WHERE tagId = ?`, [tagNumber], (err) => {
                    if (err) {
                        console.error('Error updating TagInfo table:', err.message);
                        return;
                    }

                    // Fetch and send updated data to the renderer process
                    projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from TagInfo table:', err.message);
                            return;
                        }

                        console.log('Data in the TagInfo table:', rows);
                        mainWindow.webContents.send('all-taginfo-fetched', rows);
                    });
                });
            });
        });
    });




    // ipcMain.on('remove-taginfo-table', (event, tagNumber) => {
    //     console.log("Received delete message");
    //     if (!databasePath) {
    //         console.error('Project database path not available.');
    //         return;
    //     }

    //     // Open the project's database
    //     const projectDb = new sqlite3.Database(databasePath, (err) => {
    //         if (err) {
    //             console.error('Error opening project database:', err.message);
    //             return;
    //         }

    //         // Fetch the table schema to get all column names except 'tag'
    //         projectDb.all("PRAGMA table_info(taginfo)", (err, columns) => {
    //             if (err) {
    //                 console.error('Error fetching table info:', err.message);
    //                 return;
    //             }

    //             // Prepare the list of columns to set to NULL
    //             const updateColumns = columns
    //                 .map(col => col.name)
    //                 .filter(colName => colName !== 'tag' && colName !== 'type')
    //                 .map(colName => `${colName} = NULL`)
    //                 .join(', ');

    //             // Update the row to set all columns except 'tag' to NULL
    //             projectDb.run(`UPDATE tagInfo SET ${updateColumns} WHERE tag = ?`, [tagNumber], (err) => {
    //                 if (err) {
    //                     console.error('Error updating tagInfo table:', err.message);
    //                     return;
    //                 }

    //                 // Fetch and send updated data to the renderer process
    //                 projectDb.all("SELECT * FROM tagInfo", (err, rows) => {
    //                     if (err) {
    //                         console.error('Error fetching data from tagInfo table:', err.message);
    //                         return;
    //                     }

    //                     console.log('Data in the tagInfo table:', rows);
    //                     mainWindow.webContents.send('all-taginfo-fetched', rows);
    //                 });
    //             });
    //         });
    //     });
    // });

    ipcMain.on('update-flag-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Extracting updated data
        const { connectFlag, flagId } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE Flags SET connectFlag = ? WHERE flagId = ?',
                [connectFlag, flagId],
                (err) => {
                    if (err) {
                        console.error('Error updating Flags table:', err.message);
                        return;
                    }

                    console.log('Flags table updated successfully.');
                    projectDb.all(
                        'SELECT * FROM Flags WHERE flagId = ?',
                        [flagId],
                        (err, row) => {
                            if (err) {
                                console.error('Error retrieving updated row:', err.message);
                                return;
                            }

                            console.log('Updated row:', row);
                        }
                    );
                }
            );


            projectDb.all("SELECT * FROM Flags", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Flags table:', rows);
                mainWindow.webContents.send('all-flags-fetched', rows);
            });
        });
    });

    ipcMain.on('update-flag-tag', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Extracting updated data
        const { adjTag, flagId } = updatedData;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE Flags SET adjTag = ? WHERE flagId = ?',
                [adjTag, flagId],
                (err) => {
                    if (err) {
                        console.error('Error updating Flags table:', err.message);
                        return;
                    }

                    console.log('Flags table updated successfully.');
                    projectDb.all(
                        'SELECT * FROM Flags WHERE flagId = ?',
                        [flagId],
                        (err, row) => {
                            if (err) {
                                console.error('Error retrieving updated row:', err.message);
                                return;
                            }

                            console.log('Updated row:', row);
                        }
                    );
                }
            );

            projectDb.all("SELECT * FROM Flags", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Flags table:', rows);
                mainWindow.webContents.send('flag-tag-updated', rows);
            });
        });
    })

    ipcMain.on('update-unflag-table', (event, flagId) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        // const { flagId, connectFlag } = updatedData
        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE Flags SET connectFlag = ? WHERE flagId = ?',
                ['', flagId],
                (err) => {
                    if (err) {
                        console.error('Error updating Flags table:', err.message);
                        return;
                    }

                    console.log('Flags table updated successfully.');
                    projectDb.all(
                        'SELECT * FROM Flags WHERE flagId = ?',
                        [flagId],
                        (err, row) => {
                            if (err) {
                                console.error('Error retrieving updated row:', err.message);
                                return;
                            }

                            console.log('Updated row:', row);
                        }
                    );
                }
            );

            projectDb.all("SELECT * FROM Flags", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the Flags table:', rows);
                mainWindow.webContents.send('all-flags-fetched', rows);
            });
        });
    });





    ipcMain.on('unflag-ele-flag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all('SELECT * FROM Flags WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('ele-flag-unflag', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });




    ipcMain.on('fetch-doc-flag', (event, parentDoc) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Flags WHERE parentDoc = ?', [parentDoc], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Flag details: ${row}`);
                    mainWindow.webContents.send('doc-flag-fetched', row);
                } else {
                    console.error('Flag not found in Flags table');
                }
            });
        });
    });

    ipcMain.on('save-areatag-rel', (event, data) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('INSERT INTO PidAreaTag (tagNumber,areaNumber) VALUES (?,?)', [data.tagNumber, data.areaNumber], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log('Row inserted with status: ${data.statusname}');
            });
            projectDb.all("SELECT * FROM PidAreaTag", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the PidAreaTag table:', rows);
                mainWindow.webContents.send('areatag-rel', rows);
            });
        });
    });

    ipcMain.on('del-ele-tag', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    const tagNumber = row.tagNumber
                    projectDb.get('DELETE FROM Elements WHERE tagNumber = ?', [tagNumber], (err) => {
                        if (err) {
                            console.error('Error deleting from Tags table:', err.message);
                            projectDb.close();
                            return;
                        }
                        else {
                            projectDb.all("SELECT * FROM Elements", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from Tree table:', err.message);
                                    return;
                                }

                                console.log('Data in the Elements table:', rows);
                                mainWindow.webContents.send('all-elements-fetched', rows);
                            });
                        }
                    });

                } else {
                    console.error('Flag not found in Flags table');
                }
            });

        });
    });

    ipcMain.on('ele-tag-type', (event, elementId) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Elements WHERE elementId = ?', [elementId], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Element details: ${row}`);
                    const tag = row.tagNumber
                    projectDb.get('SELECT * FROM TagInfo WHERE tag = ?', [tag], (err, rows) => {
                        if (err) {
                            console.error('Error querying the database:', err.message);
                            return;
                        }
                        if (rows) {
                            console.log(`TagInfo details: ${rows}`);
                            mainWindow.webContents.send('info-tag-fetched', rows);
                        } else {
                            console.error('tag not found in TagInfo table');
                        }

                    });

                    projectDb.get('SELECT * FROM EquipmentList WHERE tag = ?', [tag], (err, erows) => {
                        if (err) {
                            console.error('Error querying the database:', err.message);
                            return;
                        }
                        if (erows) {
                            console.log(`Equipment details: ${erows}`);
                            mainWindow.webContents.send('equ-type-details', erows);
                        } else {
                            console.error('tag not found in EquipmentList table');
                        }

                    });

                    projectDb.get('SELECT * FROM LineList WHERE tag = ?', [tag], (err, erows) => {
                        if (err) {
                            console.error('Error querying the database:', err.message);
                            return;
                        }
                        if (erows) {
                            console.log(`Line details: ${erows}`);
                            mainWindow.webContents.send('line-type-details', erows);
                        } else {
                            console.error('tag not found in LineList table');
                        }

                    });


                } else {
                    console.error('Flag not found in Flags table');
                }
            });

        });
    });

    // ipcMain.on('import-equipment-list', async () => {
    //     const result = await dialog.showOpenDialog({
    //         properties: ['openFile'],
    //         filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
    //     });

    //     if (result.canceled) return;

    //     const filePath = result.filePaths[0];
    //     const workbook = xlsx.readFile(filePath);
    //     const sheetName = workbook.SheetNames[0];
    //     const sheet = workbook.Sheets[sheetName];
    //     const equipmentList = xlsx.utils.sheet_to_json(sheet);

    //     const projectDb = new sqlite3.Database(databasePath, (err) => {
    //         if (err) {
    //             console.error('Error opening project database:', err.message);
    //             return;
    //         }

    //         equipmentList.forEach((equipment) => {
    //             const { tag, descr, qty, capacity, type, materials, capacityDuty, dims, dsgnPress, opPress, dsgnTemp, opTemp, dryWeight, opWeight, supplier, remarks, initStatus, revision, revisionDate } = equipment;

    //             // Insert into EquipmentList
    //             projectDb.run(
    //                 `INSERT OR IGNORE INTO EquipmentList (tag, descr, qty, capacity, type, materials, capacityDuty, dims, dsgnPress, opPress, dsgnTemp, opTemp, dryWeight, opWeight, supplier, remarks, initStatus, revision, revisionDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //                 [tag, descr, qty, capacity, type, materials, capacityDuty, dims, dsgnPress, opPress, dsgnTemp, opTemp, dryWeight, opWeight, supplier, remarks, initStatus, revision, revisionDate],
    //                 (err) => {
    //                     if (err) {
    //                         console.error('Error inserting data into EquipmentList:', err.message);
    //                         return;
    //                     }
    //                     console.log(`Row inserted into EquipmentList with tag: ${tag}`);
    //                     // Fetch and send updated data back to renderer
    //                     projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
    //                         if (err) {
    //                             console.error('Error fetching data from EquipmentList table:', err.message);
    //                             return;
    //                         }
    //                         mainWindow.webContents.send('all-equ-fetched', rows);
    //                     });

    //                 }
    //             );


    //             projectDb.run(
    //                 'INSERT OR IGNORE INTO TagInfo (tag,type) VALUES (?,?)',
    //                 [tag, 'Equipment'],
    //                 (err) => {
    //                     if (err) {
    //                         console.error('Error inserting data into Tags:', err.message);
    //                         return;
    //                     }
    //                     console.log(`Row inserted into Tags with tag number: ${tag}`);
    //                     projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
    //                         if (err) {
    //                             console.error('Error fetching data from TagInfo table:', err.message);
    //                             return;
    //                         }
    //                         mainWindow.webContents.send('all-taginfo-fetched', rows);
    //                     });
    //                 }
    //             );

    //             // Insert into Tags
    //             const tagId = uuid.v4();

    //             projectDb.run(
    //                 'INSERT OR IGNORE INTO Tags (tagId,tagNumber,tagType) VALUES (?,?,?)',
    //                 [tagId, tag, 'Equipment'],
    //                 (err) => {
    //                     if (err) {
    //                         console.error('Error inserting data into Tags:', err.message);
    //                         return;
    //                     }
    //                     console.log(`Row inserted into Tags with tag number: ${tag}`);
    //                     projectDb.all("SELECT * FROM Tags", (err, rows) => {
    //                         if (err) {
    //                             console.error('Error fetching data from Tags table:', err.message);
    //                             return;
    //                         }
    //                         mainWindow.webContents.send('all-tags-fetched', rows);
    //                     });
    //                 }
    //             );
    //         });
    //     });
    // });

    ipcMain.on('import-equipment-list', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
        });

        if (result.canceled) return;

        const confirmation = await dialog.showMessageBox({
            type: 'question',
            buttons: ['Cancel', 'Upload'],
            defaultId: 1,
            title: 'Confirm Upload',
            message: 'Do you want to upload this file?'
        });

        if (confirmation.response !== 1) return;

        const filePath = result.filePaths[0];
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const equipmentList = xlsx.utils.sheet_to_json(sheet);

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            equipmentList.forEach((equipment) => {
                const { tag, descr, qty, capacity, type, materials, capacityDuty, dims, dsgnPress, opPress, dsgnTemp, opTemp, dryWeight, opWeight, supplier, remarks, initStatus, revision, revisionDate } = equipment;
                if (!tag) {
                    console.warn('Skipping equipment with empty tag.');
                    return;
                }

                projectDb.get('SELECT * FROM EquipmentList WHERE tag = ?', [tag], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in EquipmentList:', err.message);
                        return;
                    }

                    if (row) {
                        // Merge existing data with new data, retaining old data where new data is not provided
                        const updatedEquipment = {
                            tagId: row.tagId,
                            tag: tag,
                            descr: descr || row.descr,
                            qty: qty || row.qty,
                            capacity: capacity || row.capacity,
                            type: type || row.type,
                            materials: materials || row.materials,
                            capacityDuty: capacityDuty || row.capacityDuty,
                            dims: dims || row.dims,
                            dsgnPress: dsgnPress || row.dsgnPress,
                            opPress: opPress || row.opPress,
                            dsgnTemp: dsgnTemp || row.dsgnTemp,
                            opTemp: opTemp || row.opTemp,
                            dryWeight: dryWeight || row.dryWeight,
                            opWeight: opWeight || row.opWeight,
                            supplier: supplier || row.supplier,
                            remarks: remarks || row.remarks,
                            initStatus: initStatus || row.initStatus,
                            revision: revision || row.revision,
                            revisionDate: revisionDate || row.revisionDate
                        };

                        // Update the existing record
                        projectDb.run('UPDATE EquipmentList SET descr = ?, qty = ?, capacity = ?, type = ?, materials = ?, capacityDuty = ?, dims = ?, dsgnPress = ?, opPress = ?, dsgnTemp = ?, opTemp = ?, dryWeight = ?, opWeight = ?, supplier = ?, remarks = ?, initStatus = ?, revision = ?, revisionDate = ? WHERE tag = ?',
                            [updatedEquipment.descr, updatedEquipment.qty, updatedEquipment.capacity, updatedEquipment.type, updatedEquipment.materials, updatedEquipment.capacityDuty, updatedEquipment.dims, updatedEquipment.dsgnPress, updatedEquipment.opPress, updatedEquipment.dsgnTemp, updatedEquipment.opTemp, updatedEquipment.dryWeight, updatedEquipment.opWeight, updatedEquipment.supplier, updatedEquipment.remarks, updatedEquipment.initStatus, updatedEquipment.revision, updatedEquipment.revisionDate, tag],
                            (err) => {
                                if (err) {
                                    console.error('Error updating data in EquipmentList:', err.message);
                                    return;
                                }
                                console.log(`Row updated in EquipmentList with tag: ${updatedEquipment.tagId}`);
                                event.reply("tag-exists", { success: true, message: `Tag number ${tag} already exist and data updated` })
                                projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from EquipmentList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-equ-fetched', rows);
                                });
                            }
                        );

                        // Update TagInfo and Tags if necessary (assuming these tables don't need updates since they are for tag info)
                    } else {
                        const TagId = generateCustomID('T');

                        projectDb.run('INSERT OR IGNORE INTO EquipmentList (tagId, tag, descr, qty, capacity, type, materials, capacityDuty, dims, dsgnPress, opPress, dsgnTemp, opTemp, dryWeight, opWeight, supplier, remarks, initStatus, revision, revisionDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [TagId, tag, descr, qty, capacity, type, materials, capacityDuty, dims, dsgnPress, opPress, dsgnTemp, opTemp, dryWeight, opWeight, supplier, remarks, initStatus, revision, revisionDate],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into EquipmentList:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into EquipmentList with tag: ${TagId, descr}`);
                                projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from EquipmentList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-equ-fetched', rows);
                                });
                            }
                        );

                        projectDb.run(
                            'INSERT OR IGNORE INTO TagInfo (tagId, tag, type) VALUES (?, ?, ?)',
                            [TagId, tag, 'Equipment'],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into TagInfo:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into TagInfo with tag number: ${TagId}`);
                                projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from TagInfo table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-taginfo-fetched', rows);
                                });
                            }
                        );

                        projectDb.run(
                            'INSERT OR IGNORE INTO Tags (tagId, tagNumber, tagType) VALUES (?, ?, ?)',
                            [TagId, tag, 'Equipment'],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into Tags:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into Tags with tag number: ${TagId}`);
                                projectDb.all("SELECT * FROM Tags", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from Tags table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-tags-fetched', rows);
                                });
                            }
                        );
                    }
                });
            });
        });
    });


    // ipcMain.on('import-line-list', async () => {
    //     const result = await dialog.showOpenDialog({
    //         properties: ['openFile'],
    //         filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
    //     });

    //     if (result.canceled) return;

    //     const filePath = result.filePaths[0];
    //     const workbook = xlsx.readFile(filePath);
    //     const sheetName = workbook.SheetNames[0];
    //     const sheet = workbook.Sheets[sheetName];
    //     const lineList = xlsx.utils.sheet_to_json(sheet);

    //     const projectDb = new sqlite3.Database(databasePath, (err) => {
    //         if (err) {
    //             console.error('Error opening project database:', err.message);
    //             return;
    //         }

    //         lineList.forEach((equipment) => {
    //             const { tag, fluidCode, lineId, medium, lineSizeIn, lineSizeNb, pipingSpec, insType, insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup, chemCleaning, pwht } = equipment;

    //             // Insert into EquipmentList
    //             projectDb.run(
    //                 `INSERT OR IGNORE INTO LineList ( tag, fluidCode , lineId , medium , lineSizeIn , lineSizeNb ,pipingSpec, insType , insThickness , heatTrace , lineFrom , lineTo  , maxOpPress , maxOpTemp , dsgnPress , minDsgnTemp , maxDsgnTemp , testPress ,testMedium , testMediumPhase , massFlow , volFlow , density , velocity , paintSystem , ndtGroup ,chemCleaning , pwht) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?)`,
    //                 [tag, fluidCode, lineId, medium, lineSizeIn, lineSizeNb, pipingSpec, insType, insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup, chemCleaning, pwht],
    //                 (err) => {
    //                     if (err) {
    //                         console.error('Error inserting data into LineList:', err.message);
    //                         return;
    //                     }
    //                     console.log(`Row inserted into LineList with tag: ${tag}`);
    //                     // Fetch and send updated data back to renderer
    //                     projectDb.all("SELECT * FROM LineList", (err, rows) => {
    //                         if (err) {
    //                             console.error('Error fetching data from LineList table:', err.message);
    //                             return;
    //                         }
    //                         mainWindow.webContents.send('all-line-fetched', rows);
    //                     });

    //                 }
    //             );

    //             projectDb.run(
    //                 'INSERT OR IGNORE INTO TagInfo (tag,type) VALUES (?,?)',
    //                 [tag, 'Line'],
    //                 (err) => {
    //                     if (err) {
    //                         console.error('Error inserting data into Tags:', err.message);
    //                         return;
    //                     }
    //                     console.log(`Row inserted into Tags with tag number: ${tag}`);
    //                     projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
    //                         if (err) {
    //                             console.error('Error fetching data from TagInfo table:', err.message);
    //                             return;
    //                         }
    //                         mainWindow.webContents.send('all-taginfo-fetched', rows);
    //                     });
    //                 }
    //             );

    //             // Insert into Tags
    //             const tagId = uuid.v4();
    //             projectDb.run(
    //                 'INSERT OR IGNORE INTO Tags (tagId,tagNumber,tagType) VALUES (?,?,?)',
    //                 [tagId, tag, 'Line'],
    //                 (err) => {
    //                     if (err) {
    //                         console.error('Error inserting data into Tags:', err.message);
    //                         return;
    //                     }
    //                     console.log(`Row inserted into Tags with tag number: ${tag}`);
    //                     projectDb.all("SELECT * FROM Tags", (err, rows) => {
    //                         if (err) {
    //                             console.error('Error fetching data from Tags table:', err.message);
    //                             return;
    //                         }
    //                         mainWindow.webContents.send('all-tags-fetched', rows);
    //                     });
    //                 }
    //             );


    //         });
    //     });
    // });

    ipcMain.on('import-line-list', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
        });

        if (result.canceled) return;
        const confirmation = await dialog.showMessageBox({
            type: 'question',
            buttons: ['Cancel', 'Upload'],
            defaultId: 1,
            title: 'Confirm Upload',
            message: 'Do you want to upload this file?'
        });

        if (confirmation.response !== 1) return;

        const filePath = result.filePaths[0];
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const lineList = xlsx.utils.sheet_to_json(sheet);

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            lineList.forEach((line) => {
                const { tag, fluidCode, lineId, medium, lineSizeIn, lineSizeNb, pipingSpec, insType, insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup, chemCleaning, pwht } = line;

                projectDb.get('SELECT * FROM LineList WHERE tag = ?', [tag], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in LineList:', err.message);
                        return;
                    }

                    if (row) {
                        // Merge existing data with new data, retaining old data where new data is not provided
                        const updatedLine = {
                            tagId: row.tagId,
                            tag: tag,
                            fluidCode: fluidCode || row.fluidCode,
                            lineId: lineId || row.lineId,
                            medium: medium || row.medium,
                            lineSizeIn: lineSizeIn || row.lineSizeIn,
                            lineSizeNb: lineSizeNb || row.lineSizeNb,
                            pipingSpec: pipingSpec || row.pipingSpec,
                            insType: insType || row.insType,
                            insThickness: insThickness || row.insThickness,
                            heatTrace: heatTrace || row.heatTrace,
                            lineFrom: lineFrom || row.lineFrom,
                            lineTo: lineTo || row.lineTo,
                            maxOpPress: maxOpPress || row.maxOpPress,
                            maxOpTemp: maxOpTemp || row.maxOpTemp,
                            dsgnPress: dsgnPress || row.dsgnPress,
                            minDsgnTemp: minDsgnTemp || row.minDsgnTemp,
                            maxDsgnTemp: maxDsgnTemp || row.maxDsgnTemp,
                            testPress: testPress || row.testPress,
                            testMedium: testMedium || row.testMedium,
                            testMediumPhase: testMediumPhase || row.testMediumPhase,
                            massFlow: massFlow || row.massFlow,
                            volFlow: volFlow || row.volFlow,
                            density: density || row.density,
                            velocity: velocity || row.velocity,
                            paintSystem: paintSystem || row.paintSystem,
                            ndtGroup: ndtGroup || row.ndtGroup,
                            chemCleaning: chemCleaning || row.chemCleaning,
                            pwht: pwht || row.pwht
                        };

                        // Update the existing record
                        projectDb.run('UPDATE LineList SET fluidCode = ?, lineId = ?, medium = ?, lineSizeIn = ?, lineSizeNb = ?, pipingSpec = ?, insType = ?, insThickness = ?, heatTrace = ?, lineFrom = ?, lineTo = ?, maxOpPress = ?, maxOpTemp = ?, dsgnPress = ?, minDsgnTemp = ?, maxDsgnTemp = ?, testPress = ?, testMedium = ?, testMediumPhase = ?, massFlow = ?, volFlow = ?, density = ?, velocity = ?, paintSystem = ?, ndtGroup = ?, chemCleaning = ?, pwht = ? WHERE tag = ?',
                            [updatedLine.fluidCode, updatedLine.lineId, updatedLine.medium, updatedLine.lineSizeIn, updatedLine.lineSizeNb, updatedLine.pipingSpec, updatedLine.insType, updatedLine.insThickness, updatedLine.heatTrace, updatedLine.lineFrom, updatedLine.lineTo, updatedLine.maxOpPress, updatedLine.maxOpTemp, updatedLine.dsgnPress, updatedLine.minDsgnTemp, updatedLine.maxDsgnTemp, updatedLine.testPress, updatedLine.testMedium, updatedLine.testMediumPhase, updatedLine.massFlow, updatedLine.volFlow, updatedLine.density, updatedLine.velocity, updatedLine.paintSystem, updatedLine.ndtGroup, updatedLine.chemCleaning, updatedLine.pwht, tag],
                            (err) => {
                                if (err) {
                                    console.error('Error updating data in LineList:', err.message);
                                    return;
                                }
                                console.log(`Row updated in LineList with tag: ${updatedLine.tagId}`);
                                event.reply("tag-exists", { success: true, message: `Tag number ${tag} already exist and data updated` })
                                projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from LineList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-line-fetched', rows);
                                });
                            }
                        );

                        // Update TagInfo and Tags if necessary (assuming these tables don't need updates since they are for tag info)
                    } else {
                        const TagId = generateCustomID('T');

                        projectDb.run('INSERT OR IGNORE INTO LineList (tagId,tag, fluidCode, lineId, medium, lineSizeIn, lineSizeNb, pipingSpec, insType, insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup, chemCleaning, pwht) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
                            [TagId, tag, fluidCode, lineId, medium, lineSizeIn, lineSizeNb, pipingSpec, insType, insThickness, heatTrace, lineFrom, lineTo, maxOpPress, maxOpTemp, dsgnPress, minDsgnTemp, maxDsgnTemp, testPress, testMedium, testMediumPhase, massFlow, volFlow, density, velocity, paintSystem, ndtGroup, chemCleaning, pwht],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into LineList:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into LineList with tag: ${tag}`);
                                projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from LineList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-line-fetched', rows);
                                });
                            }
                        );

                        projectDb.run(
                            'INSERT OR IGNORE INTO TagInfo (tagId,tag, type) VALUES (?, ?,?)',
                            [TagId, tag, 'Line'],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into TagInfo:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into TagInfo with tag number: ${tag}`);
                                projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from TagInfo table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-taginfo-fetched', rows);
                                });
                            }
                        );

                        projectDb.run(
                            'INSERT OR IGNORE INTO Tags (tagId, tagNumber, tagType) VALUES (?, ?, ?)',
                            [TagId, tag, 'Line'],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into Tags:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into Tags with tag number: ${tag}`);
                                projectDb.all("SELECT * FROM Tags", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from Tags table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-tags-fetched', rows);
                                });
                            }
                        );
                    }
                });
            });
        });
    });


    // ipcMain.on('import-comment-details', async () => {
    //     const result = await dialog.showOpenDialog({
    //         properties: ['openFile'],
    //         filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
    //     });

    //     if (result.canceled) return;

    //     const filePath = result.filePaths[0];
    //     const workbook = xlsx.readFile(filePath);
    //     const sheetName = workbook.SheetNames[0];
    //     const sheet = workbook.Sheets[sheetName];
    //     const commentList = xlsx.utils.sheet_to_json(sheet);

    //     const projectDb = new sqlite3.Database(databasePath, (err) => {
    //         if (err) {
    //             console.error('Error opening project database:', err.message);
    //             return;
    //         }

    //         commentList.forEach((equipment) => {
    //             const { statusname, color } = equipment;
    //             // const commentId = uuid.v4();
    //             const commentId = generateCustomID('C');
    //             // Insert into EquipmentList
    //             projectDb.run(
    //                 `INSERT OR IGNORE INTO CommentStatus (number, statusname, color) VALUES (?, ?, ?)`,
    //                 [number, statusname, color],
    //                 (err) => {
    //                     if (err) {
    //                         console.error('Error inserting data into CommentStatus:', err.message);
    //                         return;
    //                     }
    //                     console.log(`Row inserted into CommentStatus with tag: ${number}`);
    //                     // Fetch and send updated data back to renderer
    //                     projectDb.all("SELECT * FROM CommentStatus", (err, rows) => {
    //                         if (err) {
    //                             console.error('Error fetching data from CommentStatus table:', err.message);
    //                             return;
    //                         }
    //                         mainWindow.webContents.send('all-comments-fetched', rows);
    //                     });

    //                 }
    //             );

    //         });
    //     });
    // });


    ipcMain.on('import-comment-details', async (event, data) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
        });

        if (result.canceled) return;

        const filePath = result.filePaths[0];
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const commentList = xlsx.utils.sheet_to_json(sheet);

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            commentList.forEach((equipment) => {
                const { statusname, color } = equipment;
                projectDb.get("SELECT MAX(number) AS max_number FROM CommentStatus", function (err, row) {
                    const number = parseInt(row.max_number) + 1 || 1;

                    projectDb.run(
                        `INSERT OR IGNORE INTO CommentStatus (number, statusname, color) VALUES (?, ?, ?)`,
                        [number, statusname, color],
                        (err) => {
                            if (err) {
                                console.error('Error inserting data into CommentStatus:', err.message);
                                return;
                            }
                            console.log(`Row inserted into CommentStatus with tag: ${number}`);
                            // Fetch and send updated data back to renderer
                            projectDb.all("SELECT * FROM CommentStatus", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from CommentStatus table:', err.message);
                                    return;
                                }
                                mainWindow.webContents.send('all-comments-fetched', rows);
                            });

                        })
                });
            });
        });

    })

    // ipcMain.on('import-tag-list', async () => {
    //     const result = await dialog.showOpenDialog({
    //         properties: ['openFile'],
    //         filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
    //     });

    //     if (result.canceled) return;

    //     const filePath = result.filePaths[0];
    //     const workbook = xlsx.readFile(filePath);
    //     const sheetName = workbook.SheetNames[0];
    //     const sheet = workbook.Sheets[sheetName];
    //     const tagList = xlsx.utils.sheet_to_json(sheet);
    //     // mainWindow.webContents.send('allmporttags', tagList);
    //     const projectDb = new sqlite3.Database(databasePath, (err) => {
    //         if (err) {
    //             console.error('Error opening project database:', err.message);
    //             return;
    //         }

    //         tagList.forEach((tagdata) => {
    //             // const  tagNumber  = tagdata.Tagnumber;
    //             // const  tagName  = tagdata.Name;
    //             // const  tagType  = tagdata.Type;

    //             const tagNumber = tagdata["Tag number"];
    //             const tagName = tagdata["Name"];
    //             const tagType = tagdata["Type"];
    //             // const tagId = uuid.v4();
    //             const tagId = generateCustomID('T');
    //             // Insert into EquipmentList
    //             projectDb.run(
    //                 `INSERT OR IGNORE INTO Tags (tagId,tagNumber,tagName,tagType) VALUES (?, ?, ?,?)`,
    //                 [tagId, tagNumber, tagName, tagType],
    //                 (err) => {
    //                     if (err) {
    //                         console.error('Error inserting data into Tags:', err.message);
    //                         return;
    //                     }
    //                     console.log(`Row inserted into Tags with tag: ${tagId}`);
    //                     // Fetch and send updated data back to renderer
    //                     projectDb.all("SELECT * FROM Tags", (err, rows) => {
    //                         if (err) {
    //                             console.error('Error fetching data from Tags table:', err.message);
    //                             return;
    //                         }
    //                         mainWindow.webContents.send('all-tags-fetched', rows);
    //                     });

    //                 }
    //             );

    //             projectDb.run('INSERT INTO TagInfo (tag,type) VALUES (?,?)', [data.tagNumber, data.tagType], function (err) {
    //                 if (err) {
    //                     console.error('Error inserting data into tagInfo table:', err.message);
    //                     return;
    //                 }
    //                 console.log(`Row inserted into tagInfo table with tag number: ${data.tagNumber}`);
    //                 projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
    //                     if (err) {
    //                         console.error('Error fetching data from Tree table:', err.message);
    //                         return;
    //                     }

    //                     console.log('Data in the TagInfo table:', rows);
    //                     mainWindow.webContents.send('all-taginfo-fetched', rows);
    //                 });
    //             });

    //             // Based on tagtype, insert data into either LineList or EquipmentList table
    //             if (data.tagType === 'Line') {
    //                 console.log("line");
    //                 projectDb.run('INSERT INTO LineList (tag) VALUES (?)', [data.tagNumber], function (err) {
    //                     if (err) {
    //                         console.error('Error inserting data into LineList table:', err.message);
    //                         return;
    //                     }
    //                     console.log(`Row inserted into LineList table with tag number: ${data.tagNumber}`);
    //                     projectDb.all("SELECT * FROM LineList", (err, rows) => {
    //                         if (err) {
    //                             console.error('Error fetching data from Tree table:', err.message);
    //                             return;
    //                         }

    //                         console.log('Data in the LineList table:', rows);
    //                         mainWindow.webContents.send('all-line-fetched', rows);
    //                     });

    //                 });

    //             } else if (data.tagType === 'Equipment') {
    //                 console.log("Equipement");
    //                 projectDb.run('INSERT INTO EquipmentList (tag) VALUES (?)', [data.tagNumber], function (err) {
    //                     if (err) {
    //                         console.error('Error inserting data into EquipmentList table:', err.message);
    //                         return;
    //                     }
    //                     console.log(`Row inserted into EquipmentList table with tag number: ${data.tagNumber}`);
    //                     projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
    //                         if (err) {
    //                             console.error('Error fetching data from Tree table:', err.message);
    //                             return;
    //                         }

    //                         console.log('Data in the EquipmentList table:', rows);
    //                         mainWindow.webContents.send('all-equ-fetched', rows);
    //                     });

    //                 });

    //             } else {
    //                 console.error('Invalid tag type:', data.tagtype);
    //             }

    //         });
    //     });
    // });

    ipcMain.on('import-tag-list', async (event, data) => {
        console.log(data);
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            data.forEach((line) => {
                const { tagNumber, tagName, tagType } = line;
                console.log(tagNumber);
                projectDb.get('SELECT * FROM Tags WHERE tagNumber = ?', [tagNumber], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in tag table:', err.message);
                        return;
                    }

                    if (row) {
                        event.reply("tag-exists", { success: true, message: `Tag number ${tagNumber} already exist and data updated` })
                    } else {
                        const TagId = generateCustomID('T');
                        if (tagType === 'Line') {
                            projectDb.run(
                                'INSERT OR IGNORE INTO LineList (tagId,tag) VALUES (?, ?)',
                                [TagId, tagNumber],
                                (err) => {
                                    if (err) {
                                        console.error('Error inserting data into LineList:', err.message);
                                        return;
                                    }
                                    console.log(`Row inserted into LineList with tag: ${tagNumber}`);
                                    projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                        if (err) {
                                            console.error('Error fetching data from LineList table:', err.message);
                                            return;
                                        }
                                        mainWindow.webContents.send('all-line-fetched', rows);
                                    });
                                }
                            );
                        }
                        else if (tagType === 'Equipment') {
                            projectDb.run(
                                'INSERT OR IGNORE INTO EquipmentList (tagId,tag) VALUES (?, ?)',
                                [TagId, tagNumber],
                                (err) => {
                                    if (err) {
                                        console.error('Error inserting data into EquipmentList:', err.message);
                                        return;
                                    }
                                    console.log(`Row inserted into EquipmentList with tag: ${tagNumber}`);
                                    projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                        if (err) {
                                            console.error('Error fetching data from EquipmentList table:', err.message);
                                            return;
                                        }
                                        mainWindow.webContents.send('all-equ-fetched', rows);
                                    });
                                }
                            );
                        }


                        projectDb.run(
                            'INSERT OR IGNORE INTO TagInfo (tagId,tag, type) VALUES (?, ?,?)',
                            [TagId, tagNumber, tagType],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into TagInfo:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into TagInfo with tag number: ${tagNumber}`);
                                projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from TagInfo table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-taginfo-fetched', rows);
                                });
                            }
                        );

                        projectDb.run(
                            'INSERT OR IGNORE INTO Tags (tagId, tagNumber,tagName, tagType) VALUES (?, ?, ?,?)',
                            [TagId, tagNumber, tagName, tagType],
                            (err) => {
                                if (err) {
                                    console.error('Error inserting data into Tags:', err.message);
                                    return;
                                }
                                console.log(`Row inserted into Tags with tag number: ${tagNumber}`);
                                projectDb.all("SELECT * FROM Tags", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from Tags table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-tags-fetched', rows);
                                });
                            }
                        );
                    }
                });
            });
        });

    });

    ipcMain.on('delete-all-tags', async (event) => {
        console.log("Received request to remove all tags");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        // Confirmation dialog
        const confirmation = await dialog.showMessageBox({
            type: 'warning',
            buttons: ['Cancel', 'Delete All'],
            defaultId: 1,
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete all tags? This action cannot be undone.'
        });

        if (confirmation.response !== 1) return;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch all tagNos from the Tags table
            projectDb.all('SELECT tagNumber FROM Tags', (err, rows) => {
                if (err) {
                    console.error('Error fetching tagNos from Tags table:', err.message);
                    projectDb.close();
                    return;
                }

                const tagNos = rows.map(row => row.tagNumber);

                // if (tagNos.length > 0) {
                //     // Delete corresponding rows in the Tree table
                //     const placeholders = tagNos.map(() => '?').join(',');
                //     projectDb.run(`DELETE FROM Tree WHERE tag IN (${placeholders})`, tagNos, (err) => {
                //         if (err) {
                //             console.error('Error deleting from Tree table:', err.message);
                //         } else {
                //             console.log('All corresponding rows in the Tree table deleted successfully.');
                //         }

                //         // Fetch updated data to send back to the renderer
                //         projectDb.all("SELECT * FROM Tree", (err, rows) => {
                //             if (err) {
                //                 console.error('Error fetching data from Tree table:', err.message);
                //             } else {
                //                 console.log('Data in the Tree table after deletion:', rows);
                //                 mainWindow.webContents.send('all-tags-under-sys-fetched', rows);
                //             }
                //         });
                //     });
                // }

                // Delete all rows in the Tags table
                projectDb.run('DELETE FROM Tags', (err) => {
                    if (err) {
                        console.error('Error deleting all data from Tags table:', err.message);
                        return;
                    }
                    console.log('All rows in the Tags table deleted successfully.');

                    // Fetch updated data to send back to the renderer
                    projectDb.all("SELECT * FROM Tags", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tags table:', err.message);
                            return;
                        }

                        console.log('Data in the Tags table after deletion:', rows);
                        mainWindow.webContents.send('all-tags-fetched', rows);
                    });
                });

                // Delete all rows in the LineList table
                projectDb.run('DELETE FROM LineList', (err) => {
                    if (err) {
                        console.error('Error deleting all data from LineList table:', err.message);
                        return;
                    }
                    console.log('All rows in the LineList table deleted successfully.');

                    // Fetch updated data to send back to the renderer
                    projectDb.all("SELECT * FROM LineList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from LineList table:', err.message);
                            return;
                        }

                        console.log('Data in the LineList table after deletion:', rows);
                        mainWindow.webContents.send('all-line-fetched', rows);
                    });
                });

                // Delete all rows in the EquipmentList table
                projectDb.run('DELETE FROM EquipmentList', (err) => {
                    if (err) {
                        console.error('Error deleting all data from EquipmentList table:', err.message);
                        return;
                    }
                    console.log('All rows in the EquipmentList table deleted successfully.');

                    // Fetch updated data to send back to the renderer
                    projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from EquipmentList table:', err.message);
                            return;
                        }

                        console.log('Data in the EquipmentList table after deletion:', rows);
                        mainWindow.webContents.send('all-equ-fetched', rows);
                    });
                });

                // Delete all rows in the TagInfo table
                projectDb.run('DELETE FROM TagInfo', (err) => {
                    if (err) {
                        console.error('Error deleting all data from TagInfo table:', err.message);
                        return;
                    }
                    console.log('All rows in the TagInfo table deleted successfully.');

                    // Fetch updated data to send back to the renderer
                    projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from TagInfo table:', err.message);
                            return;
                        }

                        console.log('Data in the TagInfo table after deletion:', rows);
                        mainWindow.webContents.send('all-taginfo-fetched', rows);
                    });
                });

                // // Optionally delete associated files
                // // Assuming files are stored in 'Tags' folder under selectedFolderPath
                // const tagsFolderPath = path.join(selectedFolderPath, 'Tags');
                // fs.readdir(tagsFolderPath, (err, files) => {
                //     if (err) {
                //         console.error('Error reading Tags folder:', err.message);
                //         return;
                //     }
                //     files.forEach(file => {
                //         const filePath = path.join(tagsFolderPath, file);
                //         fs.unlink(filePath, (err) => {
                //             if (err && err.code !== 'ENOENT') {
                //                 console.error(`Error deleting file '${file}':`, err.message);
                //             } else {
                //                 console.log(`File '${file}' deleted from Tags folder.`);
                //             }
                //         });
                //     });
                // });

                projectDb.close((err) => {
                    if (err) {
                        console.error('Error closing the project database:', err.message);
                    } else {
                        console.log('Project database closed successfully.');
                    }
                });
            });
        });
    });

    ipcMain.on('add-comment', (event, commentData) => {
        const { docNumber, comment, statusname, priority, coordinateX, coordinateY } = commentData
        const createdby = "jpo@poulconsul"
        const createddate = new Date().toISOString();
        try {
            const projectdb = new sqlite3.Database(databasePath, (err) => {
                if (err) {
                    console.error('Error opening project database:', err.message);
                    return;
                }
                projectdb.get("SELECT MAX(number) AS max_number FROM CommentTable", function (err, row) {
                    const number = parseInt(row.max_number) + 1 || 1;
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    projectdb.run('INSERT INTO CommentTable (docNumber,number,comment,statusname,priority,createdby,createddate,coOrdinateX ,coOrdinateY) VALUES (?,?, ?, ?,?,?,?,?,?)',
                        [docNumber, number, comment, statusname, priority, createdby, createddate, coordinateX, coordinateY],
                        function (err) {
                            if (err) {
                                return console.error('Error inserting data:', err.message);
                            }
                            event.sender.send('save-comment-response')
                            console.log(`Row inserted with ID: ${number}`);
                        });
                    projectdb.all("SELECT * FROM CommentTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from Tree table:', err.message);
                            return;
                        }
                        console.log(rows)

                        mainWindow.webContents.send('all-comments', rows);
                    });
                })
            })
        }
        catch (error) {
            console.error('Error in save-data handler:', error);

        }

    })

    ipcMain.on('delete-comment', (event, commentNumber) => {
        console.log("receive delete message")
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Delete the record from the database
            projectDb.run('DELETE FROM CommentTable WHERE number = ?', [commentNumber], (err) => {
                if (err) {
                    console.error('Error deleting from comment table:', err.message);
                    return;
                }
                event.sender.send('delete-comment-response')
                console.log(`Row deleted with ID: ${commentNumber}`);
                projectdb.all("SELECT * FROM CommentTable", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from Tree table:', err.message);
                        return;
                    }
                    console.log(rows)

                    mainWindow.webContents.send('all-comments', rows);
                });
            });
        });
    });

    ipcMain.on('add-commentdetails-table', (event, data) => {
        console.log("Received request to save tag");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // db.run("CREATE TABLE IF NOT EXISTS Tags ( tagId TEXT,tagNumber TEXT, tagName TEXT, tagType TEXT)");
            // const commentId = uuid.v4();
            const commentId = generateCustomID('C');
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO CommentStatus (commentId,statusname,color) VALUES (?,?,?)', [commentId, data.statusname, data.color], function (err) {
                if (err) {
                    console.error('Error inserting data:', err.message);
                    return;
                }
                console.log('Row inserted with status: ${data.statusname}');
            });

            projectDb.all("SELECT * FROM CommentStatus", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the CommentStatus table:', rows);
                mainWindow.webContents.send('all-comments-fetched', rows);
            });
        });
    })

    ipcMain.on('editCommentStatus', (event, data) => {
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const { number, statusname, comment, priority } = data;
        let closedDate = null;
        let closedby = null;

        if (statusname === 'closed') {
            closedDate = new Date().toISOString();
            closedby = 'jpo@poulconsult';
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Update the record in the database
            projectDb.run('UPDATE CommentTable SET statusname = ?, comment=?, priority=? , closedDate = ?, closedBy = ? WHERE number = ?',
                [statusname, comment, priority, closedDate, closedby, number],
                (err) => {
                    if (err) {
                        console.error('Error updating CommentTable:', err.message);
                        return;
                    }

                    projectDb.all("SELECT * FROM CommentTable", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from CommentTable:', err.message);
                            return;
                        }
                        console.log(rows);
                        mainWindow.webContents.send('all-comments', rows);
                    });
                }
            );
        });
    });


    ipcMain.on('remove-commentstatus-table', (event, statusname) => {
        console.log("Received delete message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.run('DELETE FROM CommentStatus WHERE statusname = ?', [statusname], (err) => {
                if (err) {
                    console.error('Error deleting from comment table:', err.message);
                    return;
                }

                // Fetch and send updated data to the renderer process
                projectDb.all("SELECT * FROM CommentStatus", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from CommentStatus table:', err.message);
                        return;
                    }

                    console.log('Data in the CommentStatus table:', rows);
                    mainWindow.webContents.send('all-comments-fetched', rows);
                });
            });

            // // Fetch the table schema to get all column names except 'tag'
            // projectDb.all("PRAGMA table_info(CommentStatus)", (err, columns) => {
            //     if (err) {
            //         console.error('Error fetching table info:', err.message);
            //         return;
            //     }

            //     // Prepare the list of columns to set to NULL
            //     const updateColumns = columns
            //         .map(col => col.name)
            //         .filter(colName => colName !== 'tag' && colName !== 'type')
            //         .map(colName => `${colName} = NULL`)
            //         .join(', ');

            // // Update the row to set all columns except 'tag' to NULL
            // projectDb.run(`UPDATE tagInfo SET ${updateColumns} WHERE tag = ?`, [tagNumber], (err) => {
            //     if (err) {
            //         console.error('Error updating LineList table:', err.message);
            //         return;
            //     }

            //     // Fetch and send updated data to the renderer process
            //     projectDb.all("SELECT * FROM tagInfo", (err, rows) => {
            //         if (err) {
            //             console.error('Error fetching data from tagInfo table:', err.message);
            //             return;
            //         }

            //         console.log('Data in the tagInfo table:', rows);
            //         mainWindow.webContents.send('all-taginfo-fetched', rows);
            //     });
            // });
            // });
        });
    });

    ipcMain.on('update-tag-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch current tag data
            projectDb.get('SELECT * FROM Tags WHERE tagId = ?', [updatedData.tagTd], (err, row) => {
                if (err) {
                    console.error('Error fetching data:', err.message);
                    return;
                }

                const previousTagtype = row.tagType;
                const updatedTagtype = updatedData.tagType;
                const tagnumber = row.tagNumber;


                // Update data in Tags table
                projectDb.run('UPDATE Tags SET tagName = ?, tagType = ? WHERE tagId = ?',
                    [updatedData.tagName, updatedData.tagType, updatedData.tagId],
                    function (err) {
                        if (err) {
                            console.error('Error updating data:', err.message);
                            return;
                        }
                        console.log(`Row updated with tag number: ${updatedData.tagId}`);

                        // Fetch updated Tags table data
                        projectDb.all("SELECT * FROM Tags", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tags table:', err.message);
                                return;
                            }
                            console.log('Data in the Tags table:', rows);
                            mainWindow.webContents.send('all-tags-fetched', rows);
                        });
                    });

                // If the type has changed from "line" to "equipment"
                if (previousTagtype === 'Line' && updatedTagtype === 'Equipment') {
                    // Move data from Line table to Equipment table
                    projectDb.run('INSERT INTO EquipmentList (tagId,tag) VALUES (?,?)', [updatedData.tagId, tagnumber], function (err) {
                        if (err) {
                            console.error('Error moving data from Line to Equipment:', err.message);
                            return;
                        }
                        console.log(`Data moved from Line to Equipment for tagId: ${updatedData.tagId}`);
                        projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Tree table:', err.message);
                                return;
                            }

                            console.log('Data in the Equipment table:', rows);
                            mainWindow.webContents.send('all-equ-fetched', rows);
                        });

                        // Delete moved data from Line table
                        projectDb.run('DELETE FROM LineList WHERE tagId = ?', [updatedData.tagId], function (err) {
                            if (err) {
                                console.error('Error deleting data from Line table:', err.message);
                                return;
                            }
                            console.log(`Data deleted from Line table for tagId: ${updatedData.tagId}`);
                            projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from LineList table:', err.message);
                                    return;
                                }

                                mainWindow.webContents.send('all-line-fetched', rows);
                            });
                        });
                    });
                }

                // If the type has changed from "line" to "equipment"
                if (previousTagtype === 'Equipment' && updatedTagtype === 'Line') {
                    // Move data from Line table to Equipment table
                    projectDb.run('INSERT INTO LineList (tagId,tag) VALUES (?,?)', [updatedData.tagId, tagnumber], function (err) {
                        if (err) {
                            console.error('Error moving data from Line to Equipment:', err.message);
                            return;
                        }
                        console.log('Data moved from Line to Equipment for tagId: ${updatedData.tagId}');

                        projectDb.all("SELECT * FROM LineList", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from LineList table:', err.message);
                                return;
                            }

                            mainWindow.webContents.send('all-line-fetched', rows);
                        });

                        // Delete moved data from Line table
                        projectDb.run('DELETE FROM EquipmentList WHERE tagId = ?', [updatedData.tagId], function (err) {
                            if (err) {
                                console.error('Error deleting data from Line table:', err.message);
                                return;
                            }
                            console.log(`Data deleted from Equpment table for tagId: ${updatedData.tagId}`);
                            projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                if (err) {
                                    console.error('Error fetching data from Tree table:', err.message);
                                    return;
                                }

                                console.log('Data in the Equipment table:', rows);
                                mainWindow.webContents.send('all-equ-fetched', rows);
                            });

                        });
                    });
                }


                // Update data in TagInfo table (assuming tagId and tagtype are related to tagId)
                projectDb.run('UPDATE TagInfo SET type = ? WHERE tag = ?',
                    [updatedData.tagType, updatedData.tagNumber],
                    function (err) {
                        if (err) {
                            console.error('Error updating data:', err.message);
                            return;
                        }
                        console.log(`Row updated with tag number: ${updatedData.tagNumber}`);

                        // Fetch updated TagInfo table data
                        projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from TagInfo table:', err.message);
                                return;
                            }
                            mainWindow.webContents.send('all-taginfo-fetched', rows);
                        });
                    });
            });
        });
    });

    ipcMain.on('update-doc-table', (event, updatedData) => {
        console.log("Received update message");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            // Fetch current tag data
            projectDb.get('SELECT * FROM Documents WHERE docId = ?', [updatedData.docId], (err, row) => {
                if (err) {
                    console.error('Error fetching data:', err.message);
                    return;
                }

                // const previousDoctype = row.type;
                // const updatedDoctype = updatedData.type;
                // const docnumber = row.number;

                // Update data in Tags table
                projectDb.run('UPDATE Documents SET title = ?, descr = ?, type=?, filename = ? WHERE docId = ?',
                    [updatedData.title, updatedData.descr, updatedData.type, updatedData.filename, updatedData.docId],
                    function (err) {
                        if (err) {
                            console.error('Error updating data:', err.message);
                            return;
                        }
                        console.log(`Row updated with tag number: ${updatedData.docId},${updatedData.title},${updatedData.descr},${updatedData.type}, ${updatedData.filename}`);
                        // Fetch updated Tags table data
                        projectDb.all("SELECT * FROM Documents", (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Documents table:', err.message);
                                return;
                            }
                            console.log('Data in the Documents table:', rows);
                            mainWindow.webContents.send('all-docs-fetched', rows);
                        });
                        projectDb.all("SELECT * FROM Documents WHERE type = ?", ["iXB"], (err, rows) => {
                            if (err) {
                                console.error('Error fetching data from Documents table:', err.message);
                                return;
                            }

                            console.log('Data in the Documents table:', rows);
                            mainWindow.webContents.send('spid-docs-fetched', rows);
                        });
                    });
                // Move the file into the 'Documents' folder if filePath is provided
                const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
                const revisedFolderPath = path.join(selectedFolderPath, 'Revised');
                if (!fs.existsSync(documentsFolderPath)) {
                    fs.mkdirSync(documentsFolderPath);
                    console.log('Documents folder created.');
                }

                if (!fs.existsSync(revisedFolderPath)) {
                    fs.mkdirSync(revisedFolderPath);
                    console.log('Revised folder created.');
                }

                const moveFileToRevised = (sourcePath, filename, revision) => {
                    const revisedFileName = filename.replace(/(\.[\w\d_-]+)$/i, `R${revision}$1`);
                    const revisedFilePath = path.join(revisedFolderPath, revisedFileName);
                    fs.renameSync(sourcePath, revisedFilePath);
                    console.log(`File '${filename}' moved to 'Revised' folder with new name '${revisedFileName}'.`);
                };

                const handleFileRevisions = (destinationPath, filename) => {
                    const revisions = [];
                    for (let i = 1; i <= 3; i++) {
                        const revisedFileName = filename.replace(/(\.[\w\d_-]+)$/i, `R${i}$1`);
                        const revisedFilePath = path.join(revisedFolderPath, revisedFileName);
                        if (fs.existsSync(revisedFilePath)) {
                            revisions.push(revisedFilePath);
                        }
                    }

                    if (revisions.length === 3) {
                        fs.unlinkSync(revisions[0]);
                        console.log(`Oldest revision '${revisions[0]}' deleted.`);
                        revisions.shift();
                    }

                    if (fs.existsSync(destinationPath)) {
                        for (let i = 1; i <= 3; i++) {
                            const revisedFileName = filename.replace(/(\.[\w\d_-]+)$/i, `R${i}$1`);
                            const revisedFilePath = path.join(revisedFolderPath, revisedFileName);
                            if (!fs.existsSync(revisedFilePath)) {
                                moveFileToRevised(destinationPath, filename, i);
                                break;
                            }
                        }
                    }
                };

                if (updatedData.filePath) {
                    const fileToMove = updatedData.filePath;
                    const filename = path.basename(fileToMove);
                    const destinationPath = path.join(documentsFolderPath, filename);

                    handleFileRevisions(destinationPath, filename);

                    // Copy the new file to the Tags folder
                    fs.copyFileSync(fileToMove, destinationPath);
                    console.log(`File '${filename}' moved to 'Documents' folder.`);
                }
            })
        });
    })

    ipcMain.on('insert-master-table', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Documents WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('Doc-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    // console.log('Data in the Documents table:', row);
                    // mainWindow.webContents.send('master-doc-fetched', row);
                    const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
                    const filePath = path.join(documentsFolderPath, row.filename);

                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', { success: true, filePath: filePath });
                        // const tagId = uuid.v4();
                        const masterId = generateCustomID('M');
                        // Insert data into the Tree table of the project's database
                        projectDb.run('INSERT INTO Master (masterId,docId,number,title,descr,type,filename) VALUES (?,?,?,?,?,?,?)', [masterId, row.docId, row.number, row.title, row.descr, row.type, row.filename], function (err) {
                            if (err) {
                                console.error('Error inserting data:', err.message);
                                return;
                            }
                            const MastersFolderPath = path.join(selectedFolderPath, 'Masters');
                            if (!fs.existsSync(MastersFolderPath)) {
                                fs.mkdirSync(MastersFolderPath);
                                console.log('Masters folder created.');
                            }

                            // Move the file into the 'Documents' folder
                            const fileToMove = filePath;
                            const fileName = path.basename(fileToMove);
                            const destinationPath = path.join(MastersFolderPath, fileName);
                            fs.copyFileSync(fileToMove, destinationPath);
                            console.log(`File '${fileName}' moved to 'Masters' folder.`);
                            // projectDb.all("SELECT * FROM Master", (err, rows) => {
                            //     if (err) {
                            //         console.error('Error fetching data from Tree table:', err.message);
                            //         return;
                            //     }

                            //     console.log('Data in the Master table:', rows);
                            //     mainWindow.webContents.send('all-docs-fetched', rows);
                            // });

                            projectDb.all("SELECT filename FROM Master WHERE number=?", [row.number], (err, rows) => {
                                if (err) {
                                    console.error('Error querying the database:', err.message);
                                    event.sender.send('master-doc-found', { success: false, message: 'Error querying the database' });
                                    return;
                                }

                                if (rows) {
                                    const MasterssFolderPath = path.join(selectedFolderPath, 'Masters');
                                    const fileePath = path.join(MasterssFolderPath, row.filename);

                                    if (fs.existsSync(fileePath)) {
                                        console.log(`File found: ${fileePath}`);
                                        event.sender.send('doc-found', { success: true, fileePath: filePath });
                                        mainWindow.webContents.send('master-doc-fetched', fileePath);
                                    } else {
                                        console.error('File not found in Documents folder');
                                        event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                                    }
                                } else {
                                    console.error('Document not found in database');
                                    event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                                }
                            });
                        });
                    }


                }

                else {
                    console.error('File not found in Documents folder');
                    event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                }
            });
        });
    });


    ipcMain.on('check-master', (event, number) => {

        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT * FROM Master WHERE number = ?', [number], (err, row) => {
                const nrow = {}
                if (err) {
                    console.error('Error querying the database:', err.message);
                    return;
                }
                if (row) {
                    console.log(`Master details: ${row}`);
                    mainWindow.webContents.send('master-checked', row);
                } else {
                    console.error('Master not found in Masters table');
                    mainWindow.webContents.send('master-checked', nrow);
                }
            });
        });
    });

    ipcMain.on('fetch-master-doc', (event, number) => {
        console.log("Received request to search document by number");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.get('SELECT filename FROM Master WHERE number = ?', [number], (err, row) => {
                if (err) {
                    console.error('Error querying the database:', err.message);
                    event.sender.send('tag-found', { success: false, message: 'Error querying the database' });
                    return;
                }

                if (row) {
                    const documentsFolderPath = path.join(selectedFolderPath, 'Masters');
                    const filePath = path.join(documentsFolderPath, row.filename);

                    if (fs.existsSync(filePath)) {
                        console.log(`File found: ${filePath}`);
                        event.sender.send('doc-found', { success: true, filePath: filePath });
                        mainWindow.webContents.send('store-master-fetched', filePath);
                        // projectDb.all("SELECT * FROM CommentStatus", (err, rows) => {
                        //     if (err) {
                        //         console.error('Error fetching data from CommentStatus table:', err.message);
                        //         return;
                        //     }
                        //     mainWindow.webContents.send('store-master-fetched', rows);
                        // });
                    } else {
                        console.error('File not found Master folder');
                        event.sender.send('doc-found', { success: false, message: 'File not found in Documents folder' });
                    }
                } else {
                    console.error('Document not found in database');
                    event.sender.send('doc-found', { success: false, message: 'Document not found in database' });
                }
            });
        });
    });


    ipcMain.on('delete-all-comments', async (event) => {
        console.log("Received request to remove all comments");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }
        // Confirmation dialog
        const confirmation = await dialog.showMessageBox({
            type: 'warning',
            buttons: ['Cancel', 'Delete All'],
            defaultId: 1,
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete all comments? This action cannot be undone.'
        });

        if (confirmation.response !== 1) return;

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // Delete all rows in the Tags table
            projectDb.run('DELETE FROM CommentTable', (err) => {
                if (err) {
                    console.error('Error deleting all data from comments table:', err.message);
                    return;
                }
                console.log('All rows in the comments table deleted successfully.');

                // Fetch updated data to send back to the renderer
                projectDb.all("SELECT * FROM CommentTable", (err, rows) => {
                    if (err) {
                        console.error('Error fetching data from comments table:', err.message);
                        return;
                    }

                    console.log('Data in the comments table after deletion:', rows);
                    mainWindow.webContents.send('all-comments', rows);
                });
            });

        })
    });

    // ipcMain.on('save-modified-svg', (event, { svgString }) => {
    //     const masdocPath = path.join(__dirname, 'Masters', 'masdoc.svg'); // Replace with actual file name
    //     const backupPath = path.join(__dirname, 'Masterrev', `masdoc_${Date.now()}.svg`); // Replace with actual file name

    //     // Ensure the backup directory exists
    //     if (!fs.existsSync(path.join(__dirname, 'Masterrev'))) {
    //       fs.mkdirSync(path.join(__dirname, 'Masterrev'));
    //     }

    //     // Move the old file to Masterrev folder
    //     fs.rename(masdocPath, backupPath, (err) => {
    //       if (err) {
    //         console.error('Failed to move old SVG:', err);
    //         return;
    //       }

    //       // Save the new SVG content
    //       fs.writeFile(masdocPath, svgString, (err) => {
    //         if (err) {
    //           console.error('Failed to save new SVG:', err);
    //         } else {
    //           console.log('SVG file saved successfully.');
    //         }
    //       });
    //     });
    //   });


    // ipcMain.on('copy-to-master', (event, { conndoc, masdoc }) => {
    //     const documentsFolderPath = path.join(selectedFolderPath, 'Documents');
    //     const mastersFolderPath = path.join(selectedFolderPath, 'Masters');
    //     const masterrevFolderPath = path.join(selectedFolderPath, 'Masterrev');

    //     // Ensure Masterrev folder exists
    //     if (!fs.existsSync(masterrevFolderPath)) {
    //         fs.mkdirSync(masterrevFolderPath);
    //         console.log('Masterrev folder created.');
    //     }

    //     // Copy masdoc file to Masterrev folder
    //     const masdocFileName = path.basename(masdoc);
    //     const masdocDestinationPath = path.join(masterrevFolderPath, masdocFileName);
    //     fs.copyFileSync(masdoc, masdocDestinationPath);
    //     console.log(`File '${masdocFileName}' copied to 'Masterrev' folder.`);

    //     // Replace file in Masters folder with conndoc file
    //     const conndocFileName = path.basename(conndoc);
    //     const conndocDestinationPath = path.join(mastersFolderPath, conndocFileName);
    //     fs.copyFileSync(conndoc, conndocDestinationPath);
    //     console.log(`File '${conndocFileName}' replaced in 'Masters' folder.`);
    // });

    // ipcMain.on('copy-to-master', (event, svgContent, filePath) => {
    //     fs.writeFile(filePath, svgContent, 'utf8', (err) => {
    //       if (err) {
    //         console.error('Failed to save the file:', err);
    //         event.reply('save-svg-response', 'failure');
    //       } else {
    //         console.log('File saved successfully');
    //         event.reply('save-svg-response', 'success');
    //       }
    //     });
    //   });





    // ipcMain.on('copy-to-master', (event, { svgString, originalMasdocPath }) => {
    //     console.log('Received svgData:', svgString);
    //     console.log('Original Masdoc Path:', originalMasdocPath);
    //     const masdocFolder = path.dirname(originalMasdocPath);
    //     const masdocFilename = path.basename(originalMasdocPath);
    //     const parentFolder = path.dirname(masdocFolder); // Get the parent directory of the Master folder
    //     const masterRevFolder = path.join(parentFolder, 'masterrev'); // Create masterrev in the parent directory

    //     if (!fs.existsSync(masterRevFolder)) {
    //         fs.mkdirSync(masterRevFolder);
    //     }

    //     // Copy original masdoc to masterrev folder
    //     const newMasterRevPath = path.join(masterRevFolder, masdocFilename);
    //     fs.copyFileSync(originalMasdocPath, newMasterRevPath);

    //     // Ensure svgData is a string before writing
    //     if (typeof svgString !== 'string') {
    //         console.error('svgData is not a string:', svgString);
    //         event.sender.send('save-modified-svg-complete', { success: false, error: 'svgData is not a string' });
    //         return;
    //     }

    //     // Replace original masdoc in Master folder with modified SVG
    //     fs.writeFileSync(originalMasdocPath, svgString);

    //     event.sender.send('save-modified-svg-complete', { success: true });
    //     mainWindow.webContents.send('store-master-fetched', originalMasdocPath);

    // });


    ipcMain.on('copy-to-master', (event, { svgString, originalMasdocPath }) => {
        console.log('Received svgData:', svgString);
        console.log('Original Masdoc Path:', originalMasdocPath);
        const masdocFolder = path.dirname(originalMasdocPath);
        const masdocFilename = path.basename(originalMasdocPath);
        const parentFolder = path.dirname(masdocFolder); // Get the parent directory of the Master folder
        const masterRevFolder = path.join(parentFolder, 'masterrev'); // Create masterrev in the parent directory

        if (!fs.existsSync(masterRevFolder)) {
            fs.mkdirSync(masterRevFolder);
        }

        // Copy original masdoc to masterrev folder
        const newMasterRevPath = path.join(masterRevFolder, masdocFilename);
        fs.copyFileSync(originalMasdocPath, newMasterRevPath);

        // Ensure svgData is a string before writing
        if (typeof svgString !== 'string') {
            console.error('svgData is not a string:', svgString);
            event.sender.send('save-modified-svg-complete', { success: false, error: 'svgData is not a string' });
            return;
        }

        // Replace original masdoc in Master folder with modified SVG
        fs.writeFileSync(originalMasdocPath, svgString, 'utf8');

        event.sender.send('save-modified-svg-complete', { success: true });
        mainWindow.webContents.send('store-master-fetched', originalMasdocPath);

    });



    ipcMain.on('backup-masdoc', (event, originalMasdocPath) => {
        const masdocFolder = path.dirname(originalMasdocPath);
        const masdocFilename = path.basename(originalMasdocPath);
        const parentFolder = path.dirname(masdocFolder); // Get the parent directory of the Master folder
        const masterRevFolder = path.join(parentFolder, 'masterrev'); // Create masterrev in the parent directory

        if (!fs.existsSync(masterRevFolder)) {
            fs.mkdirSync(masterRevFolder);
        }

        // Copy original masdoc to masterrev folder
        const newMasterRevPath = path.join(masterRevFolder, masdocFilename);
        fs.copyFileSync(originalMasdocPath, newMasterRevPath);

        // // Replace original masdoc in Master folder with modified SVG
        // fs.writeFileSync(originalMasdocPath, svgString);

        event.sender.send('save-modified-svg-complete', { success: true });
        // mainWindow.webContents.send('store-master-fetched', svgString);

    });

    //   ipcMain.on('update-masdoc', (event, { svgString, originalMasdocPath }) => {
    //     const masdocFolder = path.dirname(originalMasdocPath);
    //     const masdocFilename = path.basename(originalMasdocPath);
    //     // const parentFolder = path.dirname(masdocFolder); // Get the parent directory of the Master folder
    //     // const masterRevFolder = path.join(parentFolder, 'masterrev'); // Create masterrev in the parent directory

    //     // if (!fs.existsSync(masterRevFolder)) {
    //     //   fs.mkdirSync(masterRevFolder);
    //     // }

    //     // // Copy original masdoc to masterrev folder
    //     // const newMasterRevPath = path.join(masterRevFolder, masdocFilename);
    //     // fs.copyFileSync(originalMasdocPath, newMasterRevPath);

    //     // Replace original masdoc in Master folder with modified SVG
    //     fs.writeFileSync(originalMasdocPath, svgString);

    //     event.sender.send('save-modified-svg', { success: true });
    //     // mainWindow.webContents.send('store-master-fetched', svgString);

    //   });

    ipcMain.on('update-masdoc', (event, { path: masdocPath, content }) => {
        try {
            fs.writeFileSync(masdocPath, content);
            console.log('Masdoc updated successfully');
        } catch (error) {
            console.error('Error updating masdoc:', error);
        }
    });

    ipcMain.on('save-svg', (event, { svgString, filePath }) => {
        fs.writeFile(filePath, svgString, (err) => {
            if (err) {
                console.error('Failed to save SVG file:', err);
                event.reply('save-svg-reply', { success: false, error: err.message });
            } else {
                console.log('SVG file saved successfully.');
                event.reply('save-svg-reply', { success: true });
            }
        });
    });
    ipcMain.on('read-svg-file', (event, filePath) => {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            event.reply('read-svg-file-response', { data });
        } catch (err) {
            console.error(err);
            event.reply('read-svg-file-response', { error: err.message });
        }
    });

    ipcMain.on('add-taginfoname-table', (event, data) => {
        console.log("Received request to save tag info name");
        if (!databasePath) {
            console.error('Project database path not available.');
            return;
        }

        // Open the project's database
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }
            // db.run("CREATE TABLE IF NOT EXISTS Tags ( tagId TEXT,tagNumber TEXT, tagName TEXT, tagType TEXT)");
            // const commentId = uuid.v4();
            // const commentId = generateCustomID('C');
            // Insert data into the Tree table of the project's database
            projectDb.run('INSERT INTO TagInfoName (id,field,unit) VALUES (?,?,?)', [data.id, data.field, data.unit], function (err) {
                if (err) {
                    // console.error('Error inserting data:', err.message);
                    return;
                }
                console.log('Row inserted with field: ${data.field}');
            });

            projectDb.all("SELECT * FROM TagInfoName", (err, rows) => {
                if (err) {
                    // console.error('Error fetching data from Tree table:', err.message);
                    return;
                }

                console.log('Data in the TagInfoName table:', rows);
                mainWindow.webContents.send('all-taginfoname-fetched', rows);
            });
        });
    })

    ipcMain.on('saveUserDefinedFields', (event, fields) => {
        const projectDb = new sqlite3.Database(databasePath, (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                event.reply('saveUserDefinedFieldsResult', { success: false, error: err.message });
                return;
            }

            // Begin transaction for atomic operation
            projectDb.run('BEGIN TRANSACTION');

            fields.forEach(({ id, field, unit }) => {
                projectDb.run(
                    'INSERT OR REPLACE INTO UserTagInfoFieldUnits (id, field, unit ) VALUES (?, ?, ?)',
                    [id, field, unit],
                    (err) => {
                        if (err) {
                            console.error('Error saving fields:', err);
                            event.reply('saveUserDefinedFieldsResult', { success: false, error: err.message });
                        } else {
                            console.log('Field saved successfully:', { id, field, unit });
                        }
                    }
                );
            });

            // Commit transaction
            projectDb.run('COMMIT', (err) => {
                if (err) {
                    console.error('Error committing transaction:', err);
                    event.reply('saveUserDefinedFieldsResult', { success: false, error: err.message });
                } else {
                    console.log('Transaction committed successfully.');
                    event.reply('saveUserDefinedFieldsResult', { success: true });

                    // Fetch all data after successful commit (optional)
                    projectDb.all("SELECT * FROM UserTagInfoFieldUnits", (err, rows) => {
                        if (err) {
                            console.error('Error fetching data from UserTagInfoFieldUnits table:', err.message);
                        } else {
                            console.log("All fields from UserTagInfoFieldUnits:", rows);
                            mainWindow.webContents.send('all-fields-user-defined', rows);
                        }
                    });
                }
            });
        });
    });

    ipcMain.on('import-taginfo-list', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
        });

        if (result.canceled) return;
        const confirmation = await dialog.showMessageBox({
            type: 'question',
            buttons: ['Cancel', 'Upload'],
            defaultId: 1,
            title: 'Confirm Upload',
            message: 'Do you want to upload this file?'
        });

        if (confirmation.response !== 1) return;

        const filePath = result.filePaths[0];
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const taginfolist = xlsx.utils.sheet_to_json(sheet);

        const projectDb = new sqlite3.Database(databasePath, async (err) => {
            if (err) {
                console.error('Error opening project database:', err.message);
                return;
            }

            projectDb.all("SELECT * FROM UserTagInfoFieldUnits", (err, rows) => {
                if (err) {
                    console.error('Error fetching data from Tree table:', err.message);
                    return;
                }
            });
            const userFieldUnits = await new Promise((resolve, reject) => {
                projectDb.all("SELECT * FROM UserTagInfoFieldUnits", (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });

            taginfolist.forEach((taginfo) => {
                const { tag } = taginfo;

                projectDb.get('SELECT * FROM TagInfo WHERE tag = ?', [tag], (err, row) => {
                    if (err) {
                        console.error('Error checking existing tag in LineList:', err.message);
                        return;
                    }

                    if (row) {
                        const updatedTagInfo = {
                            tagId: row.tagId,
                            tag: tag,
                            type: taginfo.type || row.type,
                        }
                        userFieldUnits.forEach((unitRow, index) => {
                            const rowName = `taginfo${index + 1}`;
                            const fieldName = unitRow.field;
                            updatedTagInfo[rowName] = taginfo[fieldName] || row[rowName];
                        });
                        console.log(updatedTagInfo);

                        // Construct the update query
                        let updateQuery = 'UPDATE TagInfo SET ';
                        const updateValues = [];

                        Object.keys(updatedTagInfo).forEach((key) => {
                            if (key !== 'tagId') {
                                updateQuery += `${key} = ?, `;
                                updateValues.push(updatedTagInfo[key]);
                            }
                        });

                        // Remove the trailing comma and space, and add the WHERE clause
                        updateQuery = updateQuery.slice(0, -2) + ' WHERE tagId = ?';
                        updateValues.push(updatedTagInfo.tagId);

                        projectDb.run(updateQuery, updateValues, (updateErr) => {
                            if (updateErr) {
                                console.error('Error updating tag in TagInfo:', updateErr.message);
                            } else {
                                console.log(`Tag ${tag} updated successfully.`);
                                // Fetch updated data from the LineList table
                                projectDb.all("SELECT * FROM TagInfo", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from tagInfo table:', err.message);
                                        return;
                                    }

                                    mainWindow.webContents.send('all-taginfo-fetched', rows);
                                });
                            }
                        });
                    }

                    else {
                        const TagId = generateCustomID('T');
                        const newTagInfo = {
                            tagId: TagId,
                            tag: tag,
                            type: taginfo.type,
                        };

                        userFieldUnits.forEach((unitRow, index) => {
                            const rowName = `taginfo${index + 1}`;
                            const fieldName = unitRow.field;
                            newTagInfo[rowName] = taginfo[fieldName] || '';
                        });
                        const fields = Object.keys(newTagInfo).join(', ');
                        const placeholders = Object.keys(newTagInfo).map(() => '?').join(', ');
                        const insertQuery = `INSERT INTO TagInfo (${fields}) VALUES (${placeholders})`;

                        projectDb.run(insertQuery, Object.values(newTagInfo), (insertErr) => {
                            if (insertErr) {
                                console.error('Error inserting new tag into TagInfo:', insertErr.message);
                            } else {
                                console.log(`Tag ${tag} inserted successfully.`);
                                // Insert into Tags table
                                projectDb.run('INSERT INTO Tags (tagId, number, type) VALUES (?, ?, ?)', [TagId, tag, newTagInfo.type], (tagsErr) => {
                                    if (tagsErr) {
                                        console.error('Error inserting tag into Tags:', tagsErr.message);
                                    }
                                });
                                // Insert into LineList or Equipment table based on type
                                if (newTagInfo.type === 'Line') {
                                    projectDb.run('INSERT INTO LineList (tagId, tag) VALUES (?, ?)', [TagId, tag], (lineErr) => {
                                        if (lineErr) {
                                            console.error('Error inserting tag into LineList:', lineErr.message);
                                        }
                                    });
                                } else if (newTagInfo.type === 'Equipment') {
                                    projectDb.run('INSERT INTO EquipmentList (tagId, tag) VALUES (?, ?)', [TagId, tag], (equipmentErr) => {
                                        if (equipmentErr) {
                                            console.error('Error inserting tag into Equipment:', equipmentErr.message);
                                        }
                                    });
                                }
                                // Fetch updated data from the TagInfo table
                                projectDb.all("SELECT * FROM TagInfo", (fetchErr, rows) => {
                                    if (fetchErr) {
                                        console.error('Error fetching data from TagInfo table:', fetchErr.message);
                                        return;
                                    }

                                    mainWindow.webContents.send('all-taginfo-fetched', rows);
                                });
                                projectDb.all("SELECT * FROM LineList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from LineList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-lines-fetched', rows);
                                });
                                projectDb.all("SELECT * FROM Tags", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from Tags table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-tags-fetched', rows);
                                });
                                projectDb.all("SELECT * FROM EquipmentList", (err, rows) => {
                                    if (err) {
                                        console.error('Error fetching data from EquipmentList table:', err.message);
                                        return;
                                    }
                                    mainWindow.webContents.send('all-equipement-fetched', rows);
                                });

                            }
                        })

                    }
                })
            })



        });
    });
});