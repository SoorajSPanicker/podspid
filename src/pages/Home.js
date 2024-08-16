import React, { useEffect, useRef, useState } from 'react'
import './Home.css'
import Taginfo from '../components/Taginfo';
import Header from '../components/Header';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Linelist from '../components/Linelist';
import Equlist from '../components/Equlist';
import Alert from '../components/Alert';
import Canvas from '../components/Canvas';
import DeleteConfirm from '../components/DeleteConfirm';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CommentReview from '../components/CommentReview';

function Home() {
  var file = {}
  const fileInputRef = useRef(null);
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [loadProject, setloadProject] = useState(false);
  const [isequlist, setequlist] = useState(false)
  const [isDiv1Visible, setIsDiv1Visible] = useState(true);
  const [istagsubopt, settagsubopt] = useState(false)
  const [iscomsubopt, setcomsubopt] = useState(false)
  const [istaginfoopt, settaginfoopt] = useState(false)
  const [isdocsubopt, setdocsubopt] = useState(false)
  const [islinelist, setlinelist] = useState(false)
  const [istagreview, settagreview] = useState(false)
  const [istaginforeview, settaginforeview] = useState(false)
  const [istaginfoedit, settaginfoedit] = useState(false)
  const [istagreg, settagreg] = useState(false)
  const [isinfosubopt, setinfosubopt] = useState(false)
  const [svgcontent, setsvgcontent] = useState('')
  const [mascontent, setmascontent] = useState('')
  const [showcanvas, setshowcanvas] = useState(false)
  const [isdocreview, setdocreview] = useState(false)
  const [iscomreview, setcomreview] = useState(false)
  const [iscomstareview, setcomstareview] = useState(false)
  const [iscomreg, setcomreg] = useState(false)
  const [isdocreg, setdocreg] = useState(false)
  const [isareareg, setareareg] = useState(false)
  const [showallprojects, setshowallprojects] = useState(false);
  const [projectNumber, setProjectNumber] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [showprojectmodal, setshowprojectmodal] = useState(false);
  const [projectNo, setprojectNo] = useState('')
  const [selectedDirectory, setSelectedDirectory] = useState('');
  const [projectFolder, setProjectFolder] = useState('');
  const [selectedprojectPath, setselectedprojectPath] = useState('')
  const [customAlert, setCustomAlert] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [allprojects, setallprojects] = useState([])
  const [areaNumber, setareaNumber] = useState('')
  const [areaName, setareaName] = useState('')
  const [tagNumber, settagNumber] = useState('')
  const [tagName, settagName] = useState('')
  const [tagType, settagType] = useState('')
  const [alltags, setAlltags] = useState([]);
  const [allareas, setallareas] = useState([]);
  const [alllines, setalllines] = useState([])
  const [allEquipementList, setallEquipementList] = useState([])
  const [alldocs, setAlldocs] = useState([]);
  const [docNumber, setdocNumber] = useState('')
  const [docTitle, setdocTitle] = useState('')
  const [docDes, setdocDes] = useState('')
  const [docType, setdocType] = useState('')
  const [docFilename, setdocFilename] = useState('')
  const [docFilepath, setdocFiilepath] = useState('')
  const [allspids, setAllspids] = useState([]);
  const [taginfo, settaginfo] = useState([])
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentDeleteNumber, setCurrentDeleteNumber] = useState(null);
  const [mapprojectmodal, setmapProjectModal] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showcomConfirm, setShowcomConfirm] = useState(false);
  const [showdocConfirm, setShowdocConfirm] = useState(false);
  const [allcomments, setallcomments] = useState([])
  const [importTag, setImportTag] = useState(false);
  const [docimportTag, setdocImportTag] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editedcomrowIndex, setEditedcomrowIndex] = useState(-1);
  const [statusinfo1, setstatusinfo1] = useState('')
  const [colorinfo1, setcolorinfo1] = useState('')
  const [currentDeleteTag, setCurrentDeleteTag] = useState('');
  const [commentdet, setcommentdet] = useState([])
  const [StatusName, setStatusName] = useState('')
  const [isColor, setColor] = useState('')
  const [editeddocRowIndex, setEditeddocRowIndex] = useState(-1);
  const [title1, settitle1] = useState('')
  const [descr1, setdescr1] = useState('')
  const [type1, settype1] = useState('')
  const [tagname1, settagname1] = useState('')
  const [tagtype1, settagtype1] = useState('')
  const [editedtageditIndex, setEditedtageditIndex] = useState(-1);
  const [searchtagQuery, setSearchtagQuery] = useState(''); // Add search state
  const [currentDeletedoc, setCurrentDeletedoc] = useState('');
  const [ismaster, setmaster] = useState({})
  const [showmasConfirm, setShowmasConfirm] = useState(false);
  const [masterid, setmasterid] = useState('')
  const [generalTagInfoFields, setGeneralTagInfoFields] = useState([])
  const [sindocid, setsindocid] = useState('')
  const [taginfohead, settaginfohead] = useState([])
  const [tagdocsel, settagdocsel] = useState([])

  useEffect(() => {
    // Request data from main process when component mounts
    console.log("Sending 'fetch-data' request to main process");
    window.api.send('fetch-data');
    console.log("Receiving response from main process ");

    // Listen for response from main process
    window.api.receive('data-fetched', (data) => {
      console.log("Received data from main process:", data);
      // console.log(data.projectNumber);
      setallprojects(data);
      // handleOpenProject()
    });
  }, []);

  useEffect(() => {
    window.api.receive('save-data-response', (response) => {
      if (response.success) {
        setProjectFolder(response.project.projectName);
        setprojectNo(response.project.projectNumber);
        setselectedprojectPath(response.project.projectPath)
        setCustomAlert(true);
        setModalMessage(response.message);
      }
      else {
        setCustomAlert(true);
        setModalMessage(response.message);

      }

    })
  }, [])

  useEffect(() => {
    // Define the function to handle IPC messages
    const handleDataFetched = (data) => {
      console.log("Received data from main process:", data);
      setSelectedDirectory(data);
      // setnewwinprofold(data)
    };

    // window.api.receive('data-fetched', handleDataFetched);
    window.api.receive('select-folder-fetched', handleDataFetched);
  }, []);

  useEffect(() => {
    console.log(alltags);
  }, [alltags])

  useEffect(() => {
    window.api.receive('all-tags-fetched', (data) => {
      console.log("Received data from main process:", data);
      setAlltags(data);
    });
  }, []);

  useEffect(() => {
    window.api.receive('all-taginfo-fetched', (data) => {
      console.log("Received data from main process:", data);
      settaginfo(data)
    });
  }, []);

  useEffect(() => {
    console.log(taginfo);
  }, [taginfo])

  useEffect(() => {
    console.log(generalTagInfoFields);
  }, [generalTagInfoFields])

  useEffect(() => {
    window.api.receive('all-line-fetched', (data) => {
      console.log("Received data from main process:", data);
      setalllines(data)
    });
  }, []);

  useEffect(() => {
    console.log(alllines);
  }, [alllines])

  useEffect(() => {
    console.log(allEquipementList);
  }, [allEquipementList])

  useEffect(() => {
    window.api.receive('all-equ-fetched', (data) => {
      console.log("Received data from main process:", data);
      setallEquipementList(data)
    });
  }, []);

  useEffect(() => {
    window.api.receive('all-docs-fetched', (data) => {
      console.log("Received data from main process:", data);
      setAlldocs(data);
    });
  }, []);

  useEffect(() => {
    window.api.receive('spid-docs-fetched', (data) => {
      console.log("Received data from main process:", data);
      setAllspids(data);
    });
  }, []);

  useEffect(() => {
    console.log(allspids);
  }, [allspids])

  useEffect(() => {
    window.api.receive('sin-doc-fetched', (data) => {
      console.log("Received data from main process:", data);
      setsvgcontent(data);
    });
  }, []);

  useEffect(() => {
    console.log(svgcontent);
  }, [svgcontent])

  useEffect(() => {
    window.api.receive('all-elements-fetched', (data) => {
      console.log("Received data from main process:", data);
    });
  }, []);

  useEffect(() => {
    console.log(allareas);
  }, [allareas])

  useEffect(() => {
    window.api.receive('all-area-fetched', (data) => {
      console.log("Received data from main process:", data);
      // const areaNumbers = data.map(area => area.areaNumber);
      // console.log(areaNumbers);
      setallareas(data)
    });
  }, []);



  useEffect(() => {
    console.log(sindocid);
  }, [sindocid])


  useEffect(() => {
    window.api.receive('delete-all-project-response', () => {
      setCustomAlert(true);
      setModalMessage('All projects deleted successfully!!!!')
    })
  }, [])


  useEffect(() => {
    window.api.receive('delete-project-response', (data) => {
      setCustomAlert(true);
      setModalMessage(`${data} deleted successfully!!!!`)
    })
  }, [])

  useEffect(() => {
    window.api.receive('all-comments', (data) => {
      console.log("Received data from main process:", data);
      setallcomments(data)
    });
  }, []);


  useEffect(() => {
    console.log(allcomments);
  }, [allcomments])

  useEffect(() => {
    window.api.receive('all-comments-fetched', (data) => {
      console.log("Received data from main process:", data);
      setcommentdet(data)
    });
  }, []);

  useEffect(() => {
    window.api.receive('master-doc-fetched', (data) => {
      console.log("Received data from main process:", data);
      setmascontent(data)
      setCustomAlert(true);
      setModalMessage('Smart master added')
    });
  }, []);

  useEffect(() => {
    window.api.receive('store-master-fetched', (data) => {
      console.log("Received data from main process:", data);
      setmascontent(data)
    });
  }, [])

  useEffect(() => {
    window.api.receive('master-checked', (data) => {
      console.log("Received data from main process:", data);
      setmaster(data)
    });
  }, []);

  useEffect(() => {
    console.log(ismaster);
    if (Object.keys(ismaster).length === 0) {
      console.log('hello');
      if (masterid != '') {
        console.log(masterid);
        window.api.send('fetch-sin-doc', masterid);
        window.api.send('fetch-sin-docdetails', masterid)
        // setIsDiv1Visible(!isDiv1Visible);
        setIsDiv1Visible(false)
        setlinelist(false)
        setshowcanvas(true)
        setShowmasConfirm(true)
      }
    }
    else {
      console.log('hi');
      if (masterid != '') {
        console.log(masterid);
        window.api.send('fetch-sin-doc', masterid);
        window.api.send('fetch-sin-docdetails', masterid)
        window.api.send('fetch-master-doc', masterid)
        // setIsDiv1Visible(!isDiv1Visible);
        setIsDiv1Visible(false)
        setlinelist(false)
        setshowcanvas(true)
      }
    }
  }, [ismaster])

  useEffect(() => {
    console.log(isSideNavOpen);
  }, [isSideNavOpen])

  useEffect(() => {
    console.log(commentdet);
  }, [commentdet])

  useEffect(() => {
    console.log(masterid);
  }, [masterid])

  useEffect(() => {
    console.log(mascontent);
  }, [mascontent])

  useEffect(() => {
    window.api.receive('all-fields-user-defined', (data) => {
      console.log(data);
      setGeneralTagInfoFields(data);
    });
  }, []);

  useEffect(() => {
    console.log(taginfohead);
  }, [taginfohead])

  useEffect(() => {
    window.api.receive('all-taginfoname-fetched', (data) => {
      console.log(data);
      settaginfohead(data)
    });
  }, [])

  const handleLoadProject = () => {
    console.log("open projectmodal")
    setloadProject(true);
  }

  const handlesidetoggle = () => {
    setIsSideNavOpen(false)
  }
  const handleopensidetoggle = () => {
    setIsSideNavOpen(true)
  }
  const spidallops = () => {
    setshowcanvas(false)
    setsvgcontent('')
    setmascontent('')
  }

  const handlecreatenewproject = () => {
    setshowprojectmodal(true);
  }

  const handleClose = () => setloadProject(false);

  const handleOpenProject = (projectNumber, projectName, projectPath) => {
    if (projectNumber) {
      console.log("Sending 'open-project' request to main process");
      setprojectNo(projectNumber);
      setProjectFolder(projectName);
      setselectedprojectPath(projectPath);
      // console.log("token", tokennumber)
      handleClose();
      window.api.send('open-project', projectNumber);
    }
  };

  // const handleshowallprojects = () => {
  //   setshowallprojects(!showallprojects);
  // }



  const handleCloseProject = () => {
    setshowprojectmodal(false)
    console.log(showprojectmodal)
  }

  const handleDirectoryChange = () => {
    console.log("Sending 'select-folder' request to main process");
    window.api.send('select-folder');
  };

  const handleCreateProject = () => {
    // Check if project name is provided
    console.log(projectNumber)
    console.log(projectName)
    console.log(projectDescription)
    console.log(selectedDirectory);
    setProjectFolder(projectName);


    if (!projectNumber && !projectName && !selectedDirectory) {
      setCustomAlert(true);
      setModalMessage('Please fill all fields and choose a folder');
      // alert('Please fill all fields and choose a folder');
      return;
    }
    else {
      const data = {
        projectNumber: projectNumber,
        projectName: projectName,
        projectDescription: projectDescription,
        selectedDirectory: selectedDirectory
      };

      setProjectNumber('')
      setProjectName('')
      setProjectDescription('')
      setSelectedDirectory('');
      window.api.send('save-data', data);
      setCustomAlert(true);
      setModalMessage("data added");
      // alert("data added")
      handleCloseProject()
      handleClose();

    }
  };

  const handleReg = async (e) => {
    e.preventDefault()
    console.log(tagName);
    console.log(tagNumber);
    console.log(tagType);
    if (!tagName && !tagNumber && !tagType) {
      setCustomAlert(true);
      setModalMessage('Please fill all fields ');
      // alert('Please fill all fields ');
      return;
    }
    else {
      const tdata = {
        tagName: tagName,
        tagNumber: tagNumber,
        tagType: tagType,
      };

      window.api.send('save-tag-data', tdata);
      setCustomAlert(true);
      setModalMessage("tag registered");
      // alert("tag registered")
      settagName('')
      settagNumber('')
      settagType('')
    }
  }

  const handleareaReg = async (e) => {
    e.preventDefault()

    if (!areaName && !areaNumber) {
      setCustomAlert(true);
      setModalMessage('Please fill all fields ');
      // alert('Please fill all fields ');
      return;
    }
    else {
      console.log(areaName);
      console.log(areaNumber);
      const tdata = {
        areaName: areaName,
        areaNumber: areaNumber
      };

      window.api.send('save-area-data', tdata);
      setCustomAlert(true);
      setModalMessage("area registered");
      // alert("tag registered")
      setareaName('')
      setareaNumber('')
    }
  }


  const handledocReg = (e) => {
    e.preventDefault()
    console.log(docNumber);
    console.log(docTitle);
    console.log(docDes);
    console.log(docFilename);
    console.log(docFilepath);
    console.log(docType);

    if (!docNumber && !docType) {
      setCustomAlert(true);
      setModalMessage('Please fill all fields and choose a folder');
      // alert('Please fill all fields and choose a folder');
      return;
    }
    else {
      const data = {
        number: docNumber,
        title: docTitle,
        descr: docDes,
        type: docType,
        filename: docFilename,
        filePath: docFilepath
      };
      setdocNumber('')
      setdocTitle('')
      setdocDes('')
      setdocType('');
      setdocFilename('')
      setdocFiilepath('')
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      window.api.send('save-doc-data', data);
      setCustomAlert(true);
      setModalMessage("Document added");
      // alert("Document added")
      handleCloseProject()
      handleClose();
    }

  }

  const handledocadd = (event) => {
    console.log(event);
    file = event.target.files[0];
    console.log(file);
    console.log(file.name);
    console.log(file.path);
    setdocFilename(file.name)
    setdocFiilepath(file.path)
  }

  const handledocdis = async (id, docId) => {
    console.log("Enter doc click");
    setmasterid(id)
    setsindocid(docId)
    window.api.send('check-master', id);
    // if (ismaster == false) {
    //   setmasterid(id)
    // setShowmasConfirm(true)
    // setshowcanvas(true)
    // }



    // console.log(id);
    // window.api.send('fetch-sin-doc', id);
    // window.api.send('fetch-sin-docdetails', id)
    // setIsDiv1Visible(!isDiv1Visible);
    // setshowcanvas(true)
  }

  const doctype = [
    { code: 'AA', name: 'Accounting/Budget' },
    { code: 'CA', name: 'Analysis, test and calculation' },
    { code: 'DS', name: 'Data sheets' },
    { code: 'FD', name: 'Project design criteria and philosophies' },
    { code: 'iKA', name: 'Interactive procedures' },
    { code: 'iXB', name: 'Smart P&ID' },
    { code: 'iXX', name: 'H-Doc' },
    { code: 'KA', name: 'Procedures' },
    { code: 'LA', name: 'List/Registers' },
    { code: 'MA', name: 'Equipment user manual (ref. NS5820)' },
    { code: 'MB', name: 'Operating and maintenance instructions' },
    { code: 'MC', name: 'Spare parts list' },
    { code: 'PA', name: 'Purchase orders' },
    { code: 'PB', name: 'Blanket order/frame agreement' },
    { code: 'PD', name: 'Contract' },
    { code: 'RA', name: 'Reports' },
    { code: 'RD', name: 'System design reports and system user manuals' },
    { code: 'RE', name: 'DFI (Design - Fabrication - Installation) resumes' },
    { code: 'SA', name: 'Specifications & Standards' },
    { code: 'TA', name: 'Plans/schedules' },
    { code: 'TB', name: 'Work plan' },
    { code: 'TE', name: 'Estimates' },
    { code: 'TF', name: 'Work package' },
    {
      code: 'VA', name: 'Manufacturing/Fabrication and verifying documentation, including certificate of performance, material tractability, weld and '
        + 'NDE documents, list of certificates, third party verification/certificates and photos of submerged structures/equipment'
    },
    { code: 'VB', name: 'Certificates' },
    { code: 'XA', name: 'Flow diagrams' },
    { code: 'XB', name: 'Pipe and instrument diagram (P&ID)' },
    { code: 'XC', name: 'Duct and instrument diagrams (D&ID)' },
    { code: 'XD', name: 'General arrangement' },
    { code: 'XE', name: 'Layout drawings' },
    { code: 'XF', name: 'Location drawings (plot plans)' },
    {
      code: 'XG', name: 'Structural information;  including main structural steel, secondary/outfitting steel, structural fire protection and '
        + 'acoustic/thermal insulation and fire protection'
    },
    { code: 'XH', name: 'Free span calculation' },
    { code: 'XI', name: 'System topology and block diagrams' },
    { code: 'XJ', name: 'Single line diagrams' },
    { code: 'XK', name: 'Circuit diagrams' },
    { code: 'XL', name: 'Logic diagrams' },
    { code: 'XM', name: 'Level diagrams' },
    { code: 'XN', name: 'Isometric drawings, including fabrication, heat tracing, stress and pressure testing' },
    { code: 'XO', name: 'Piping supports' },
    { code: 'XQ', name: 'Pneumatic/hydraulic connection drawings' },
    { code: 'XR', name: 'Cause and effect' },
    { code: 'XS', name: 'Detail cross sectional drawings' },
    { code: 'XT', name: 'Wiring diagrams' },
    { code: 'XU', name: 'Loop diagram' },
    { code: 'XX', name: 'Drawings - miscellaneous' },
    { code: 'ZA', name: 'EDP documentation' }
  ]

  const handleDeleteProject = (projectId) => {
    console.log("projectId", projectId)
    setItemToDelete({ type: 'deleteproject', data: projectId });
    setCurrentDeleteNumber(projectId);
    setShowConfirm(true);
  }

  const handleMapProject = () => {
    setmapProjectModal(true);
  }

  const handleDeleteEntireProject = () => {
    setItemToDelete({ type: 'deleteall' });
    setShowConfirm(true);
  }

  const handleConfirm = () => {
    setShowConfirm(false);
    switch (itemToDelete.type) {
      case 'deleteall':
        window.api.send('delete-all-project');
        handleClose()
        break;
      case 'deleteproject':
        window.api.send('delete-project', currentDeleteNumber);
        handleClose()
        break;
      default:
        break;
    }
    setShowConfirm(false);
    setItemToDelete(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };


  const handlespidopt = () => {
    setIsDiv1Visible(true)
    spidallops()
    settagsubopt(false)
    settagreview(false)
    settagreg(false)
    setequlist(false)
    setlinelist(false)
    setdocsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomreview(false)
    setcomsubopt(false)
    setcomreg(false)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }

  const handleequopt = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagreview(false)
    setlinelist(false)
    setequlist(true)
    settagreg(false)
    settagsubopt(false)
    setdocsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomreview(false)
    setcomsubopt(false)
    setcomreg(false)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }


  const handlelineopt = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagreview(false)
    setlinelist(true)
    setequlist(false)
    settagreg(false)
    settagsubopt(false)
    setdocsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomreview(false)
    setcomsubopt(false)
    setcomreg(false)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }

  const handletagsubopt = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagsubopt(true)
    settagreview(true)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    setdocsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomreview(false)
    setcomsubopt(false)
    setcomreg(false)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }

  const handletagoptrev = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagsubopt(true)
    settagreview(true)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    setdocsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomreview(false)
    setcomreg(false)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }

  const handletagoptreg = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagsubopt(true)
    settagreview(false)
    setlinelist(false)
    setequlist(false)
    settagreg(true)
    setdocsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomreview(false)
    setcomsubopt(false)
    setcomreg(false)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }
  const handlearearegister = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagsubopt(true)
    settagreview(false)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    setdocsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(true)
    settaginfoopt(false)
    setcomreview(false)
    setcomsubopt(false)
    setcomreg(false)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }
  const handledocopt = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagreview(false)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    setdocsubopt(true)
    setdocreview(true)
    setdocreg(false)
    settagsubopt(false)
    setareareg(false)
    settaginfoopt(false)
    setcomreview(false)
    setcomsubopt(false)
    setcomreg(false)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }

  const handledocoptreview = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagreview(false)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    settagsubopt(false)
    setdocreview(true)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomreview(false)
    setcomsubopt(false)
    setcomreg(false)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }

  const handledocoptreg = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagreview(false)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    settagsubopt(false)
    setdocreview(false)
    setdocreg(true)
    setareareg(false)
    settaginfoopt(false)
    setcomreview(false)
    setcomsubopt(false)
    setcomreg(false)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }

  const handlecomsubopt = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagreview(false)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    settagsubopt(false)
    setdocsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomsubopt(true)
    setcomreview(false)
    setcomreg(false)
    setcomstareview(true)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }

  const handlecomoptstatus = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagreview(false)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    settagsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomsubopt(true)
    setcomreview(true)
    setcomreg(false)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }

  const handlecomoptreg = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagreview(false)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    settagsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomsubopt(true)
    setcomreview(false)
    setcomreg(true)
    setcomstareview(false)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }

  const handlecomoptreview = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagreview(false)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    settagsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomsubopt(true)
    setcomreview(false)
    setcomreg(false)
    setcomstareview(true)
    settaginforeview(false)
    settaginfoedit(false)
    setinfosubopt(false)
  }

  const handletaginfosubopt = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagreview(false)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    settagsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomsubopt(false)
    setcomreview(false)
    setcomreg(false)
    setcomstareview(false)
    setinfosubopt(true)
    settaginforeview(true)
    settaginfoedit(false)
  }

  const handleinfoptrev = () => {
    setIsDiv1Visible(false)
    spidallops()
    settagreview(false)
    setlinelist(false)
    setequlist(false)
    settagreg(false)
    settagsubopt(false)
    setdocreview(false)
    setdocreg(false)
    setareareg(false)
    settaginfoopt(false)
    setcomsubopt(false)
    setcomreview(false)
    setcomreg(false)
    setcomstareview(false)
    setinfosubopt(true)
    settaginforeview(true)
    settaginfoedit(false)
  }

  // const handleinfoptedit = () => {
  //   setIsDiv1Visible(false)
  //   spidallops()
  //   settagreview(false)
  //   setlinelist(false)
  //   setequlist(false)
  //   settagreg(false)
  //   settagsubopt(false)
  //   setdocreview(false)
  //   setdocreg(false)
  //   setareareg(false)
  //   settaginfoopt(false)
  //   setcomsubopt(false)
  //   setcomreview(false)
  //   setcomreg(false)
  //   setcomstareview(false)
  //   setinfosubopt(true)
  //   settaginforeview(false)
  //   settaginfoedit(true)
  // }



  const handletagreviewimport = () => {
    // window.api.send('import-tag-list');
    setImportTag(true);
  }

  const handleClosetag = () => {
    setImportTag(false);
  }

  const handleExcelFileChange = (e) => {
    setSelectedFile(e.target.files[0]);

  }

  const handleDownloadTemplate = () => {
    const headers = [
      'Tag Number*', 'Name', 'Type*'
    ];

    const data = [];

    const ws = XLSX.utils.json_to_sheet(data, { header: headers });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tag-Import-Template');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Tag-Import-Template.xlsx');
  };

  const handleImportClick = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const formattedData = jsonData.map(item => ({
          tagNumber: item['Tag Number*'],
          tagName: item['Name'],
          tagType: item['Type*']
        }));
        console.log(formattedData);
        window.api.send('import-tag-list', formattedData);
      };
      reader.readAsArrayBuffer(selectedFile);
      setImportTag(false);
      setSelectedFile('');
    }
  };

  const handleDeleteAllTags = () => {
    window.api.send('delete-all-tags')
  }

  const handlecomImportClick = () => {
    window.api.send('import-comment-details');
  };

  const handleDeletetagFromTable = (statusname) => {
    console.log(statusname);
    setCurrentDeleteTag(statusname);
    setShowcomConfirm(true);
  }

  const handleConfirmDelete = () => {
    window.api.send('remove-commentstatus-table', currentDeleteTag);
    setShowcomConfirm(false);
    setCurrentDeleteTag(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setCurrentDeleteTag(null);
  };

  const handleSavecomment = (statusinfo1) => {
    console.log(statusinfo1)
    console.log(colorinfo1)

    const data = {
      statusname: statusinfo1,
      color: colorinfo1
    }
    setEditedcomrowIndex(-1);
    setstatusinfo1('')
    setcolorinfo1('')

    console.log(data);
    window.api.send('update-comment-table', data);
  }

  const handleSavedoc = (number) => {
    console.log(number);
    console.log(title1);
    console.log(descr1);
    console.log(type1);
    console.log(docFilename);
    console.log(docFilepath);
    const data = {
      docId: number,
      title: title1,
      type: type1,
      descr: descr1,
      filename: docFilename,
      filePath: docFilepath
    }
    setEditeddocRowIndex(-1)
    settitle1('')
    setdescr1('')
    settype1('')
    setdocFilename('')
    setdocFiilepath('')
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    console.log(data);
    window.api.send('update-doc-table', data);
  }

  const handleCloseEdit = () => {
    setEditedcomrowIndex(-1);
  }

  const handleEditOpen = (index) => {
    setEditedcomrowIndex(index);
    setstatusinfo1(commentdet[index].statusname);
    setcolorinfo1(commentdet[index].color)

  }

  const handleCommentReg = async (e) => {
    e.preventDefault()
    console.log(StatusName);
    console.log(isColor);

    if (!StatusName && !isColor) {
      setCustomAlert(true);
      setModalMessage('Please fill all fields ');
      // alert('Please fill all fields ');
      return;
    }
    else {
      const tdata = {
        statusname: StatusName,
        color: isColor
      };

      window.api.send('add-commentdetails-table', tdata);
      setCustomAlert(true);
      setModalMessage("tag registered");
      // alert("tag registered")
      setStatusName('')
      setColor('')
    }
  }

  const handledocreviewimport = () => {

    setdocImportTag(true);
  }

  const handleClosedoc = () => setdocImportTag(false);

  const handleCloseEditdoc = () => {
    setEditeddocRowIndex(-1);
  }

  const handleEditOpendoc = (index) => {
    setEditeddocRowIndex(index);
    settitle1(alldocs[index].title);
    setdescr1(alldocs[index].descr)
    settype1(alldocs[index].type)

  }

  const handleDeletedocFromTable = (number) => {
    console.log(number);
    setCurrentDeletedoc(number);
    setShowdocConfirm(true);
  }

  const handleConfirmdocdel = () => {
    window.api.send('remove-tagdetails-table', currentDeletedoc);
    setShowdocConfirm(false);
    setCurrentDeletedoc(null);
  };

  const handleCanceldocdel = () => {
    setShowdocConfirm(false);
    setCurrentDeletedoc(null);
  };

  // const handleDownloaddocTemplate = () => {
  //   const headers = [
  //     'Document number*', 'Title', 'Descripton', 'Type*'
  //   ];

  //   const data = [];
  //   const wsTemplate = XLSX.utils.json_to_sheet(data, { header: headers });

  // const doctype = [
  //   { code: 'AA', name: 'Accounting/Budget' },
  //   { code: 'CA', name: 'Analysis, test and calculation' },
  //   { code: 'DS', name: 'Data sheets' },
  //   { code: 'FD', name: 'Project design criteria and philosophies' },
  //   { code: 'iKA', name: 'Interactive procedures' },
  //   { code: 'iXB', name: 'Smart P&ID' },
  //   { code: 'iXX', name: 'H-Doc' },
  //   { code: 'KA', name: 'Procedures' },
  //   { code: 'LA', name: 'List/Registers' },
  //   { code: 'MA', name: 'Equipment user manual (ref. NS5820)' },
  //   { code: 'MB', name: 'Operating and maintenance instructions' },
  //   { code: 'MC', name: 'Spare parts list' },
  //   { code: 'PA', name: 'Purchase orders' },
  //   { code: 'PB', name: 'Blanket order/frame agreement' },
  //   { code: 'PD', name: 'Contract' },
  //   { code: 'RA', name: 'Reports' },
  //   { code: 'RD', name: 'System design reports and system user manuals' },
  //   { code: 'RE', name: 'DFI (Design - Fabrication - Installation) resumes' },
  //   { code: 'SA', name: 'Specifications & Standards' },
  //   { code: 'TA', name: 'Plans/schedules' },
  //   { code: 'TB', name: 'Work plan' },
  //   { code: 'TE', name: 'Estimates' },
  //   { code: 'TF', name: 'Work package' },
  //   {
  //     code: 'VA', name: 'Manufacturing/Fabrication and verifying documentation, including certificate of performance, material tractability, weld and '
  //       + 'NDE documents, list of certificates, third party verification/certificates and photos of submerged structures/equipment'
  //   },
  //   { code: 'VB', name: 'Certificates' },
  //   { code: 'XA', name: 'Flow diagrams' },
  //   { code: 'XB', name: 'Pipe and instrument diagram (P&ID)' },
  //   { code: 'XC', name: 'Duct and instrument diagrams (D&ID)' },
  //   { code: 'XD', name: 'General arrangement' },
  //   { code: 'XE', name: 'Layout drawings' },
  //   { code: 'XF', name: 'Location drawings (plot plans)' },
  //   {
  //     code: 'XG', name: 'Structural information;  including main structural steel, secondary/outfitting steel, structural fire protection and '
  //       + 'acoustic/thermal insulation and fire protection'
  //   },
  //   { code: 'XH', name: 'Free span calculation' },
  //   { code: 'XI', name: 'System topology and block diagrams' },
  //   { code: 'XJ', name: 'Single line diagrams' },
  //   { code: 'XK', name: 'Circuit diagrams' },
  //   { code: 'XL', name: 'Logic diagrams' },
  //   { code: 'XM', name: 'Level diagrams' },
  //   { code: 'XN', name: 'Isometric drawings, including fabrication, heat tracing, stress and pressure testing' },
  //   { code: 'XO', name: 'Piping supports' },
  //   { code: 'XQ', name: 'Pneumatic/hydraulic connection drawings' },
  //   { code: 'XR', name: 'Cause and effect' },
  //   { code: 'XS', name: 'Detail cross sectional drawings' },
  //   { code: 'XT', name: 'Wiring diagrams' },
  //   { code: 'XU', name: 'Loop diagram' },
  //   { code: 'XX', name: 'Drawings - miscellaneous' },
  //   { code: 'ZA', name: 'EDP documentation' }
  // ];

  //   const headersType = ['Value', 'Description'];
  //   const dataType = doctype.map(item => ({ Value: item.code, Description: item.name }));
  //   const wsType = XLSX.utils.json_to_sheet(dataType, { header: headersType });

  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, wsTemplate, 'Doc-Import-Template');
  //   XLSX.utils.book_append_sheet(wb, wsType, 'Possible values for the type');

  //   const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  //   saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Doc-Import-Template.xlsx');
  // };

  const handleDownloaddocTemplate = () => {
    const headers = [
      'Document number*', 'Title', 'Description', 'Type*'
    ];

    // Prepare data with 'Possible values for the type'
    const doctype = [
      { code: 'AA', name: 'Accounting/Budget' },
      { code: 'CA', name: 'Analysis, test and calculation' },
      { code: 'DS', name: 'Data sheets' },
      { code: 'FD', name: 'Project design criteria and philosophies' },
      { code: 'iKA', name: 'Interactive procedures' },
      { code: 'iXB', name: 'Smart P&ID' },
      { code: 'iXX', name: 'H-Doc' },
      { code: 'KA', name: 'Procedures' },
      { code: 'LA', name: 'List/Registers' },
      { code: 'MA', name: 'Equipment user manual (ref. NS5820)' },
      { code: 'MB', name: 'Operating and maintenance instructions' },
      { code: 'MC', name: 'Spare parts list' },
      { code: 'PA', name: 'Purchase orders' },
      { code: 'PB', name: 'Blanket order/frame agreement' },
      { code: 'PD', name: 'Contract' },
      { code: 'RA', name: 'Reports' },
      { code: 'RD', name: 'System design reports and system user manuals' },
      { code: 'RE', name: 'DFI (Design - Fabrication - Installation) resumes' },
      { code: 'SA', name: 'Specifications & Standards' },
      { code: 'TA', name: 'Plans/schedules' },
      { code: 'TB', name: 'Work plan' },
      { code: 'TE', name: 'Estimates' },
      { code: 'TF', name: 'Work package' },
      {
        code: 'VA', name: 'Manufacturing/Fabrication and verifying documentation, including certificate of performance, material tractability, weld and '
          + 'NDE documents, list of certificates, third party verification/certificates and photos of submerged structures/equipment'
      },
      { code: 'VB', name: 'Certificates' },
      { code: 'XA', name: 'Flow diagrams' },
      { code: 'XB', name: 'Pipe and instrument diagram (P&ID)' },
      { code: 'XC', name: 'Duct and instrument diagrams (D&ID)' },
      { code: 'XD', name: 'General arrangement' },
      { code: 'XE', name: 'Layout drawings' },
      { code: 'XF', name: 'Location drawings (plot plans)' },
      {
        code: 'XG', name: 'Structural information;  including main structural steel, secondary/outfitting steel, structural fire protection and '
          + 'acoustic/thermal insulation and fire protection'
      },
      { code: 'XH', name: 'Free span calculation' },
      { code: 'XI', name: 'System topology and block diagrams' },
      { code: 'XJ', name: 'Single line diagrams' },
      { code: 'XK', name: 'Circuit diagrams' },
      { code: 'XL', name: 'Logic diagrams' },
      { code: 'XM', name: 'Level diagrams' },
      { code: 'XN', name: 'Isometric drawings, including fabrication, heat tracing, stress and pressure testing' },
      { code: 'XO', name: 'Piping supports' },
      { code: 'XQ', name: 'Pneumatic/hydraulic connection drawings' },
      { code: 'XR', name: 'Cause and effect' },
      { code: 'XS', name: 'Detail cross sectional drawings' },
      { code: 'XT', name: 'Wiring diagrams' },
      { code: 'XU', name: 'Loop diagram' },
      { code: 'XX', name: 'Drawings - miscellaneous' },
      { code: 'ZA', name: 'EDP documentation' }
    ];


    const data = doctype.map(item => ({
      'Value': item.code,
      'Description': item.name
    }));

    const ws = XLSX.utils.json_to_sheet(data, { header: headers });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Doc-Import-Template');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Doc-Import-Template.xlsx');
  };




  const handleSavetag = (number) => {
    console.log(number);
    console.log(tagname1);
    console.log(tagtype1);

    const data = {
      tagId: number,
      tagName: tagname1,
      type1: type1
    }
    setEditedtageditIndex(-1)
    settagname1('')
    settagType('')

    console.log(data);
    window.api.send('update-tag-table', data);
  }

  const handleCloseEdittag = () => {
    setEditedtageditIndex(-1);
  }

  const handleEditOpentag = (index) => {
    setEditedtageditIndex(index);
    settagname1(alltags[index].tagName);
    settagtype1(alltags[index].tagType)

  }

  const handleSearch = (e) => {
    setSearchtagQuery(e.target.value);
  };

  const filteredTags = alltags.filter(tag =>
    (tag.tagNumber.toLowerCase().includes(searchtagQuery.toLowerCase())) ||
    (tag.tagType.toLowerCase().includes(searchtagQuery.toLowerCase()))
  );

  const handleConfirmmaster = () => {
    console.log("Enter okay");
    console.log(masterid);
    window.api.send('insert-master-table', masterid)
    setShowmasConfirm(false)
  }

  const handleCancelmaster = () => {
    setShowmasConfirm(false)
  }
  useEffect(() => {
    console.log(tagdocsel);
  }, [tagdocsel])

  useEffect(() => {
    window.api.receive('con-doc-tag', (data) => {
      const alleles = []
      console.log(data);
      window.api.send('tag-doc-det', data[0].filename)
      data.forEach(ele => {
        alleles.push(ele.elementId)
      })
      settagdocsel(alleles)
    });
  }, [])

  useEffect(() => {
    window.api.receive('det-doc-tag', (data) => {
      console.log(data);
      data.forEach(element => {
        handledocdis(element.number, element.docId)
      });

    });
  }, [])

  useEffect(() => {
    console.log(isDiv1Visible);

  }, [isDiv1Visible])

  return (

    <div>
      <Header selectedprojectPath={selectedprojectPath}></Header>
      {/* selectedprojectPath={selectedprojectPath} */}
      <div className="cont  ">
        {/* border border-1 border-warning */}
        {isSideNavOpen ?
          <div className="left" id="sideNav"  >
            {/* border border-1 border-danger */}
            <div id='openFileButton' class="dropdown" onClick={handleLoadProject}>
              <i class="fa fa-folder-open"></i>Open Project
              <div class="dropdown-content">
              </div>
            </div>
            <div id="spidSideLnk" class="sideLnkInactive" onClick={handlespidopt} style={{ backgroundColor: isDiv1Visible ? '#5B66CB' : '' }}>

              <i class="fa-regular fa-pen-to-square sideLnkIcon"></i>
              <a class="sideLnk">Smart P&ID</a>
            </div>
            {/* <div id="tagListSideLnk" class="sideLnkInactive" onClick={handletaginfoopt} style={{ backgroundColor: istaginfoopt ? '#5B66CB' : '' }}>
              <i class="fa fa-list-alt sideLnkIcon"></i>
              <a class="sideLnk" >Tag Info</a>
            </div> */}
            <div id="taginfoSideLnk" class="sideLnkInactive" onClick={handletaginfosubopt} style={{ backgroundColor: isinfosubopt ? '#5B66CB' : '' }}>
              <i class="fa fa-tags sideLnkIcon"></i>
              <a class="sideLnk" >Tag Info</a>
            </div>
            {isinfosubopt && <div>
              <div id='tagsubopt' onClick={handleinfoptrev} style={{ backgroundColor: istaginforeview ? '#928f8ff7' : '' }}>Review</div>
              {/* <div id='tagsubopt' onClick={handleinfoptedit} style={{ backgroundColor: istaginfoedit ? '#928f8ff7' : '' }}>Tag Info Edit</div> */}
            </div>}
            <div id="lineListSideLnk" class="sideLnkInactive" onClick={handlelineopt} style={{ backgroundColor: islinelist ? '#5B66CB' : '' }}>
              <i class="fa fa-list-alt sideLnkIcon"></i>
              <a class="sideLnk" >Line List</a>
            </div>
            <div id="equipListSideLnk" class="sideLnkInactive" onClick={handleequopt} style={{ backgroundColor: isequlist ? '#5B66CB' : '' }}>
              <i class="fa fa-list-alt sideLnkIcon"></i>
              <a class="sideLnk" >Equipment List</a>
            </div>
            <div id="tagsSideLnk" class="sideLnkInactive" onClick={handletagsubopt} style={{ backgroundColor: istagsubopt ? '#5B66CB' : '' }}>
              <i class="fa fa-tags sideLnkIcon"></i>
              <a class="sideLnk" >Tags</a>
            </div>
            {istagsubopt && <div>
              <div id='tagsubopt' onClick={handletagoptrev} style={{ backgroundColor: istagreview ? '#928f8ff7' : '' }}>Review</div>
              <div id='tagsubopt' onClick={handletagoptreg} style={{ backgroundColor: istagreg ? '#928f8ff7' : '' }}>Register</div>
              <div id='tagsubopt' onClick={handlearearegister} style={{ backgroundColor: isareareg ? '#928f8ff7' : '' }}>Area Register</div>
            </div>}
            <div id="docsSideLnk" class="sideLnkInactive" onClick={handledocopt} style={{ backgroundColor: isdocsubopt ? '#5B66CB' : '' }}>
              <i class="fa fa-book sideLnkIcon"></i>
              <a class="sideLnk">Documents</a>
            </div>
            {isdocsubopt && <div>
              <div id='docsubopt' onClick={handledocoptreview} style={{ backgroundColor: isdocreview ? '#928f8ff7' : '' }}>Review</div>
              <div id='docsubopt' onClick={handledocoptreg} style={{ backgroundColor: isdocreg ? '#928f8ff7' : '' }}>Register</div>
            </div>}
            <div id="commentsSideLnk" class="sideLnkInactive" onClick={handlecomsubopt} style={{ backgroundColor: iscomsubopt ? '#5B66CB' : '' }}>
              <i class="fa fa-tags sideLnkIcon"></i>
              <a class="sideLnk" >Comments</a>
            </div>
            {iscomsubopt && <div>
              <div id='docsubopt' onClick={handlecomoptreview} style={{ backgroundColor: iscomstareview ? '#928f8ff7' : '' }}>Review</div>
              <div id='docsubopt' onClick={handlecomoptstatus} style={{ backgroundColor: iscomreview ? '#928f8ff7' : '' }}>Status</div>
              <div id='docsubopt' onClick={handlecomoptreg} style={{ backgroundColor: isdocreg ? '#928f8ff7' : '' }}>Register</div>
            </div>}
            <img src="images/tree.png" id="hsSideNav" onClick={handlesidetoggle} />
          </div> : <img src="images/tree.png" id="nonhsSideNav" onClick={handleopensidetoggle} />}

        <div className="border border-1 border-black" id='main' style={{ display: isDiv1Visible ? 'block' : 'none', width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0%' }}>

          <div class='tabDiv sideLnkDiv' style={{ backgroundColor: '#232323' }}>
            <div>
              <div class='action-bar'>
                <h1>Smart P&IDs</h1>
                {/* <i class="fa fa-plus" onClick={handleShow} ></i> */}
              </div>
            </div>
            <form >
              <Table >

                <tbody>
                  {allspids.map((project, index) => (
                    <tr key={index}>
                      <td className='ps-4' id='tagb' onClick={() => handledocdis(project.number, project.docId)} style={{ cursor: 'pointer' }}>{project.number}-{project.title}-{project.filename}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </form>
          </div>

        </div>

        {showcanvas &&
          <Canvas isSideNavOpen={isSideNavOpen} svgcontent={svgcontent} mascontent={mascontent} showcanvas={showcanvas} alltags={alltags} allspids={allspids} projectNo={projectNo} allcomments={allcomments} allareas={allareas} sindocid={sindocid} tagdocsel={tagdocsel}></Canvas>
        }
        {istaginforeview && <Taginfo isSideNavOpen={isSideNavOpen} userTagInfotable={taginfo} generalTagInfoFields={generalTagInfoFields} taginfohead={taginfohead}></Taginfo>}
        {istagreview &&
          <div className='tagtab ' style={{ width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0%' }}>
            {/* border border-1 border-info */}
            <form >
              <Table >
                <thead>
                  <tr>
                    <th id='taghead'>Tag number</th>
                    <th id='taghead'>Name</th>
                    <th id='taghead'>Type</th>
                    <th id='taghead'>Model</th>
                    <th id='taghead' >
                      <i class="fa fa-download" title="Import tags" onClick={handletagreviewimport} ></i>
                      <i className="fa-solid fa-trash-can ms-3" title='Delete all' onClick={handleDeleteAllTags}></i>
                    </th>
                  </tr>

                  <tr>
                    <th>
                      <input
                        type="text"
                        placeholder="Search by Tag Number or Type"
                        value={searchtagQuery}
                        onChange={handleSearch}
                        style={{ width: '100%', padding: '5px' }}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTags.map((project, index) => (
                    <tr key={index}>
                      {/* {editedRowIndex === index ? <input onChange={e => setFluidCode1(e.target.value)} type="text" value={fluidCode1} /> : line.fluidCode} */}
                      <td id='tagb'>{project.tagNumber}</td>
                      <td id='tagb'>{editedtageditIndex === index ? <input onChange={e => settagname1(e.target.value)} type="text" value={tagname1} /> : project.tagName}</td>
                      <td id='tagb'>{editedtageditIndex === index ? <select class="form-select w-100 " id="inputGroupSelect01" name='ttype' onChange={(e) => settagtype1(e.target.value)} value={tagtype1}>
                        <option selected>Choose...</option>
                        <option value="Line">Line</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Valve">Valve</option>
                        <option value="Structural">Structural</option>
                        <option value="Other">Other</option>
                      </select>
                        : project.tagType}</td>
                      <td id='tagb'></td>
                      <td style={{ backgroundColor: '#f0f0f0' }}>
                        {editedtageditIndex === index ?
                          <>
                            <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSavetag(project.tagId)}></i>
                            <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEdittag}></i>
                          </>
                          :
                          <>
                            <i className="fa-solid fa-pencil" onClick={() => handleEditOpentag(index)}></i>
                            <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeletetagFromTable(project.tagNumber)}></i>
                          </>
                        }
                      </td>
                    </tr>
                  ))}

                </tbody>
              </Table>
            </form>
          </div>}

        {istagreg && <div className='tagreg' style={{ width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0%' }}>
          <div class="page dark">
            <section class="page-section">

              <h1 style={{ color: '#8C97F5' }}>Tag registration</h1>

            </section>
            <form >
              <section class="page-section">
                <div class="row">
                  <label className='mb-2' for="tagRegNumber">Tag Number *</label>
                  <br />
                  <input onChange={(e) => settagNumber(e.target.value)} value={tagNumber} type="text" id="tagRegNumber" name='tagno' class="page-input w-25 " maxlength="20"
                    required />
                </div>
                <div class="row">
                  <label className='mb-2' for="tagRegName">Tag Name</label>
                  <br />
                  <input onChange={(e) => settagName(e.target.value)} value={tagName} type="text" id="tagRegName" name='tname' class="page-input w-25" maxlength="100" />
                </div>
                <div class="row">
                  <label className='mb-2' for="tagRegType">Tag Type *</label>
                  <br />
                  <select class="form-select w-25 " id="inputGroupSelect01" name='ttype' onChange={(e) => settagType(e.target.value)} value={tagType}>
                    <option selected>Choose...</option>
                    <option value="Line">Line</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Valve">Valve</option>
                    <option value="Structural">Structural</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

              </section>
              <button type='button' onClick={(e) => handleReg(e)}>Register</button>
            </form>
          </div>
        </div>}

        {isareareg && <div className='areareg' style={{ width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0%' }}>
          <div class="page dark">
            <section class="page-section">

              <h1 style={{ color: '#8C97F5' }}>Area registration</h1>

            </section>
            <form >
              <section class="page-section">
                <div class="row">
                  <label className='mb-2' for="areaRegNumber">Area Number</label>
                  <br />
                  <input onChange={(e) => setareaNumber(e.target.value)} value={areaNumber} type="text" id="areaRegNumber" name='areano' class="page-input w-25 " maxlength="20"
                    required />
                </div>
                <div class="row">
                  <label className='mb-2' for="areaRegName">Area Name</label>
                  <br />
                  <input onChange={(e) => setareaName(e.target.value)} value={areaName} type="text" id="areaRegName" name='aname' class="page-input w-25" maxlength="100" />
                </div>

              </section>
              <button type='button' onClick={(e) => handleareaReg(e)}>Register</button>
            </form>
          </div>
        </div>}


        {isdocreview &&
          <div className='doctab' style={{ width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0%' }}>
            {/* border border-1 border-info */}
            <form >
              <Table >
                <thead>
                  <tr>
                    <th id='dochead'>Document number</th>
                    <th id='dochead'>Title</th>
                    <th id='dochead'>Description</th>
                    <th id='dochead'>Type</th>
                    <th id='dochead'>File</th>
                    <th id='dochead'>
                      <i class="fa fa-download" title="Import tags" onClick={handledocreviewimport} ></i>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alldocs.map((project, index) => (
                    <tr key={index}>
                      <td id='tagb'>{project.number}</td>
                      {/* {editedRowIndex === index ? <input onChange={e => setFluidCode1(e.target.value)} type="text" value={fluidCode1} /> : line.fluidCode} */}
                      <td id='tagb'>{editeddocRowIndex === index ? <input onChange={e => settitle1(e.target.value)} type="text" value={title1} /> : project.title}</td>
                      <td id='tagb'>{editeddocRowIndex === index ? <input onChange={e => setdescr1(e.target.value)} type="text" value={descr1} /> : project.descr}</td>
                      <td id='tagb'>{editeddocRowIndex === index ? <select value={type1} onChange={e => settype1(e.target.value)} style={{ width: '100%' }}>
                        <option value='' disabled selected>Choose...</option>
                        {doctype.map((item, index) => (<option key={index} value={item.code}>{item.code}-{item.name}</option>))}
                      </select>
                        : project.type}</td>
                      <td id='tagb'>{editeddocRowIndex === index ? <>Current filename:{project.filename}
                        <input
                          type="file" ref={fileInputRef}
                          onChange={handledocadd}
                          style={{ display: 'block' }}
                        />
                      </>
                        : project.filename}</td>
                      <td style={{ backgroundColor: '#f0f0f0' }}>
                        {editeddocRowIndex === index ?
                          <>
                            <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSavedoc(project.docId)}></i>
                            <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEditdoc}></i>
                          </>
                          :
                          <>
                            <i className="fa-solid fa-pencil" onClick={() => handleEditOpendoc(index)}></i>
                            <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeletedocFromTable(project.docId)}></i>
                          </>
                        }
                      </td>
                    </tr>
                  ))}

                </tbody>
              </Table>
            </form>
          </div>}

        {isdocreg && <div className='docreg' style={{ width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0%' }}>
          <div class="page dark">
            <section class="page-section">

              <h1 style={{ color: '#8C97F5' }}>Document registration</h1>

            </section>
            <form >
              <section class="page-section">
                <div class="row">
                  <label className='mb-2' for="docRegNumber">Document number *</label>
                  <br />
                  <input onChange={(e) => setdocNumber(e.target.value)} value={docNumber} name='docno' type="text" id="docRegNumber" class="page-input w-25" maxlength="20"
                    required />
                </div>
                <div class="row">
                  <label className='mb-2' for="docRegTitle">Title</label>
                  <br />
                  <input onChange={(e) => setdocTitle(e.target.value)} value={docTitle} name='title' type="text" id="docRegTitle" class="page-input w-25" maxlength="100" />
                </div>
                <div class="row">
                  <label className='mb-2' for="docRegDescr">Description</label>
                  <br />
                  <textarea onChange={(e) => setdocDes(e.target.value)} value={docDes} id="docRegDescr" name='des' class="page-input-long w-25" ></textarea>
                </div>
                <div class="row">
                  <label className='mb-2' for="docRegFile">Document file</label>
                  <br />
                  <input type="file" id="docRegFile" class="page-input" ref={fileInputRef} onChange={handledocadd} />
                </div>
                <div class="row">
                  <label className='mb-2' for="DCRegType">Type *</label>
                  <br />

                  <select onChange={(e) => setdocType(e.target.value)} value={docType} class="form-select w-25 " id="inputGroupSelect02" name='dtype'>
                    <option value="" disabled selected>Choose...</option>
                    {doctype.map((item, index) => (
                      <option key={index} value={item.code}>{item.code}-{item.name}</option>
                    ))}
                  </select>
                </div>
              </section>
              <button type='button' onClick={(e) => handledocReg(e)}>Register</button>
            </form>
          </div>
        </div>}
        {iscomstareview && <CommentReview allcomments={allcomments} isSideNavOpen={isSideNavOpen}></CommentReview>}
        {iscomreview &&
          <div className='tagtab' style={{ width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0%' }}>
            {/* border border-1 border-info */}
            <form >
              <Table >
                <thead>
                  <tr>
                    <th id='taghead' >status</th>
                    <th id='taghead'>color</th>
                    <th id='taghead' class="tableActionCell" >
                      {/* <i class="fa fa-upload" title="Export" ></i> */}
                      <i class="fa fa-download" title="Import" style={{ cursor: 'pointer' }} onClick={handlecomImportClick}></i>
                      {/* <i class="fa-solid fa-circle-plus ps-2" title onClick={handleaddClick}></i> */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {commentdet.map((comment, index) => (
                    <tr key={index} style={{ color: 'black' }}>
                      <td id='tagb' style={{ color: 'black' }}>{editedcomrowIndex === index ? <input onChange={e => setstatusinfo1(e.target.value)} type="text" value={statusinfo1} /> : comment.statusname}</td>
                      <td id='tagb' style={{ color: 'black' }}>{editedcomrowIndex === index ? <input onChange={e => setcolorinfo1(e.target.value)} type="text" value={colorinfo1} /> : comment.color}</td>
                      <td style={{ backgroundColor: '#f0f0f0' }}>
                        {editedcomrowIndex === index ?
                          <>
                            <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSavecomment(comment.statusname)}></i>
                            <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEdit}></i>
                          </>
                          :
                          <>
                            <i className="fa-solid fa-pencil" onClick={() => handleEditOpen(index)}></i>
                            <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeletetagFromTable(comment.statusname)}></i>
                          </>
                        }
                      </td>
                    </tr>
                  ))}

                </tbody>
              </Table>
            </form>
          </div>}

        {iscomreg && <div className='tagreg' style={{ width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0%' }}>
          <div class="page dark">
            <section class="page-section">

              <h1 style={{ color: '#8C97F5' }}>Comment registration</h1>

            </section>
            <form >
              <section class="page-section">
                <div class="row">
                  <label className='mb-2' for="tagRegNumber">status</label>
                  <br />
                  <input onChange={(e) => setStatusName(e.target.value)} value={StatusName} type="text" id="stareg" name='statusname' class="page-input w-25 " maxlength="20"
                    required />
                </div>
                <div class="row">
                  <label className='mb-2' for="tagRegName">Tag Name</label>
                  <br />
                  <input onChange={(e) => setColor(e.target.value)} value={isColor} type="text" id="colreg" name='color' class="page-input w-25" maxlength="100" />
                </div>

              </section>
              <button type='button' onClick={(e) => handleCommentReg(e)}>Register</button>
            </form>
          </div>
        </div>}



        {islinelist && <Linelist isSideNavOpen={isSideNavOpen} alllines={alllines}></Linelist>}
        {isequlist && <Equlist isSideNavOpen={isSideNavOpen} allEquipementList={allEquipementList}></Equlist>}
      </div >
      <Modal
        show={loadProject}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        style={{ top: '25%', left: '10%' }}

      >
        <div className='heading' >
          <h6>Load project</h6>
          <div className="icons">
            <i className="fa-solid fa-trash" title='Delete all project' onClick={handleDeleteEntireProject}></i>
            <i class="fa-solid fa-folder  ms-3" onClick={handleMapProject} title='Map project' ></i>
            <i class="fa-solid fa-circle-plus ms-3 " onClick={handlecreatenewproject}></i>
            <i class="fa-solid fa-xmark ms-3 " onClick={handleClose}></i>
          </div>
        </div>

        {showallprojects ? (
          <div style={{ textAlign: 'center', backgroundColor: '#272626', height: '30px', color: 'grey' }}>
            <p>(Empty)</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#272626', height: 'auto', color: 'grey', overflowY: 'auto' }}>
            {allprojects.length > 0 ? (
              <table className='table table-light'>
                <tbody>
                  {allprojects.map((project, index) => (
                    <tr key={index}>
                      <td style={{ backgroundColor: '#515CBC', textAlign: 'center' }}>{project.projectNumber}</td>
                      <td style={{ display: 'flex', alignItems: 'center', backgroundColor: '#272626', color: 'white' }}>
                        {project.projectName}
                        <button onClick={() => handleOpenProject(project.projectNumber, project.projectName, project.projectPath, project.TokenNumber)} style={{ marginLeft: 'auto', background: 'none', border: 'none' }}>
                          <i className="fa-solid fa-download text-light" title='Open-project'></i>


                        </button>

                        <i className="fa-solid fa-trash text-light ms-3 me-2" title='Delete-project' onClick={() => handleDeleteProject(project.projectId)}></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', backgroundColor: '#272626', height: 'auto', color: 'grey' }}>
                <p>(Empty)</p>
              </div>
            )}
          </div>
        )}


      </Modal>

      <Modal
        show={showprojectmodal}
        onHide={handleCloseProject}
        backdrop="static"
        keyboard={false}
        style={{ top: '20%' }}

      >
        <div className="project-dialog"
          backdrop="static"
          keyboard={false}>
          <div className="title-dialog">
            <p className='text-light'>Add New Project</p>
            <p className='text-light cross' onClick={handleCloseProject}>&times;</p>
          </div>
          <div className="dialog-input">
            <label>Project No: *</label>
            <input type="text" value={projectNumber} onChange={(e) => setProjectNumber(e.target.value)} />
            {/* onChange={(e) => setProjectNumber(e.target.value)} */}
            <label>Project Name*</label>
            <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            {/* onChange={(e) => setProjectName(e.target.value)} */}
            <label>Project Description</label>
            <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}
            />
            {/* onChange={(e) => setProjectDescription(e.target.value)} */}
            <button className='btn btn-outline-secondary projectbtn' onClick={handleDirectoryChange}>Choose Folder</button>
            {
              selectedDirectory && <p>{selectedDirectory}</p>
            }
          </div>
          <div className='dialog-button'>
            <button className='btn btn-dark' onClick={handleCreateProject}>Ok</button>
          </div>
        </div>
      </Modal>

      {importTag &&
        <Modal
          onHide={handleClosetag}
          show={importTag}
          backdrop="static"
          keyboard={false}
          dialogClassName="custom-modal"
        >
          <div className="tag-dialog">
            <div className="title-dialog">
              <p className='text-light'>Import Tag</p>
              <p className='text-light cross' onClick={handleClosetag}>&times;</p>
            </div>
            <div className="dialog-input">
              <label>File</label>
              <input
                type="file" onChange={handleExcelFileChange} />
              <a onClick={handleDownloadTemplate} style={{ cursor: 'pointer', color: ' #00BFFF' }}>Download template</a>
            </div>
            <div className='dialog-button' style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', bottom: 0 }}>
              <button className='btn btn-secondary' onClick={handleClosetag}>Cancel</button>
              <button className='btn btn-dark' onClick={handleImportClick}>Upload</button>
            </div>
          </div>
        </Modal>
      }

      {docimportTag &&
        <Modal
          onHide={handleClosedoc}
          show={docimportTag}
          backdrop="static"
          keyboard={false}
          dialogClassName="custom-modal"
        >
          <div className="tag-dialog">
            <div className="title-dialog">
              <p className='text-light'>Import Tag</p>
              <p className='text-light cross' onClick={handleClosedoc}>&times;</p>
            </div>
            <div className="dialog-input">
              <label>File</label>
              <input
                type="file" />
              {/* onChange={handleExceldocChange} */}
              <a style={{ cursor: 'pointer', color: ' #00BFFF' }} onClick={handleDownloaddocTemplate}>Download template</a>
              {/* onClick={handleDownloaddocTemplate} */}
            </div>
            <div className='dialog-button' style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', bottom: 0 }}>
              <button className='btn btn-secondary' onClick={handleClosedoc}>Cancel</button>
              <button className='btn btn-dark'>Upload</button>
              {/* onClick={handledocImportClick} */}
            </div>
          </div>
        </Modal>
      }

      {customAlert && (
        <Alert
          message={modalMessage}
          onAlertClose={() => setCustomAlert(false)}
        />
      )}

      {showConfirm && (
        <DeleteConfirm
          message="Are you sure you want to delete?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {showcomConfirm && (
        <DeleteConfirm
          message="Are you sure you want to delete?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

      )}

      {showdocConfirm && (
        <DeleteConfirm
          message="Are you sure you want to delete?"
          onConfirm={handleConfirmdocdel}
          onCancel={handleCanceldocdel}
        />
      )}

      {showmasConfirm && (
        <DeleteConfirm
          message="Functons can be performed on the file if smart master is created. Allow smart master to be created"
          onConfirm={handleConfirmmaster}
          onCancel={handleCancelmaster}
        />
      )}

    </div>
  )
}

export default Home