import { Color, Path, Point, Rectangle, Size } from 'paper/dist/paper-core';
import React, { useEffect, useRef, useState } from 'react'
import paper from 'paper'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Canvas.css'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Alert from './Alert';
import Comment from './Comment';
import CommentStatus from './CommentStatus';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Canvas({ svgcontent, mascontent, showcanvas, alltags, allspids, projectNo, isSideNavOpen, allcomments,allareas, sindocid }) {
    const canvasRef = useRef(null);
    let canvas = canvasRef.current;
    const viewRef = useRef(null);
    const lastMousePosition = useRef(null);
    const isPanning = useRef(false);
    const drawingLayerRef = useRef(null);
    let svgGroup
    const temarrRef = useRef([]);
    let selectionRectangle;
    let startPoint;
    const originalPosition = new Point(761, 368);
    const svgGroupRef = useRef(null);
    const overlayGroupRef = useRef(null);
    const conndocElementsRef = useRef([]);
    const masdocElementsRef = useRef([]);
    const originalIds = useRef(new Set());
    const originalIdsMap = useRef(new Map());
    // const svgGroupRef = useRef(null);
    // const newLabelObjects = useRef({});
    const labelObjects = useRef({});
    const currentRectangleRef = useRef(null);
    const [isbottomextend, setbottomextend] = useState(false)
    const [enableselect, setenableselect] = useState(false)
    const [isassignid, setassignid] = useState([])
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
    // const [editoption, seteditoption] = useState(false)
    const [tagid, setSelectedValue] = useState('');
    const [tagassishow, settagassishow] = useState(false);
    const [panonoff, setpanonoff] = useState(false)
    const [enablesinselect, setenablesinselect] = useState(false)
    const [enableflagtagselect, setenableflagtagselect] = useState(false)
    const [enablewinselect, setenablewinselect] = useState(false)
    const [rectangles, setRectangles] = useState({});
    const [areaassishow, setareaassishow] = useState(false)
    const [tagsselect, settagsselect] = useState([])
    const [tagsinfo, settagsinfo] = useState({})
    const [equlist, setequlist] = useState({})
    const [linelist, setlinelist] = useState({})
    const [taginfoshow, settaginfoshow] = useState(false);
    const [taginfomenu, settaginfomenu] = useState({ visible: false, x: 0, y: 0 });
    const [flagconmenu, setflagconmenu] = useState({ visible: false, x: 0, y: 0 });
    const [docdetails, setdocdetails] = useState([])
    const [flagassishow, setflagassishow] = useState(false)
    const [flagcdocnum, setflagcdocnum] = useState('')
    const [docdetnum, setdocdetnum] = useState('')
    const [issindoc, setsindoc] = useState('')
    const [condoc, setcondoc] = useState('')
    const [condocpath, setcondocpath] = useState('')
    const [conndoc, setconndoc] = useState('')
    const [sinflag, setsinflag] = useState('')
    const [flagtag, setflagtag] = useState('')
    const [tagflag, settagflag] = useState('')
    const [sindoubleflag, setsindoubleflag] = useState('')
    const [docflag, setdocflag] = useState('')
    const [condocallsel, setcondocallsel] = useState([])
    const [condelflag, setcondelflag] = useState('')
    const [conflagdel, setconflagdel] = useState('')
    const [customAlert, setCustomAlert] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [flagtry, setflagtry] = useState([])
    const [nextcondoc, setnextcondoc] = useState('')
    const [isaddcomment, setaddcomment] = useState(false)
    const [isx, setx] = useState('')
    const [isy, sety] = useState('')
    const [isrx, setrx] = useState('')
    const [isry, setry] = useState('')
    const [commcontent, setcommcontent] = useState({})
    const [showComment, setshowComment] = useState(false)
    const [commentinfo, setcommentinfo] = useState(null);
    const [commentinfotable, setcommentinfotable] = useState(false);
    const [editcomment, seteditcomment] = useState(false)
    const [commentdet, setcommentdet] = useState([])
    const [exportmenu, setexportmenu] = useState(false);
    const [selectedTexts, setSelectedTexts] = useState([]);
    const [pathIDs, setPathIDs] = useState([]);
    const [isEditing, setisEditing] = useState(false)
    const [statusedit, setstatusedit] = useState('')
    const [commentedit, setcommentedit] = useState('')
    const [priorityedit, setpriorityedit] = useState('')
    const [flagsconn, setflagsconn] = useState(false)
    const [masdoc, setmasdoc] = useState('')
    const [highlightConndoc, setHighlightConndoc] = useState(false);
    const [highlightMasdoc, setHighlightMasdoc] = useState(false);
    const [functionactive, setfunctionactive] = useState(false)
    const [mastertab, setmastertab] = useState(false)
    const [mastercopyactive, setmastercopyactive] = useState(false)
    const [enablescselect, setenablescselect] = useState(false)
    const [areashows, setareashows] = useState(false);
    const [selectvalue, setselectvalue] = useState('')
    const [areainfo, setareainfo] = useState([])
    const [enableareadraw, setenableareadraw] = useState(false)
    const [savrectangles, setsavRectangles] = useState({});

    useEffect(() => {
        console.log(flagsconn);
    }, [flagsconn])

    useEffect(() => {
        console.log(condocallsel);
    }, [condocallsel])

    useEffect(() => {
        console.log(isx);
        // setcommcontent({ isx, isy })
    }, [isx])
    useEffect(() => {
        console.log(allareas);
    }, [allareas])

    useEffect(() => {
        console.log(isy);
        if (isx != '' && isy != '') {
            // const cdata = { isx: isx, isy: isy }
            // setcommcontent(cdata)
            console.log('Updating commcontent with:', { isx, isy });
            setcommcontent({ isx, isy });
        }
    }, [isx, isy])

    useEffect(() => {
        console.log(commcontent);
    }, [commcontent])

    useEffect(() => {
        console.log(isrx);
    }, [isrx])

    useEffect(() => {
        console.log(isry);
    }, [isry])


    const importSVGWithOriginalIds = (svgString, isMasdoc) => {
        paper.project.importSVG(svgString, (importedSVG) => {
            importedSVG.getItems({ class: paper.Path }).forEach((item) => {
                const originalId = originalIdsMap.current.get(item.pathData);
                if (originalId && isMasdoc) {
                    item._id = originalId;
                } else if (!isMasdoc) {
                    originalIdsMap.current.set(item.pathData, item._id);
                }
            });

            importedSVG.getItems({ class: paper.PointText }).forEach((item) => {
                const originalId = originalIdsMap.current.get(item.content);
                if (originalId && isMasdoc) {
                    item._id = originalId;
                } else if (!isMasdoc) {
                    originalIdsMap.current.set(item.content, item._id);
                }
            });

            if (isMasdoc) {
                masdocElementsRef.current = importedSVG.getItems({ class: paper.Item });
                importedSVG.opacity = 0.5; // Set transparency for the overlay
                overlayGroupRef.current.addChild(importedSVG);
            } else {
                conndocElementsRef.current = importedSVG.getItems({ class: paper.Item });
                svgGroupRef.current.addChild(importedSVG);
            }

            importedSVG.fitBounds(new paper.Rectangle(new Point(0, 0), new Size(paper.view.size.width, paper.view.size.height)));
            paper.view.draw();
        });
    };



    const drawStoredRectangle = () => {
        if (Array.isArray(rectangles) && rectangles.length > 0 && drawingLayerRef.current) {
            drawingLayerRef.current.removeChildren(); // Clear existing rectangles

            rectangles.forEach(rect => {
                const rectangle = new paper.Path.Rectangle({
                    point: [rect.x, rect.y], // Top-left corner
                    size: [rect.width, rect.height], // Dimensions (width and height)
                    strokeColor: 'red', // Color of the rectangle's border
                    fillColor: new paper.Color(1, 0, 0, 0.5), // Fill color of the rectangle with some transparency
                    strokeWidth: 2 / paper.view.zoom // Adjust the stroke width based on the current zoom level
                });

                drawingLayerRef.current.addChild(rectangle); // Add the created rectangle to the drawing layer
            });
        }
    };

    const drawsavedarea = () => {
        if (Array.isArray(savrectangles) && savrectangles.length > 0 && drawingLayerRef.current) {
            drawingLayerRef.current.removeChildren(); // Clear existing rectangles

            savrectangles.forEach(rect => {
                const rectangle = new paper.Path.Rectangle({
                    point: [rect.x, rect.y], // Top-left corner
                    size: [rect.width, rect.height], // Dimensions (width and height)
                    strokeColor: 'red', // Color of the rectangle's border
                    fillColor: new paper.Color(1, 0, 0, 0.5), // Fill color of the rectangle with some transparency
                    strokeWidth: 2 / paper.view.zoom // Adjust the stroke width based on the current zoom level
                });

                drawingLayerRef.current.addChild(rectangle); // Add the created rectangle to the drawing layer
            });
        }
    };

    useEffect(() => {
        if (masdoc && drawingLayerRef.current) {
            paper.view.zoom = 1;
            paper.view.center = paper.view.size.divide(2);
            drawStoredRectangle();
            drawsavedarea();
        }
    }, [masdoc]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        paper.setup(canvas);

        if (conndoc) {
            paper.project.clear();
            viewRef.current = paper.view;

            svgGroupRef.current = new paper.Group();
            if (highlightConndoc) {
                const highlightRect = new paper.Path.Rectangle({
                    point: [0, 0],
                    size: paper.view.size,
                    fillColor: new paper.Color(1, 1, 0, 0.5) // Yellow with 50% opacity
                });
                svgGroupRef.current.addChild(highlightRect);
            }

            paper.project.importSVG(conndoc, (importedSVG) => {
                importedSVG.getItems({ class: paper.Path }).forEach((item, index) => {
                    item._id = `path-${index}`;
                    item.data.fromconndoc = true;
                });

                importedSVG.getItems({ class: paper.PointText }).forEach((item, index) => {
                    item._id = `text-${index}`;
                    item.data.fromconndoc = true;
                });

                importedSVG.fitBounds(new paper.Rectangle(new Point(0, 0), new Size(paper.view.size.width, paper.view.size.height)));
                svgGroupRef.current.addChild(importedSVG);
                // svgGroupRef.current.position = paper.view.center;
                svgGroupRef.current.fitBounds(paper.view.bounds);
                paper.view.draw();

                conndocElementsRef.current = importedSVG.getItems({ class: paper.Item });
                // handleResize();
            });
        }

    }, [conndoc, highlightConndoc]);

    useEffect(() => {
        if (!viewRef.current || !masdoc) return;

        if (overlayGroupRef.current) {
            overlayGroupRef.current.remove();
        }

        overlayGroupRef.current = new paper.Group();
        if (highlightMasdoc) {
            const highlightRect = new paper.Path.Rectangle({
                point: [0, 0],
                size: paper.view.size,
                fillColor: new paper.Color(1, 1, 0, 0.5) // Yellow with 50% opacity
            });
            overlayGroupRef.current.addChild(highlightRect);
        }

        paper.project.importSVG(masdoc, (importedSVG) => {
            importedSVG.getItems({ class: paper.Path }).forEach((item, index) => {
                if (!originalIdsMap.current.has(item.pathData)) {
                    item._id = `overlay-path-${index}`;
                    originalIdsMap.current.set(item.pathData, item._id);
                } else {
                    item._id = originalIdsMap.current.get(item.pathData);
                }
                item.data.fromMasdoc = true;
            });

            importedSVG.getItems({ class: paper.PointText }).forEach((item, index) => {
                if (!originalIdsMap.current.has(item.content)) {
                    item._id = `overlay-text-${index}`;
                    originalIdsMap.current.set(item.content, item._id);
                } else {
                    item._id = originalIdsMap.current.get(item.content);
                }
                item.data.fromMasdoc = true;
            });

            importedSVG.opacity = 0.5; // Set transparency for the overlay

            importedSVG.fitBounds(new paper.Rectangle(new Point(0, 0), new Size(paper.view.size.width, paper.view.size.height)));
            overlayGroupRef.current.addChild(importedSVG);
            // overlayGroupRef.current.position = paper.view.center;
            overlayGroupRef.current.fitBounds(paper.view.bounds);
            paper.view.draw();

            masdocElementsRef.current = importedSVG.getItems({ class: paper.Item });
            // handleResize();
            startDrawingRectangles();

        });

    }, [masdoc, highlightMasdoc]);



    useEffect(() => {
        console.log(conndoc);
    }, [conndoc])

    useEffect(() => {
        console.log(masdoc);
        if (masdoc != '') {
            setfunctionactive(true)
            setmastertab(true)
        }
    }, [masdoc])
    const onDoubleClick = (event) => {
        // Ensure the event is a left double-click
        if (event.button === 0) {
            paper.project.getItems({ selected: true }).forEach(item => {
                console.log("enter unselect");
                item.selected = false;
            })
            console.log("enter handle")
            const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
            console.log("point:", point);
            const paperPoint = paper.view.viewToProject(point);
            console.log("paperpoint:", paperPoint)
            const hitResult = paper.project.hitTest(paperPoint, {
                // fill: true,
                stroke: true,
                segments: true,
                tolerance: 5,
            });
            console.log("hitresult::", hitResult)
            console.log(hitResult);

            if (hitResult && hitResult.item && hitResult.item.data.fromMasdoc) {
                console.log(hitResult.item._id);
                window.api.send('double-sin-flag', hitResult.item._id);
                window.api.send('ele-tag-type', hitResult.item._id)
            }
            else {
                console.log('else condition');
            }
        }
    }

    useEffect(() => {
        setconndoc(svgcontent)
    }, [svgcontent])

    useEffect(() => {
        window.api.receive('sin-ele-fetched', (data) => {
            console.log("Received data from main process:", data);
            window.api.send('fetch-tag-ele', data.tagNumber);
            window.api.send('fetch-info-tag', data.tagNumber);

        });
    }, []);
    useEffect(() => {
        window.api.receive('tag-ele-fetched', (data) => {
            console.log("Received data from main process:", data);
            settagsselect(data)
        });
    }, []);
    useEffect(() => {
        window.api.receive('info-tag-fetched', (data) => {
            console.log("Received data from main process:", data);
            settagsinfo(data)

        });
    }, []);
    useEffect(() => {
        window.api.receive('sin-docdetails-fetched', (data) => {
            console.log("Received data from main process:", data);
            setdocdetails(data)
            setdocdetnum(data[0].number)
        });
    }, []);

    useEffect(() => {
        window.api.receive('all-layers-fetched', (data) => {
            console.log("Received data from main process:", data);
        });
    }, []);

    useEffect(() => {
        window.api.receive('all-flags-fetched', (data) => {
            console.log("Received data from main process:", data);
        });
    }, []);

    useEffect(() => {
        window.api.receive('con-doc-fetched', (data) => {
            console.log("Received data from main process:", data);
            setcondoc(data.connectDoc)
        });
    }, []);

    useEffect(() => {
        window.api.receive('condoc-path-fetched', (data) => {
            console.log("Received data from main process:", data);
            setcondocpath(data)
        });
    }, []);

    useEffect(() => {
        window.api.send('fetch-condoc-path', condoc)
    }, [condoc])

    useEffect(() => {
        console.log(setnextcondoc);
    }, [nextcondoc])

    useEffect(() => {
        console.log(condocpath);
        if (condocpath === '') {
            setflagsconn(false)
        }
        setconndoc(condocpath)
        setdocdetnum(nextcondoc)
    }, [condocpath])

    useEffect(() => {
        window.api.receive('sin-flag-fetched', (data) => {
            console.log("Received data from main process:", data);
            setsinflag(data[0].flagId)
            setflagtag(data[0].flagId)
        });
    }, []);

    useEffect(() => {
        window.api.receive('sin-flag-double', (data) => {
            console.log("Received data from main process:", data);
            setsindoubleflag(data[0].connectDoc)
            setnextcondoc(data[0].connectDoc)
        });
    }, []);

    useEffect(() => {
        console.log(sindoubleflag);
        window.api.send('fetch-condoc-path', sindoubleflag)
    }, [sindoubleflag])

    useEffect(() => {
        //selection of flag element on click
        window.api.receive('sel-flag-ele', (data) => {
            console.log("Received data from main process:", data);
            const cdf = data.map(element => element.elementId);
            for (let i = 0; i < cdf.length; i++) {
                paper.project.getItems({ class: paper.Path, }).forEach(item => {
                    if (cdf[i] == item._id) {
                        item.selected = true
                    }
                });
            }
        });
    }, []);

    useEffect(() => {
        window.api.receive('flag-conflag-sin', (data) => {
            console.log("Received data from main process:", data);
            // if(canvas){
            console.log(data[0].parentDoc);
            const cdf = data.map(element => element.elementId);
            setcondocallsel(cdf)
            for (let i = 0; i < cdf.length; i++) {
                paper.project.getItems({ class: paper.Path, }).forEach(item => {
                    if (cdf[i] == item._id) {
                        item.selected = true
                    }
                });
            }
            window.api.send('fetch-condoc-path', data[0].parentDoc)
            // } 
        })
    }, [])

    useEffect(() => {
        window.api.receive('doc-flag-fetched', (data) => {
            console.log("Received data from main process:", data);
            setdocflag(data.flagId);
        });
    }, []);

    useEffect(() => {
        window.api.receive('ele-flag-unflag', (data) => {
            console.log("Received data from main process:", data);
            setcondelflag(data[0].flagId)
            setconflagdel(data[0].connectFlag)
        });
    }, []);

    useEffect(() => {
        if (condelflag != '' && conflagdel != '') {
            console.log(condelflag);
            console.log(conflagdel);
            window.api.send('update-unflag-table', condelflag);
            window.api.send('update-unflag-table', conflagdel);
        }

    }, [condelflag, conflagdel])

    useEffect(() => {
        window.api.receive('flag-tag-fetched', (data) => {
            console.log("Received data from main process:", data);
            settagflag(data[0].tagNumber)
        });
    }, []);

    useEffect(() => {
        console.log(flagtag);
    }, [flagtag])

    useEffect(() => {
        console.log(rectangles);
    }, [rectangles])

    useEffect(() => {
        console.log(savrectangles);
    }, [savrectangles])

    useEffect(() => {
        if (tagflag != '' && flagtag != '') {
            const data = {
                adjTag: tagflag,
                flagId: flagtag
            }
            window.api.send('update-flag-tag', data);
            setCustomAlert(true);
            setModalMessage('Adjcent tag added');
            // alert("Adjcent tag added")
        }

    }, [tagflag])

    useEffect(() => {
        window.api.receive('flag-tag-updated', (data) => {
            console.log("Received data from main process:", data);

        });
    }, []);

    useEffect(() => {
        window.api.receive('element-tag-is', (data) => {
            console.log("Received data from main process:", data);
            console.log(data.tagNumber);
            window.api.send('sel-tag-ele', data.tagNumber);
        });
    }, []);


    useEffect(() => {
        window.api.receive('type-tag-ele', (data) => {
            console.log("Received data from main process:", data);

        });
    }, []);

    // useEffect(() => {
    //     window.api.receive('all-flags-fetched', (data) => {
    //         console.log("Received data from main process:", data);
    //     });
    // }, []);

    useEffect(() => {
        window.api.receive('line-type-details', (data) => {
            console.log("Received data from main process:", data);
            setlinelist(data)
            settaginfoshow(true)
        });
    }, []);

    useEffect(() => {
        window.api.receive('equ-type-details', (data) => {
            console.log("Received data from main process:", data);
            setequlist(data)
            settaginfoshow(true)
        });
    }, []);

    useEffect(() => {
        window.api.receive('ele-flag-out', (data) => {
            console.log("Received data from main process:", data);
            setflagtry(data)
        });
    }, []);

    useEffect(() => {
        console.log(flagtry);
        if (flagtry.length > 0) {
            const flagds = flagtry[0].flagId
            handleflagsconnectclick(flagds)
            window.api.send('flag-dou-sel', flagds);
        }
    }, [flagtry])

    useEffect(() => {
        window.api.receive('all-comments-fetched', (data) => {
            console.log("Received data from main process:", data);
            setcommentdet(data)
        });
    }, []);

    useEffect(() => {
        window.api.receive('doc-area-fetched', (data) => {
            console.log("Received data from main process:", data);
            setareainfo(data)
        });
    }, [])

    useEffect(() => {
        loadAndDrawRectangle(areainfo)
    }, [areainfo])

    useEffect(() => {
        console.log(commentdet);
    }, [commentdet])

    // useEffect(() => {
    //     window.api.receive('ele-tag-sel', (data) => {
    //         console.log("Received data from main process:", data);
    //         const cdf = data.map(element => element.elementId);
    //         console.log(cdf);
    //         if (cdf.length > 0) {
    //             console.log(('Enter if'));
    //             for (let i = 0; i < cdf.length; i++) {
    //                 paper.project.getItems({ class: paper.Path, }).forEach(item => {
    //                     if (cdf[i] == item._id) {
    //                         item.selected = true
    //                     }
    //                 });
    //             }
    //         }
    //     });
    // }, []);

    useEffect(() => {
        window.api.receive('ele-tag-sel', (data) => {
            console.log("Received data from main process:", data);
            const cdf = data.map(element => element.elementId);
            console.log(cdf);

            if (cdf.length > 0) {
                console.log('Enter if');

                // Iterate over each element ID received
                for (let i = 0; i < cdf.length; i++) {
                    const elementId = cdf[i];

                    // Get items from masdoc and select the matching ones
                    const items = paper.project.getItems({
                        match: (item) => item._id === elementId && item.data.fromMasdoc
                    });

                    items.forEach(item => {
                        item.selected = true;
                    });
                }
            }
        });
    }, []);

    useEffect(() => {
        if (enablescselect && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            // setContextMenu({})
            // setinfocontextmenu({})
            enablescselinteraction()
        }

        return () => {
            if (canvas) {
                disablescselinteraction()

            }
        }
    }, [enablescselect, canvas])


    useEffect(() => {
        if (enableselect && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            // setContextMenu({})
            // setinfocontextmenu({})
            enableselinteraction()
        }

        return () => {
            if (canvas) {
                disableselinteraction()

            }
        }
    }, [enableselect, canvas])

    useEffect(() => {
        if (enableflagtagselect && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            // setContextMenu({})
            // setinfocontextmenu({})
            enableflagtaginteraction()
        }

        return () => {
            if (canvas) {
                disableflagtaginteraction()

            }
        }
    }, [enableflagtagselect, canvas])



    useEffect(() => {
        console.log(tagsselect);
        if (tagsselect.length > 0) {
            handletaginfodis()
        }
    }, [tagsselect])

    useEffect(() => {
        console.log(isassignid);
    }, [isassignid])


    useEffect(() => {
        console.log(issindoc);
    }, [issindoc])

    useEffect(() => {
        console.log(docdetnum);
    }, [docdetnum])


    useEffect(() => {
        if (panonoff && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            // setContextMenu({})
            // setinfocontextmenu({})
            enablePanning()
        }

        return () => {
            if (canvas) {
                disablePanning()
            }
        }
    }, [panonoff, canvas])

    useEffect(() => {
        if (enablesinselect && canvas) {
            dlayerremove()
            console.log("entered useeffect");
            enablesinselinteraction()
        }
        return () => {
            if (canvas) {
                disablesinselinteraction()
            }
        }
    }, [enablesinselect, canvas])
    useEffect(() => {
        if (enablewinselect && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            // setContextMenu({})
            // setinfocontextmenu({})
            enablewinselinteraction()
        }

        return () => {
            if (canvas) {
                disablewinselinteraction()
            }
        }
    }, [enablewinselect, canvas])

    useEffect(() => {
        if (enableareadraw && canvas) {
            dlayerremove()
            console.log("enter useEffect");
            enableareadrawinteraction()
        }

        return () => {
            if (canvas) {
                disableareadrawinteraction()
            }
        }
    }, [enableareadraw, canvas])

    useEffect(() => {
        console.log(linelist);
    }, [linelist])

    useEffect(() => {
        console.log(equlist);
    }, [equlist])

    useEffect(() => {
        createLabels();
    }, [showComment, allcomments]);

    const dlayerremove = () => {
        if (drawingLayerRef.current !== null) {
            drawingLayerRef.current.remove()
        }
    }

    const enableselinteraction = () => {
        canvas.addEventListener('click', onMouseClick);
    }

    const enablescselinteraction = () => {
        canvas.addEventListener('click', onscMouseClick);
    }

    const enableflagtaginteraction = () => {
        canvas.addEventListener('click', onFlagtagClick)
        // canvas.removeEventListener('contextmenu', onflagconMenu)
        canvas.removeEventListener('contextmenu', ontaginfoMenu)
        settaginfomenu({ visible: false, x: 0, y: 0 })
    }

    const disableflagtaginteraction = () => {
        canvas.removeEventListener('click', onFlagtagClick)
        setflagconmenu({ visible: false, x: 0, y: 0 })
    }
    const disablescselinteraction = () => {
        canvas.removeEventListener('click', onscMouseClick);
    }

    const disableselinteraction = () => {
        canvas.removeEventListener('click', onMouseClick);
        setflagconmenu({ visible: false, x: 0, y: 0 })
        settaginfomenu({ visible: false, x: 0, y: 0 })
        // canvas.removeEventListener('contextmenu', onContextMenu);
        canvas.removeEventListener('contextmenu', onflagconMenu);
        canvas.removeEventListener('contextmenu', ontaginfoMenu)
    }

    const enablesinselinteraction = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        console.log("entered interaction");
        canvas.removeEventListener('contextmenu', onflagconMenu);
        canvas.addEventListener('click', onsingleClick);
    }
    const disablesinselinteraction = () => {
        settaginfomenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('click', onsingleClick);
        canvas.removeEventListener('contextmenu', ontaginfoMenu)
    }

    const onMouseClick = (event) => {
        console.log(event);
        console.log(temarrRef.current);
        setflagconmenu({ visible: false, x: 0, y: 0 })
        const isCtrlPressed = event.ctrlKey || event.metaKey; // metaKey for macOS
        if (!isCtrlPressed) {
            paper.project.getItems({ selected: true }).forEach(item => {
                console.log("enter unselect");
                item.selected = false;
            });
            console.log("enter handle")
            const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
            console.log("point:", point);
            const paperPoint = paper.view.viewToProject(point);
            console.log("paperpoint:", paperPoint)
            let hitResult = paper.project.hitTest(paperPoint, {
                stroke: true,
                segments: true,
                tolerance: 5,
            });

            // Check for text items separately
            if (!hitResult) {
                hitResult = paper.project.hitTest(paperPoint, {
                    fill: true,
                    tolerance: 5,
                    class: paper.PointText
                });
            }

            console.log("hitresult::", hitResult)
            console.log(hitResult);

            if (hitResult && hitResult.item && hitResult.item.data.fromMasdoc) {
                if (hitResult.item.selected === false) {
                    console.log(hitResult.item._id);

                    window.api.send('is-element-tag', hitResult.item._id);
                    window.api.send('ele-flag-sel', hitResult.item._id);
                    hitResult.item.selected = true;
                    canvas.addEventListener('contextmenu', onflagconMenu);
                    canvas.addEventListener('dblclick', onDoubleClick);
                    var resid = hitResult.item._id;
                    console.log(resid);
                    temarrRef.current.push(resid);
                    console.log(temarrRef.current);
                    setsindoc(resid);
                    setx(event.x);
                    sety(event.y);

                    window.api.send('fetch-sin-flag', resid);
                }
            } else {
                setflagconmenu({ visible: false, x: 0, y: 0 });
                canvas.removeEventListener('contextmenu', onflagconMenu);
                paper.project.getItems({ selected: true }).forEach(item => {
                    console.log("enter unselect");
                    item.selected = false;
                });
                temarrRef.current = [];
                console.log(temarrRef.current);
                setassignid(temarrRef.current);
            }
        } else {
            console.log("enter handle")
            const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
            console.log("point:", point);
            const paperPoint = paper.view.viewToProject(point);
            console.log("paperpoint:", paperPoint)
            let hitResult = paper.project.hitTest(paperPoint, {
                stroke: true,
                segments: true,
                tolerance: 5,
            });

            // Check for text items separately
            if (!hitResult) {
                hitResult = paper.project.hitTest(paperPoint, {
                    fill: true,
                    tolerance: 5,
                    class: paper.PointText
                });
            }

            console.log("hitresult::", hitResult)
            console.log(hitResult);

            if (hitResult && hitResult.item && hitResult.item.data.fromMasdoc) {
                if (hitResult.item.selected === false) {
                    hitResult.item.selected = true;
                    console.log(hitResult.item._id);
                    canvas.addEventListener('contextmenu', onflagconMenu);
                    var resid = hitResult.item._id;
                    console.log(resid);
                    temarrRef.current.push(resid);
                    console.log(temarrRef.current);
                }
            } else {
                setflagconmenu({ visible: false, x: 0, y: 0 });
                canvas.removeEventListener('contextmenu', onflagconMenu);
            }
        }
    };

    const onscMouseClick = (event) => {
        console.log(event);
        console.log(temarrRef.current);
        // setflagconmenu({ visible: false, x: 0, y: 0 })
        const isCtrlPressed = event.ctrlKey || event.metaKey; // metaKey for macOS
        if (!isCtrlPressed) {
            paper.project.getItems({ selected: true }).forEach(item => {
                console.log("enter unselect");
                item.selected = false;
            });
            console.log("enter handle")
            const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
            console.log("point:", point);
            const paperPoint = paper.view.viewToProject(point);
            console.log("paperpoint:", paperPoint)
            let hitResult = paper.project.hitTest(paperPoint, {
                stroke: true,
                segments: true,
                tolerance: 5,
            });

            // Check for text items separately
            if (!hitResult) {
                hitResult = paper.project.hitTest(paperPoint, {
                    fill: true,
                    tolerance: 5,
                    class: paper.PointText
                });
            }

            console.log("hitresult::", hitResult)
            console.log(hitResult);

            if (hitResult && hitResult.item && hitResult.item.data.fromconndoc) {
                if (hitResult.item.selected === false) {
                    console.log(hitResult.item._id);
                    if (hitResult.item instanceof paper.Path) {
                        console.log("Path Data:", hitResult.item.pathData);
                        // item.pathData contains the SVG path data as an array of commands
                    } else if (hitResult.item instanceof paper.PointText) {
                        console.log("Text Content:", hitResult.item.content);
                    }
                    // window.api.send('is-element-tag', hitResult.item._id);
                    // window.api.send('ele-flag-sel', hitResult.item._id);
                    hitResult.item.selected = true;
                    // canvas.addEventListener('contextmenu', onflagconMenu);
                    // canvas.addEventListener('dblclick', onDoubleClick);
                    var resid = hitResult.item._id;
                    console.log(resid);
                    temarrRef.current.push(resid);
                    console.log(temarrRef.current);
                    // setsindoc(resid);
                    // setx(event.x);
                    // sety(event.y);

                    // window.api.send('fetch-sin-flag', resid);
                }
            } else {
                // setflagconmenu({ visible: false, x: 0, y: 0 });
                // canvas.removeEventListener('contextmenu', onflagconMenu);
                paper.project.getItems({ selected: true }).forEach(item => {
                    console.log("enter unselect");
                    item.selected = false;
                });
                temarrRef.current = [];
                console.log(temarrRef.current);
                // setassignid(temarrRef.current);
            }
        } else {
            console.log("enter handle")
            const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
            console.log("point:", point);
            const paperPoint = paper.view.viewToProject(point);
            console.log("paperpoint:", paperPoint)
            let hitResult = paper.project.hitTest(paperPoint, {
                stroke: true,
                segments: true,
                tolerance: 5,
            });

            // Check for text items separately
            if (!hitResult) {
                hitResult = paper.project.hitTest(paperPoint, {
                    fill: true,
                    tolerance: 5,
                    class: paper.PointText
                });
            }

            console.log("hitresult::", hitResult)
            console.log(hitResult);

            if (hitResult && hitResult.item && hitResult.item.data.fromconndoc) {
                if (hitResult.item.selected === false) {
                    hitResult.item.selected = true;
                    console.log(hitResult.item._id);
                    // canvas.addEventListener('contextmenu', onflagconMenu);
                    var resid = hitResult.item._id;
                    console.log(resid);
                    temarrRef.current.push(resid);
                    console.log(temarrRef.current);
                }
            } else {
                // setflagconmenu({ visible: false, x: 0, y: 0 });
                // canvas.removeEventListener('contextmenu', onflagconMenu);
            }
        }
    }



    // const onMouseClick = (event) => {
    //     console.log(event);
    //     console.log(temarrRef.current);
    //     setflagconmenu({ visible: false, x: 0, y: 0 })
    //     const isCtrlPressed = event.ctrlKey || event.metaKey;// metaKey for macOS
    //     if (!isCtrlPressed) {
    //         paper.project.getItems({ selected: true }).forEach(item => {
    //             console.log("enter unselect");
    //             item.selected = false;
    //         });
    //         console.log("enter handle")
    //         const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
    //         console.log("point:", point);
    //         const paperPoint = paper.view.viewToProject(point);
    //         console.log("paperpoint:", paperPoint)
    //         const hitResult = paper.project.hitTest(paperPoint, {
    //             // fill: true,
    //             stroke: true,
    //             segments: true,
    //             tolerance: 5,
    //             // class: paper.PointText // Include PointText in hit test
    //         });
    //         console.log("hitresult::", hitResult)
    //         console.log(hitResult);
    //         console.log(hitResult.item);
    //         if (hitResult && hitResult.item) {
    //             if (hitResult.item.selected == false) {
    //                 console.log(hitResult.item._id);

    //                 window.api.send('is-element-tag', hitResult.item._id);
    //                 window.api.send('ele-flag-sel', hitResult.item._id);
    //                 // handletagflagselection()
    //                 hitResult.item.selected = true
    //                 // // canvas.addEventListener('contextmenu', onContextMenu);
    //                 canvas.addEventListener('contextmenu', onflagconMenu);
    //                 canvas.addEventListener('dblclick', onDoubleClick);
    //                 var resid = hitResult.item._id
    //                 console.log(resid);
    //                 temarrRef.current.push(resid);
    //                 console.log(temarrRef.current);
    //                 setsindoc(resid)
    //                 setx(event.x);
    //                 sety(event.y);

    //                 window.api.send('fetch-sin-flag', resid);
    //             }
    //         }
    //         else {
    //             setflagconmenu({ visible: false, x: 0, y: 0 })
    //             // canvas.removeEventListener('contextmenu', onContextMenu);
    //             canvas.removeEventListener('contextmenu', onflagconMenu);
    //             // canvas.removeEventListener('dblclick', onDoubleClick);
    //             paper.project.getItems({ selected: true }).forEach(item => {
    //                 console.log("enter unselect");
    //                 item.selected = false;
    //             });
    //             temarrRef.current = []
    //             console.log(temarrRef.current);
    //             setassignid(temarrRef.current)
    //         }

    //     }
    //     else {
    //         console.log("enter handle")
    //         const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
    //         console.log("point:", point);
    //         const paperPoint = paper.view.viewToProject(point);
    //         console.log("paperpoint:", paperPoint)
    //         const hitResult = paper.project.hitTest(paperPoint, {
    //             // fill: true,
    //             stroke: true,
    //             segments: true,
    //             tolerance: 5,
    //         });
    //         console.log("hitresult::", hitResult)
    //         console.log(hitResult);
    //         if (hitResult && hitResult.item) {
    //             if (hitResult.item.selected == false) {
    //                 hitResult.item.selected = true
    //                 console.log(hitResult.item._id);
    //                 // canvas.addEventListener('contextmenu', onContextMenu);
    //                 canvas.addEventListener('contextmenu', onflagconMenu);
    //                 var resid = hitResult.item._id
    //                 console.log(resid);
    //                 temarrRef.current.push(resid);
    //                 console.log(temarrRef.current);
    //             }
    //         }
    //         else {
    //             // setContextMenu({ visible: false, x: 0, y: 0 })
    //             // canvas.removeEventListener('contextmenu', onContextMenu);
    //             setflagconmenu({ visible: false, x: 0, y: 0 })
    //             canvas.removeEventListener('contextmenu', onflagconMenu);
    //         }
    //     }
    // }

    const onContextMenu = (event) => {
        // event.preventDefault(); // Prevent the default context menu

        // setContextMenu({
        //     visible: true,
        //     x: event.pageX,
        //     y: event.pageY,
        // });
    }

    const ontaginfoMenu = (event) => {
        event.preventDefault()
        settaginfomenu({
            visible: true,
            x: event.pageX,
            y: event.pageY
        })
    }

    const onflagconMenu = (event) => {
        console.log(event);
        setrx(event.x)
        setry(event.y)
        event.preventDefault()
        setflagconmenu({
            visible: true,
            x: event.pageX,
            y: event.pageY
        })
    }

    useEffect(() => {
        console.log(flagconmenu);
    }, [flagconmenu])

    useEffect(() => {
        setmasdoc(mascontent)
    }, [mascontent])
    const onsingleClick = async (event) => {
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        })
        console.log("enter handle")
        const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
        console.log("point:", point);
        const paperPoint = paper.view.viewToProject(point);
        console.log("paperpoint:", paperPoint)
        const hitResult = paper.project.hitTest(paperPoint, {
            // fill: true,
            stroke: true,
            segments: true,
            tolerance: 5,
        });

        // Check for text items separately
        if (!hitResult) {
            hitResult = paper.project.hitTest(paperPoint, {
                fill: true,
                tolerance: 5,
                class: paper.PointText
            });
        }

        console.log("hitresult::", hitResult)
        console.log(hitResult);

        if (hitResult && hitResult.item && hitResult.item.data.fromMasdoc) {
            if (hitResult.item.selected == false) {
                console.log(temarrRef.current);
                hitResult.item.selected = true
                console.log(hitResult.item.id);
                // canvas.addEventListener('contextmenu', onContextMenu);
                // canvas.addEventListener('contextmenu', ontaginfoMenu);
                var resid = hitResult.item.id
                console.log(resid);
                temarrRef.current.push(resid);
                console.log(temarrRef.current);

                for (let i = 0; i < temarrRef.current.length; i++) {
                    var elementId = temarrRef.current[i]
                    console.log(elementId);
                    window.api.send('fetch-sin-ele', elementId);
                }

            }
            temarrRef.current = []
            // hitResult = ''
        }
        else {

            settaginfomenu({ visible: false, x: 0, y: 0 })
            canvas.removeEventListener('contextmenu', ontaginfoMenu);
            paper.project.getItems({ selected: true }).forEach(item => {
                console.log("enter unselect");
                item.selected = false;
            });
        }

    }

    const onFlagtagClick = async (event) => {
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        })
        console.log("enter handle")
        const point = new paper.Point(event.clientX - canvasRef.current.getBoundingClientRect().left, event.clientY - canvasRef.current.getBoundingClientRect().top);
        console.log("point:", point);
        const paperPoint = paper.view.viewToProject(point);
        console.log("paperpoint:", paperPoint)
        const hitResult = paper.project.hitTest(paperPoint, {
            // fill: true,
            stroke: true,
            segments: true,
            tolerance: 5,
        });

        // Check for text items separately
        if (!hitResult) {
            hitResult = paper.project.hitTest(paperPoint, {
                fill: true,
                tolerance: 5,
                class: paper.PointText
            });
        }


        console.log("hitresult::", hitResult)
        console.log(hitResult);

        if (hitResult && hitResult.item && hitResult.item.data.fromMasdoc) {
            if (hitResult.item.selected == false) {
                console.log(temarrRef.current);
                hitResult.item.selected = true
                console.log(hitResult.item.id);
                // canvas.addEventListener('contextmenu', onContextMenu);
                // canvas.addEventListener('contextmenu', ontaginfoMenu);
                var resid = hitResult.item.id
                console.log(resid);
                window.api.send('fetch-flag-tag', resid)
            }
            // hitResult = ''
        }
        else {
            paper.project.getItems({ selected: true }).forEach(item => {
                console.log("enter unselect");
                item.selected = false;
            });
        }
    }

    const handleselect = () => {
        setenablescselect(false)
        setenableselect(true)
        setenablesinselect(false)
        setenablewinselect(false)
        setpanonoff(false)
        setenableareadraw(false)
        // paper.project.getItems({ selected: true }).forEach(item => {
        //     console.log("enter unselect");
        //     item.selected = false;
        // })
    }

    const handlescselect = () => {
        setenablescselect(true)
        setenableselect(false)
        setenablesinselect(false)
        setenablewinselect(false)
        setpanonoff(false)
        setenableareadraw(false)
    }

    const handleeditpan = () => {
        setbottomextend(!isbottomextend)
    }
    const handleassigntag = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onflagconMenu);
        // console.log(isassignid);
        console.log(temarrRef.current);
        if (temarrRef.current.length == 0) {
            console.log('enter if');
            setCustomAlert(true);
            setModalMessage('Select elements first');
            // alert('Select elements first')
        }
        else {
            console.log('Enter else');
            setassignid(temarrRef.current)
            settagassishow(true)
        }

    }
    const handletagassiClose = () => {
        settagassishow(false);
    }

    const handleChange = (event) => {
        console.log(event.target.value);
        setSelectedValue(event.target.value);
    };
    const handleeletagassign = async (e) => {
        e.preventDefault()
        console.log("enter function");
        console.log(isassignid);
        console.log(allspids[0].filename);
        var currentfn = allspids[0].filename
        for (let i = 0; i < isassignid.length; i++) {
            // console.log("enter for loop");
            var elementid = isassignid[i]
            console.log(elementid);

            const data = {
                elementId: elementid,
                tagNumber: tagid,
                filename: currentfn
            };
            window.api.send('save-ele-tag', data);
        }
        console.log("reached end");
        setassignid([])
        settagassishow(false);
        setCustomAlert(true);
        setModalMessage('Tag assigned');
        // alert("Tag assigned")
        setSelectedValue('')
        temarrRef.current = []
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });
        // // setShow(false)
    }

    const handleZoomIn = (e) => {
        const center = paper.view.center;
        paper.view.zoom *= 1.1;
        paper.view.center = center;
        drawStoredRectangle();
        drawsavedarea();
    };

    const handleZoomOut = (e) => {
        if (paper.view.zoom > 1) {
            const center = paper.view.center;
            paper.view.zoom *= 0.9;
            paper.view.center = center;
            drawStoredRectangle();
            drawsavedarea();
        }
    };


    const handlepan = (e) => {
        setenableselect(false)
        setenablewinselect(false)
        setenablesinselect(false)
        setenablescselect(false)
        setenableareadraw(false)
        // document.querySelectorAll('.button').forEach(button => {
        //     button.classList.remove('active');
        // });

        // // Add 'active' class to the clicked button
        // e.target.classList.add('active');
        setpanonoff(true)
    }

    const handlefitview = (e) => {
        dlayerremove()
        // // svgGroup.position = paper.view.center;
        // document.querySelectorAll('.button').forEach(button => {
        //     button.classList.remove('active');
        // });

        // // Add 'active' class to the clicked button
        // e.target.classList.add('active');
        setpanonoff(false)
        console.log(viewRef);
        viewRef.current.zoom = 0.9900000000000001
        viewRef.current.center = originalPosition;

    }

    const enablePanning = () => {
        canvas.addEventListener('mousedown', phandleMouseDown);
        canvas.addEventListener('mousemove', phandleMouseMove);
        canvas.addEventListener('mouseup', phandleMouseUp);
        canvas.addEventListener('mouseleave', phandleMouseLeave);
    };

    const disablePanning = () => {

        canvas.removeEventListener('mousedown', phandleMouseDown);
        canvas.removeEventListener('mousemove', phandleMouseMove);
        canvas.removeEventListener('mouseup', phandleMouseUp);
        canvas.removeEventListener('mouseleave', phandleMouseLeave);
    }

    const phandleMouseUp = () => {
        isPanning.current = false;
    };

    const phandleMouseLeave = () => {
        isPanning.current = false;
    };

    const phandleMouseMove = (event) => {

        if (isPanning.current) {

            console.log(isPanning.current);
            const delta = new Point(event.offsetX, event.offsetY).subtract(lastMousePosition.current);
            console.log(delta);
            viewRef.current.center = viewRef.current.center.subtract(delta);
            console.log(viewRef.current.center);
            lastMousePosition.current = new Point(event.offsetX, event.offsetY);
            console.log(lastMousePosition.current);
        }
    };

    const phandleMouseDown = (event) => {
        isPanning.current = true;
        lastMousePosition.current = new Point(event.offsetX, event.offsetY);
        console.log(lastMousePosition.current);
        console.log(isPanning.current);
    };

    const handletaginfo = (e) => {
        // document.querySelectorAll('.button').forEach(button => {
        //     button.classList.remove('active');
        // });

        // // Add 'active' class to the clicked button
        // e.target.classList.add('active');
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('click', onMouseClick);
        canvas.removeEventListener('contextmenu', onflagconMenu);

        console.log(flagconmenu);
        dlayerremove()
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });
        setenableselect(false)
        setenablewinselect(false)
        setenablescselect(false)
        e.preventDefault()
        setenablesinselect(true)
        setenableareadraw(false)
        console.log("taginfoend");
    }

    const handlewindowselect = (e) => {
        // paper.project.getItems({ selected: true }).forEach(item => {
        //     console.log("enter unselect");
        //     item.selected = false;
        // })
        setenableselect(false)
        setpanonoff(false)
        setenablescselect(false)
        // // Remove 'active' class from all buttons
        // document.querySelectorAll('.button').forEach(button => {
        //     button.classList.remove('active');
        // });

        // paper.project.getItems({ class: paper.Path, }).forEach(item => {
        //     item.selected = false
        // });

        // // Add 'active' class to the clicked button
        // e.target.classList.add('active');
        setenablewinselect(true)
        setenableareadraw(false)
    }

    const handleareadraw = (e) => {
        setenableselect(false)
        setpanonoff(false)
        setenablescselect(false)
        setenablewinselect(false)
        setenableareadraw(true)
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        })
    }

    const enablewinselinteraction = () => {
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseDrag);
        canvas.addEventListener('mouseup', onMouseUp);
    }

    const disablewinselinteraction = () => {
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mousemove', onMouseDrag);
        canvas.removeEventListener('mouseup', onMouseUp);
    }

    const enableareadrawinteraction = () => {
        startDrawingRectangles()
    }

    const disableareadrawinteraction = () => {
        // setenableareadraw(false)
    }

    const addContextMenuListener = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.addEventListener('contextmenu', onflagconMenu);
    };

    const onMouseDown = (event) => {
        if (event.button !== 0) return;
        // Only proceed if the left mouse button is clicked

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const point = new paper.Point(event.clientX - rect.left, event.clientY - rect.top);
        const projectPoint = paper.view.viewToProject(point);
        startPoint = new paper.Point(projectPoint.x, projectPoint.y);
        selectionRectangle = new paper.Path.Rectangle(startPoint, startPoint);
        selectionRectangle.strokeColor = 'blue';
        selectionRectangle.strokeWidth = 1;
    };

    const onMouseDrag = (event) => {
        if (event.button !== 0) return;
        // Only proceed if the left mouse button is clicked
        if (selectionRectangle) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const point = new paper.Point(event.clientX - rect.left, event.clientY - rect.top);
            const projectPoint = paper.view.viewToProject(point);
            const endPoint = new paper.Point(projectPoint.x, projectPoint.y);
            selectionRectangle.remove(); // Remove the previous rectangle
            selectionRectangle = new paper.Path.Rectangle(startPoint, endPoint);
            selectionRectangle.strokeColor = 'blue';
            selectionRectangle.strokeWidth = 1;
        }
    };

    const onMouseUp = (event) => {
        if (event.button !== 0) return;
        // Only proceed if the left mouse button is clicked
        if (selectionRectangle) {
            let selectedItems = false;
            paper.project.getItems({ class: paper.Path }).forEach(item => {
                if (item.isInside(selectionRectangle.bounds) && item.data.fromMasdoc) {
                    item.selected = true;
                    // const canvas = canvasRef.current;
                    selectedItems = true;
                    temarrRef.current.push(item._id);
                    setsindoc(temarrRef.current);
                }
            });
            if (selectedItems) {
                addContextMenuListener(); // Ensure the context menu listener is added if items are selected
            } else {
                setflagconmenu({ visible: false, x: 0, y: 0 });
                const canvas = canvasRef.current;
                canvas.removeEventListener("contextmenu", onflagconMenu);
            }
            selectionRectangle.remove();
            selectionRectangle = null;
        }
    };



    const handlesavearea = () => {
        console.log(rectangles);

        if (Object.entries(rectangles).length > 0) {
            setareashows(true)
        }
        else {
            setModalMessage('No area drawn');
            setCustomAlert(true);
        }

    }

    const handleareaassiclose = () => {
        setareashows(false)
    }

    const handletaginfodis = () => {


        console.log("handle tag display");
        console.log(tagsselect);
        const ids = tagsselect.map(element => element.elementId);
        console.log(ids);
        for (let i = 0; i < ids.length; i++) {
            paper.project.getItems({ class: paper.Path, }).forEach(item => {
                if (ids[i] == item.id) {
                    item.selected = true
                }
            });
        }
        canvas.addEventListener('contextmenu', ontaginfoMenu);
        // settaginfoshow(true)
    }

    const handletaginfoClose = () => {
        settaginfoshow(false)
        setequlist({})
        setlinelist({})
        settagsinfo({})
    }
    const handletinfomodel = () => {
        settaginfomenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', ontaginfoMenu);
        settaginfoshow(true)
    }

    const handleflagassign = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onflagconMenu);
        setflagassishow(true)
    }

    const handleflagassiClose = () => {
        setflagassishow(false)
    }

    const handleflagassidetails = () => {

        // Collect all element IDs in an array
        const elementIds = [];
        for (let i = 0; i < temarrRef.current.length; i++) {
            console.log("enter for loop");
            elementIds.push(temarrRef.current[i]);
            console.log(temarrRef.current[i]);
        }

        // Create the data object with all element IDs
        const data = {
            elementIds: elementIds,
            parentDoc: docdetnum,
            connectDoc: flagcdocnum
        };
        console.log(data);
        // Send the data object
        window.api.send('save-flag-ele', data);
        setflagcdocnum('')
        // Reset flags and unselect items
        setflagassishow(false);
        // setassignid([]);
        temarrRef.current = []
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });

    }

    const handleflagcdocChange = (event) => {
        console.log(event.target.value);
        setflagcdocnum(event.target.value)
    }

    const handleflagconnection = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        // canvas.removeEventListener('contextmenu', onContextMenu);
        handlegetcdoc()
    }

    const handlegetcdoc = () => {
        console.log(issindoc);
        window.api.send('fetch-con-doc', issindoc);
    }

    const handleflagsubmit = () => {
        console.log('Enter handle flag submit');
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onContextMenu);
        setflagsconn(true)
        handlegetcdoc()
        // console.log(sinflag);
        // console.log(docdetnum);
        // window.api.send('fetch-doc-flag', docdetnum);
    }

    const handleflagcondelete = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onflagconMenu);
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });
        // canvas.removeEventListener('contextmenu', onflagconMenu);
        console.log(issindoc);
        window.api.send('unflag-ele-flag', issindoc);
    }

    const handleflagtag = () => {
        dlayerremove()
        setflagconmenu({ visible: false, x: 0, y: 0 })
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });
        setenableselect(false)
        setenablewinselect(false)
        setenablescselect(false)
        // e.preventDefault()
        setenablesinselect(false)
        console.log("flag tag connect");
        setenableflagtagselect(true)
        setenableareadraw(false)
        // setflagconmenu({ visible: false, x: 0, y: 0 })

    }

    const handledeletetag = () => {
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onflagconMenu);
        paper.project.getItems({ selected: true }).forEach(item => {
            console.log("enter unselect");
            item.selected = false;
        });
        console.log(temarrRef.current);
        if (temarrRef.current.length == 0) {
            setCustomAlert(true);
            setModalMessage('Select elements first');
            // alert('Select elements first')
            temarrRef.current = []
        }
        else {
            window.api.send('del-ele-tag', issindoc);
            setflagconmenu({ visible: false, x: 0, y: 0 })
            canvas.removeEventListener('contextmenu', onflagconMenu);
            temarrRef.current = []
        }
    }

    // const handletagflagselection = () => {

    // }

    const handleaddcomment = () => {
        setaddcomment(true)
        setflagconmenu({ visible: false, x: 0, y: 0 })
        canvas.removeEventListener('contextmenu', onflagconMenu);
    }

    const handleclosecomment = () => {
        setaddcomment(false)
    }

    const handlecommentlabel = () => {
        setshowComment(!showComment)
    }

    const createLabels = () => {
        // Clear existing labels
        Object.values(labelObjects.current).forEach(labelObject => {
            labelObject.remove();
        });
        labelObjects.current = {};

        if (showComment) {
            allcomments.forEach(item => {
                if (item.docNumber == docdetnum) {
                    const backgroundColor = getBackgroundColor(item.statusname);
                    const padding = 3;

                    // Create background rectangle
                    const text = new paper.PointText({
                        point: new paper.Point(item.coOrdinateX, item.coOrdinateY),
                        content: item.number,
                        fillColor: '#ffffff', // Text color
                        fontSize: 12
                    });

                    const textBounds = text.bounds;
                    const rect = new paper.Path.Rectangle({
                        point: new paper.Point(textBounds.x - padding, textBounds.y - padding),
                        size: new paper.Size(textBounds.width + padding * 2, textBounds.height + padding * 2),
                        fillColor: backgroundColor
                    });

                    // Group text and background rectangle
                    const labelGroup = new paper.Group([rect, text]);
                    labelGroup.onClick = () => handleCommentInfo(item);

                    labelObjects.current[item.number] = labelGroup;


                    // const label = new paper.PointText({
                    //     point: new paper.Point(item.coOrdinateX, item.coOrdinateY),
                    //     content: item.number,
                    //     fillColor: generateColor(item.number),
                    //     fontSize: 12
                    // });

                    // label.onClick = () => handleCommentInfo(item);

                    // labelObjects.current[item.number] = label;
                }
            });
        }

        paper.view.draw();
    };

    // // Function to generate a unique color based on index
    // const generateColor = (index) => {
    //     const hue = (index * 137.508) % 360; // Use a prime number multiplier for better distribution
    //     return `hsl(${hue}, 100%, 50%)`; // Generate HSL color
    // };

    // // Function to get background color based on status
    // const getBackgroundColor = (status) => {
    //     switch (status) {
    //         case 'open':
    //             return 'red';
    //         case 'closed':
    //             return 'green';
    //         case 'ongoing':
    //             return 'orange';
    //         case 'onhold':
    //             return 'yellow';
    //         default:
    //             return 'gray';
    //     }
    // };

    const getBackgroundColor = (status) => {
        const detail = commentdet.find(detail => detail.statusname === status);
        return detail ? detail.color : 'gray';
    };

    const handleCommentInfo = (item) => {
        console.log(item);
        setcommentinfo(item);
        setcommentinfotable(true);
    };

    const handleclosecommentinfo = () => {
        setcommentinfotable(false);
        setcommentinfo(null);
    };

    const deletecomment = (commentNumber) => {
        console.log(commentNumber);
        window.api.send("delete-comment", commentNumber);
        setcommentinfotable(false);
        setcommentinfo(null);
    };

    const handlecommentedit = () => {
        seteditcomment(true)
    }

    const handleclosecommentstatus = () => {
        seteditcomment(false)
    }

    const handleexportMenu = () => {
        setexportmenu(true)
        setenableselect(false)
        setenablewinselect(false)
        setenablesinselect(false)
        setenablescselect(false)
        setenableareadraw(false)
        dlayerremove()
        paper.project.activeLayer.children.forEach(sitem => {

            const texts = paper.project.getItems({
                class: paper.PointText,
            }).map(item => item.content);

            setSelectedTexts(texts);

            const IDs = paper.project.getItems({
                class: paper.Path,
            }).map(item => item._id);

            setPathIDs(IDs);

        });
    }

    const handlecloseexport = () => {
        setexportmenu(false)
        // setexportmenutwo(false)
    };

    const handleexId = () => {
        console.log(pathIDs);
        const data = [['Path IDs'], ...pathIDs.map(id => [id])];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Path IDs');
        XLSX.writeFile(wb, 'path_ids.xlsx');
    }

    const handleextext = () => {
        if (selectedTexts.length === 0) {
            console.warn("No text data to export.");
            return;
        }
        // Create a worksheet
        const ws = XLSX.utils.json_to_sheet(selectedTexts.map((text, index) => ({ Text: text, Index: index + 1 })));
        // Create a workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'TextData');
        // Save the workbook as an Excel file
        XLSX.writeFile(wb, 'TextData.xlsx');
        console.log(wb);
    }

    const handleEditButtonClick = () => {
        setisEditing(true);
    }

    const handleSaveButtonClick = (commentNumber) => {
        setisEditing(false);
        const data = {
            number: commentNumber,
            statusname: statusedit,
            comment: commentedit,
            priority: priorityedit
        }
        window.api.send('editCommentStatus', data);
        setstatusedit('')
        setcommentedit('')
        setpriorityedit('')
        setCustomAlert(true);
        setModalMessage("Status updated")
        handleclosecommentinfo()
    }

    const handleflagsconnectclick = (flagds) => {
        if (flagsconn == true) {
            console.log(sinflag);
            console.log(flagds);
            if (flagds != '' && sinflag != '') {
                console.log('HELLO WORLD');
                const data = {
                    flagId: flagds,
                    connectFlag: sinflag
                }

                window.api.send('update-flag-table', data);
                console.log(sinflag);
                console.log(flagds);
                const sdata = {
                    flagId: sinflag,
                    connectFlag: flagds
                }

                window.api.send('update-flag-table', sdata);
                paper.project.getItems({ selected: true }).forEach(item => {
                    console.log("enter unselect");
                    item.selected = false;
                });
                setCustomAlert(true);
                setModalMessage('Flags are connected');
                setflagsconn(false)
            }

        }
    }

    const toggleHighlightConndoc = () => {
        setHighlightConndoc(prev => !prev);
        setmasdoc(prevValue => (prevValue === '' ? mascontent : ''))
        setfunctionactive(prev => !prev)
        setmastercopyactive(prev => !prev)
    };

    const toggleHighlightMasdoc = () => {
        setHighlightMasdoc(prev => !prev);
        setconndoc(prevValue => (prevValue === '' ? svgcontent : ''));
    };

    // const saveSVG = () => {
    //     const svgString = paper.project.exportSVG({ asString: true });
    //     const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    //     saveAs(blob, 'modified.svg');
    //   };

    const extractFilename = (filePath) => {
        // Split the file path by backslash
        const parts = filePath.split('\\');
        // Return the last part, which is the filename
        return parts[parts.length - 1];
    };

    const copyExtraElements = () => {
        if (!conndocElementsRef.current || !masdocElementsRef.current) return;

        const selectedItems = conndocElementsRef.current.filter(item => item.selected);

        if (selectedItems.length === 0) {
            console.error('No items selected.');
            return;
        }

        let overlayPathIndex = 0;
        let overlayTextIndex = 0;

        // Copy selected elements from conndoc to mascontent
        selectedItems.forEach(item => {
            let clonedItem;
            if (item instanceof paper.Path) {
                clonedItem = item.clone();
                clonedItem._id = `overlay-path-${overlayPathIndex++}`;
            } else if (item instanceof paper.PointText) {
                clonedItem = item.clone();
                clonedItem._id = `overlay-text-${overlayTextIndex++}`;
            }

            if (clonedItem) {
                masdocElementsRef.current.addChild(clonedItem);
            }
        });

        paper.view.draw();

        // Export the modified SVG as a string
        const svgString = paper.project.exportSVG({ asString: true });
        console.log(svgString);

        window.api.send('copy-to-master', { svgString, originalMasdocPath: mascontent });
    };

    const copySelectedItems = async () => {
        // Function to read the content of masdoc
        const readMasdocContent = () => {
            return new Promise((resolve, reject) => {
                window.api.send('read-svg-file', mascontent);
                window.api.receive('read-svg-file-response', (response) => {
                    if (response.error) {
                        reject(response.error);
                    } else {
                        resolve(response.data);
                    }
                });
            });
        };

        // Function to copy selected items from conndoc to masdoc
        const copySelectedItems = async () => {
            const selectedItems = conndocElementsRef.current.filter(item => item.selected);

            if (selectedItems.length === 0) {
                console.error('No items selected.');
                return;
            }

            try {
                // Read current masdoc content
                const svgCon = await readMasdocContent();

                // Parse the SVG content of masdoc
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgCon, 'image/svg+xml');
                const svgRoot = doc.documentElement;

                // Clone and transform selected items
                selectedItems.forEach(item => {
                    const exportedSVG = item.exportSVG({ asString: true });
                    const itemDoc = parser.parseFromString(exportedSVG, 'image/svg+xml');
                    const itemElement = itemDoc.documentElement;

                    // Apply transformation
                    itemElement.setAttribute('transform', `translate(${item.position.x},${item.position.y})`);

                    // Add item to masdoc's root SVG
                    svgRoot.appendChild(doc.importNode(itemElement, true));
                });

                // Serialize the modified SVG content
                const serializer = new XMLSerializer();
                const modifiedSvgContent = serializer.serializeToString(svgRoot);

                // Log and send the modified SVG content
                console.log('modifiedSvgContent:', modifiedSvgContent);
                window.api.send('copy-to-master', { svgString: modifiedSvgContent, originalMasdocPath: mascontent });

            } catch (error) {
                console.error('Error copying selected items:', error);
            }
        };

        // Call the function to copy selected items
        copySelectedItems();
    };


    const startDrawingRectangles = () => {
        drawingLayerRef.current = new paper.Layer({ name: 'drawingLayer' });
        drawingLayerRef.current.activate();
        const tool = new paper.Tool();
        let startPoint;
        let hasDragged = false;

        tool.onMouseDown = function (event) {
            startPoint = event.point;
            if (currentRectangleRef.current) {
                currentRectangleRef.current.remove();
            }
            setRectangles({});
            hasDragged = false;
        };

        tool.onMouseDrag = function (event) {
            if (currentRectangleRef.current) {
                currentRectangleRef.current.remove();
            }

            const rectangle = new paper.Path.Rectangle(startPoint, event.point);
            rectangle.strokeColor = 'red';
            rectangle.fillColor = new paper.Color(1, 0, 0, 0.3);
            rectangle.strokeWidth = 2 / paper.view.zoom;

            drawingLayerRef.current.addChild(rectangle);
            currentRectangleRef.current = rectangle;
            hasDragged = true;
        };

        tool.onMouseUp = function (event) {
            if (currentRectangleRef.current) {
                if (hasDragged) {
                    const bounds = currentRectangleRef.current.bounds;
                    setRectangles({
                        topLeft: bounds.topLeft,
                        bottomRight: bounds.bottomRight,
                        x: bounds.topLeft.x,
                        y: bounds.topLeft.y,
                        width: bounds.width,
                        height: bounds.height
                    });
                } else {
                    // Mouse was clicked without dragging, clear the rectangles
                    setRectangles({});
                }
            }
        };
    };

    const handlesavelayer = async (e) => {
        e.preventDefault();

        // if (!rectangles || !selectvalue || !sindocid) {
        //   console.error('Missing required data for saving layer');
        //   return;
        // }

        const ldata = {
            areaNumber: selectvalue,
            x: rectangles.x,
            y: rectangles.y,
            width: rectangles.width,
            height: rectangles.height,
            docId: sindocid
        };

        // Send data to Electron main process
        window.api.send('save-layer', ldata);

        // Clear the rectangle and reset state
        if (currentRectangleRef.current) {
            currentRectangleRef.current.remove();
            currentRectangleRef.current = null;
        }
        setRectangles(null);
        setselectvalue('');
        setareashows(false)
    };

    const handleareachange = (event) => {
        console.log(event.target.value);
        setselectvalue(event.target.value)
    }

    const handleshowarea = async () => {
        window.api.send('show-doc-area', sindocid)

    }

    const loadAndDrawRectangle = (savedDataArray) => {
        if (!Array.isArray(savedDataArray) || savedDataArray.length === 0 || !drawingLayerRef.current) return;

        drawingLayerRef.current.removeChildren();

        const drawnRectangles = savedDataArray.map(savedData => {
            const rectangle = new paper.Path.Rectangle({
                point: [parseFloat(savedData.x), parseFloat(savedData.y)],
                size: [parseFloat(savedData.width), parseFloat(savedData.height)],
                strokeColor: 'red',
                fillColor: new paper.Color(1, 0, 0, 0.5),
                strokeWidth: 2 / paper.view.zoom
            });

            drawingLayerRef.current.addChild(rectangle);

            return {
                rectangle,
                data: {
                    areaNumber: savedData.areaNumber,
                    x: parseFloat(savedData.x),
                    y: parseFloat(savedData.y),
                    width: parseFloat(savedData.width),
                    height: parseFloat(savedData.height),
                    docId: savedData.docId
                }
            };
        });

        console.log(drawnRectangles);
        // const valu=drawnRectangles.map(item => item.data)
        // console.log(valu);

        setsavRectangles(drawnRectangles.map(item => item.data));


        // setSindocid(savedDataArray[0].docId); 
        // Assuming all rectangles belong to the same document
    };

    return (
        <div>
            <canvas id="canvas" ref={canvasRef} className='border border-1 border-danger' style={{ width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0%', position: 'fixed', height: '100%', overflow: 'hidden' }} ></canvas>
            {mastertab && <div className='tmt w-25 rounded justify-content-around' style={{ left: isSideNavOpen ? '29%' : '24%' }}>
                <i class="spidControl fa-regular fa-file button " title='Master Copy' onClick={toggleHighlightConndoc}></i>
                <i class="spidControl fa-solid fa-file button " title='Smart Master' onClick={toggleHighlightMasdoc}></i>
                <i class="spidControl fa-solid fa-copy button " title='Smart Master' onClick={copyExtraElements}></i>
                <i class="spidControl fa-solid fa-copyright button" title='Smart Master' onClick={copySelectedItems}></i>
                {/* <i class="spidControl fa-solid fa-file button " title='Draw New Path' onClick={drawNewPath}></i> */}
                {/* <i class="spidControl fa-solid fa-file button " title='Save SVG' onClick={saveSVG}></i> */}
            </div>}
            {functionactive && <div id='rightopt' style={{ right: taginfoshow ? '200px' : '0' }} >
                <i class="spidControl fa-solid fa-circle-info  button " title='Tag Info' onClick={handletaginfo}></i>
                <i class="spidControl fa fa-search-plus button" title='Zoomin' onClick={handleZoomIn} ></i>
                <i class="spidControl fa fa-search-minus button" title='Zoomout' onClick={handleZoomOut}></i>
                <i class="fa-solid fa-up-down-left-right button" title='Pan' onClick={handlepan}></i>
                <i class="fa-solid fa-down-left-and-up-right-to-center button" title='Fit View' onClick={handlefitview}></i>
                <i class="spidControl fa fa-upload button" title="Export" onClick={handleexportMenu}></i>
                <i class="spidControl fa-solid fa-square  button " title='window select' onClick={handlewindowselect}></i>
                <i class="spidControl fa-solid fa-arrow-pointer button" title='Selection' onClick={handleselect}></i>
                <i class="spidControl fa fa-pencil button" title='Edit' onClick={handleeditpan}></i>
                <li class="spidControl fa-regular fa-comment button" title='Show comment' onClick={handlecommentlabel}></li>
                <li class="spidControl fa-solid fa-file-pen button" title='Edit comment' onClick={handlecommentedit}></li>
            </div>}

            {mastercopyactive && <div id='rightopt' style={{ right: '0' }} >
                {/* <i class="spidControl fa-solid fa-circle-info  button " title='Tag Info' onClick={handletaginfo}></i>
                <i class="spidControl fa fa-search-plus button" title='Zoomin' onClick={handleZoomIn} ></i>
                <i class="spidControl fa fa-search-minus button" title='Zoomout' onClick={handleZoomOut}></i>
                <i class="fa-solid fa-up-down-left-right button" title='Pan' onClick={handlepan}></i>
                <i class="fa-solid fa-down-left-and-up-right-to-center button" title='Fit View' onClick={handlefitview}></i>
                <i class="spidControl fa fa-upload button" title="Export" onClick={handleexportMenu}></i>
                <i class="spidControl fa-solid fa-square  button " title='window select' onClick={handlewindowselect}></i> */}
                <i class="spidControl fa-solid fa-arrow-pointer button" title='Selection' onClick={handlescselect}></i>
                {/* <i class="spidControl fa fa-pencil button" title='Edit' onClick={handleeditpan}></i>
                <li class="spidControl fa-regular fa-comment button" title='Show comment' onClick={handlecommentlabel}></li>
                <li class="spidControl fa-solid fa-file-pen button" title='Edit comment' onClick={handlecommentedit}></li> */}
            </div>}

            {/* <h2>Area Functions</h2>
                <div className='opt'>
                    <i class="fa-solid fa-pen-to-square svgElem button" title='Draw Area' onClick={handledrawarea}></i>
                    <i class="fa-solid fa-a svgElem button" title='Assign Area' onClick={handleassignarea}></i>
                </div> */}

            {taginfoshow && <div className='right pb-5' id='spidEditPane' style={{ height: '100%', width: '200px', backgroundColor: 'black' }}>
                {/* <div style={{ backgroundColor: 'white' }} className='btn' >Close</div> */}
                <button className='btn btn-light' onClick={handletaginfoClose}><i className="fa-solid fa-xmark"></i></button>
                {tagsinfo && <div style={{ color: 'white' }}>
                    <p>Tag Information</p>
                    {Object.entries(tagsinfo).map(([key, value]) => (

                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}

                </div>}
                {equlist && Object.keys(equlist).length > 0 && <div style={{ color: 'white' }}>
                    <p>Equipment Info</p>
                    {Object.entries(equlist).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </div>}
                {linelist && Object.keys(linelist).length > 0 && <div style={{ color: 'white' }}>
                    <p>Line Info</p>
                    {Object.entries(linelist).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </div>}
            </div>}

            {commentinfotable && <div className='right' id='spidEditPane' style={{ height: '100%', width: '200px', backgroundColor: 'black' }}>
                <div className='w-100' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className='btn btn-light' onClick={handleclosecommentinfo}><i className="fa-solid fa-xmark"></i></button>
                    <div className="btn btn-light" onClick={() => deletecomment(commentinfo.number)}><i className="fa-solid fa-trash"></i></div>
                    {(commentinfo.status != 'closed') && (
                        isEditing ? (
                            <div className="btn btn-dark" onClick={() => handleSaveButtonClick(commentinfo.number)}>
                                <i className="fa-solid fa-save"></i>
                            </div>
                        ) : (
                            <div className="btn btn-dark" onClick={() => handleEditButtonClick(commentinfo.number)}>
                                <i className="fa-solid fa-pencil"></i>
                            </div>
                        )
                    )}
                </div>

                <div style={{ color: 'white' }}>
                    <h6>Comment Info</h6>
                    <p>Comment No: {commentinfo.number}</p>
                    {/* <p>Comment: {commentinfo.comment}</p> */}

                    <p>Comment: {isEditing ? (<input onChange={e => setcommentedit(e.target.value)} type="text" value={commentedit} />) : (commentinfo.comment)}</p>

                    <p>Date: {commentinfo.createddate}</p>
                    <p>Created: {commentinfo.createdby}</p>
                    {/* <p>Status: {commentinfo.statusname}</p> */}

                    <p>Status:
                        {isEditing ? (
                            <select value={commentinfo.statusname || ''} onChange={e => setstatusedit(e.target.value)} style={{ width: '100%' }}>
                                <option value="" disabled>
                                    Choose type
                                </option>
                                {commentdet.map(option => (
                                    <option key={option.commentId} value={option.statusname}>{option.statusname}</option>
                                ))}
                            </select>
                        ) : (
                            commentinfo.statusname
                        )}
                    </p>


                    {/* <p>Priority: {commentinfo.priority}</p> */}

                    <p>Priority:
                        {isEditing ? (
                            <div class="priority" value={priorityedit} onChange={(e) => setpriorityedit(e.target.value)}>
                                {/* onChange={(e) => setPriority(e.target.value)} */}
                                {/* <label className='label'>Priority:</label> */}
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <input type="radio" id="priority1" name="priority" value="1" />
                                    <label for="priority1" style={{ marginRight: '5px' }}>1</label>
                                    <input type="radio" id="priority2" name="priority" value="2" />
                                    <label for="priority2" style={{ margin: '0 5px' }}>2</label>
                                    <input type="radio" id="priority3" name="priority" value="3" />
                                    <label for="priority3" style={{ marginLeft: '5px' }}>3</label>
                                </div>

                            </div>
                        ) : (commentinfo.priority)}
                    </p>
                </div>
            </div>
            }
            {isbottomextend && <div className='bet w-50 rounded' style={{ left: isSideNavOpen ? '29%' : '24%' }}>
                <i className="fa-solid fa-tag svgElem button " title='Assign Tag' onClick={handleassigntag} ></i>
                <i className="fa-solid fa-arrows-turn-to-dots svgElem button" title='Flag assign' onClick={handleflagassign}></i>
                <i className="fa-solid fa-delete-left svgElem button" title='Flag Connection Delete' onClick={handleflagcondelete}></i>
                <i className="fa-solid fa-pen-to-square svgElem button" title='Draw area' onClick={handleareadraw}></i>
                <i className="fa-regular fa-window-restore svgElem button" title='Save area' onClick={handlesavearea}></i>
                <i className="fa-solid fa-layer-group svgElem button" title='Show area' onClick={handleshowarea}></i>
            </div>
            }

            {taginfomenu.visible && (
                <ul className="context-menu" style={{ top: taginfomenu.y, left: taginfomenu.x }}>
                    <li onClick={handletinfomodel}>Tag info</li>
                </ul>
            )}

            {flagconmenu.visible && (
                <ul className="context-menu" style={{ top: flagconmenu.y, left: flagconmenu.x }}>
                    <li onClick={handleassigntag}>Tag assign</li>
                    <li onClick={handledeletetag}>Tag delete</li>
                    <li onClick={handleflagassign}>Flag assign</li>
                    <li onClick={handleflagcondelete}>Delete flag Connection</li>
                    <li onClick={handleflagconnection}>Connect flag doc</li>
                    <li onClick={handleflagsubmit}>Connect flags</li>
                    <li onClick={handleflagtag}>Connect adjcent tag</li>
                    <li onClick={handleaddcomment}>Add comment</li>

                </ul>
            )}

            {isaddcomment && <Comment onClose={handleclosecomment} isOpen={handleaddcomment} content={commcontent} x={isrx} y={isry} commentdet={commentdet} docdetnum={docdetnum}></Comment>}
            {editcomment && <CommentStatus onstop={handleclosecommentstatus} commentdet={commentdet}></CommentStatus>}


            <Modal show={tagassishow} onHide={handletagassiClose}>
                <Modal.Header className="title-dialog" closeButton>
                    <Modal.Title style={{ color: 'white' }}>Assign Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex justify-content-center mb-5'>
                        <p>Select Tag</p>
                        <select value={tagid} onChange={handleChange}>
                            <option value="">Select:-</option>
                            {alltags.map((i) => (
                                <option key={i.tagNumber} value={i.tagNumber}>
                                    {i.tagNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer className='footing'>
                    <Button variant="secondary" onClick={handletagassiClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={(e) => handleeletagassign(e)}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={areashows} onHide={handleareaassiclose}>
                <Modal.Header className="title-dialog" closeButton>
                    <Modal.Title style={{ color: 'white' }}>Assign Area</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex justify-content-center mb-5'>
                        <p>Select Area Number</p>
                        <select value={selectvalue} onChange={handleareachange}>
                            <option value="">Select:-</option>
                            {allareas.map((i) => (
                                <option key={i.areaNumber} value={i.areaNumber}>
                                    {i.areaNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer className='footing'>
                    <Button variant="secondary" onClick={handleareaassiclose}>
                        Close
                    </Button>
                    <Button variant="primary" type='button' onClick={(e) => handlesavelayer(e)}  >
                        {/* onClick={(e) => handlesavelayer(e)} */}
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={flagassishow} onHide={handleflagassiClose}>
                <Modal.Header className="title-dialog" closeButton>
                    <Modal.Title style={{ color: 'white' }}>Assign Flag Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex justify-content-center mb-5'>
                        <p>Select Connecting file:- </p>
                        <select value={flagcdocnum} onChange={handleflagcdocChange}>
                            <option value="">Select:-</option>
                            {allspids.map((project, index) => {
                                if (project.number !== docdetnum) {
                                    return (
                                        <option key={project.number} value={project.number}>
                                            {project.number}
                                        </option>
                                    );
                                } else {
                                    return null; // Exclude the option
                                }
                            })}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer className='footing'>
                    <Button variant="secondary" onClick={handleflagassiClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleflagassidetails}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* <Offcanvas show={taginfoshow} onHide={handletaginfoClose} placement={'end'}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Tag informaton</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {Object.entries(tagsinfo).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </Offcanvas.Body>
            </Offcanvas> */}

            {customAlert && (
                <Alert
                    message={modalMessage}
                    onAlertClose={() => setCustomAlert(false)}
                />
            )}

            {exportmenu && (
                <div
                    style={{
                        position: 'absolute',
                        top: '400px',
                        right: '2%',
                        backgroundColor: 'lightgray',
                        padding: '20px',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        borderBlockColor: 'black',
                        color: 'black'
                    }}
                >
                    {/* Close button */}
                    <button onClick={handlecloseexport}><i class="fa-solid fa-xmark"></i></button>

                    {/* Tag info */}
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                        <li className='btn' onClick={handleexId}>Export Id</li>
                        <li className='btn' onClick={handleextext}>Export Text</li>
                    </ul>
                </div>
            )}

        </div>
    )
}

export default Canvas