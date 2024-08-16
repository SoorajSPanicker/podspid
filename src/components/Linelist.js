import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import DeleteConfirm from './DeleteConfirm';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
function Linelist({ isSideNavOpen, alllines }) {
    const [editedRowIndex, setEditedRowIndex] = useState(-1);
    const [fluidCode1, setFluidCode1] = useState('')
    const [lineId1, setlineId1] = useState('')
    const [medium1, setmedium1] = useState('')
    const [lineSizeIn1, setlineSizeIn1] = useState('')
    const [lineSizeNb1, setlineSizeNb1] = useState('')
    const [pipingSpec1, setpipingSpec1] = useState('')
    const [insType1, setinsType1] = useState('')
    const [insThickness1, setinsThickness1] = useState('')
    const [heatTrace1, setheatTrace1] = useState('')
    const [lineFrom1, setlineFrom1] = useState('')
    const [lineTo1, setlineTo1] = useState('')
    const [pnid1, setpnid1] = useState('')
    const [pipingIso1, setpipingIso1] = useState('')
    const [pipingStressIso1, setpipingStressIso1] = useState('')
    const [maxOpPress1, setmaxOpPress1] = useState('')
    const [maxOpTemp1, setmaxOpTemp1] = useState('')
    const [dsgnPress1, setdsgnPress1] = useState('')
    const [minDsgnTemp1, setminDsgnTemp1] = useState('')
    const [maxDsgnTemp1, setmaxDsgnTemp1] = useState('')
    const [testPress1, settestPress1] = useState('')
    const [testMedium1, settestMedium1] = useState('')
    const [testMediumPhase1, settestMediumPhase1] = useState('')
    const [massFlow1, setmassFlow1] = useState('')
    const [volFlow1, setvolFlow1] = useState('')
    const [density1, setdensity1] = useState('')
    const [velocity1, setvelocity1] = useState('')
    const [paintSystem1, setpaintSystem1] = useState('')
    const [ndtGroup1, setndtGroup1] = useState('')
    const [chemCleaning1, setchemCleaning1] = useState('')
    const [pwht1, setpwht1] = useState('')
    const [currentDeleteTag, setCurrentDeleteTag] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        console.log(alllines);
    }, [alllines])

    const handleSave = (tag) => {
        console.log(tag)
        console.log(fluidCode1)

        const data = {
            tag: tag,
            fluidCode: fluidCode1,
            lineId: lineId1,
            medium: medium1,
            lineSizeIn: lineSizeIn1,
            lineSizeNb: lineSizeNb1,
            pipingSpec: pipingSpec1,
            insType: insType1,
            insThickness: insThickness1,
            heatTrace: heatTrace1,
            lineFrom: lineFrom1,
            lineTo: lineTo1,
            maxOpPress: maxOpPress1,
            maxOpTemp: maxOpPress1,
            dsgnPress: dsgnPress1,
            minDsgnTemp: minDsgnTemp1,
            maxDsgnTemp: maxDsgnTemp1,
            testPress: testPress1,
            testMedium: testMedium1,
            testMediumPhase: testMediumPhase1,
            massFlow: massFlow1,
            volFlow: volFlow1,
            density: density1,
            velocity: velocity1,
            paintSystem: paintSystem1,
            ndtGroup: ndtGroup1,
            chemCleaning: chemCleaning1,
            pwht: pwht1

        }
        setEditedRowIndex(-1);
        setFluidCode1('')
        setlineId1('')
        setmedium1('')
        setlineSizeIn1('')
        setlineSizeNb1('')
        setpipingSpec1('')
        setinsType1('')
        setinsThickness1('')
        setheatTrace1('')
        setlineFrom1('')
        setlineTo1('')
        setpnid1('')
        setpipingIso1('')
        setpipingStressIso1('')
        setmaxOpPress1('')
        setmaxOpTemp1('')
        setdsgnPress1('')
        setminDsgnTemp1('')
        setmaxDsgnTemp1('')
        settestPress1('')
        settestMedium1('')
        settestMediumPhase1('')
        setmassFlow1('')
        setvolFlow1('')
        setdensity1('')
        setvelocity1('')
        setpaintSystem1('')
        setndtGroup1('')
        setchemCleaning1('')
        setpwht1('')
        console.log(data);
        window.api.send('update-linelist-table', data);
    }

    const handleCloseEdit = () => {
        setEditedRowIndex(-1);
    }

    const handleEditOpen = (index) => {
        setEditedRowIndex(index);
        setFluidCode1(alllines[index].fluidCode);
        setlineId1(alllines[index].lineId)
        setmedium1(alllines[index].medium)
        setlineSizeIn1(alllines[index].lineSizeIn)
        setlineSizeNb1(alllines[index].lineSizeNb)
        setpipingSpec1(alllines[index].pipingSpec)
        setinsType1(alllines[index].insType)
        setinsThickness1(alllines[index].insThickness)
        setheatTrace1(alllines[index].heatTrace)
        setlineFrom1(alllines[index].lineFrom)
        setlineTo1(alllines[index].lineTo)
        setpnid1(alllines[index].pnid)
        setpipingIso1(alllines[index].pipingIso)
        setpipingStressIso1(alllines[index].pipingStressIso)
        setmaxOpPress1(alllines[index].maxOpPress)
        setmaxOpTemp1(alllines[index].maxOpTemp)
        setdsgnPress1(alllines[index].dsgnPress)
        setminDsgnTemp1(alllines[index].minDsgnTemp)
        setmaxDsgnTemp1(alllines[index].maxDsgnTemp)
        settestPress1(alllines[index].testPress)
        settestMedium1(alllines[index].testMedium)
        settestMediumPhase1(alllines[index].testMediumPhase)
        setmassFlow1(alllines[index].massFlow)
        setvolFlow1(alllines[index].volFlow)
        setdensity1(alllines[index].density)
        setvelocity1(alllines[index].velocity)
        setpaintSystem1(alllines[index].paintSystem)
        setndtGroup1(alllines[index].ndtGroup)
        setchemCleaning1(alllines[index].chemCleaning)
        setpwht1(alllines[index].pwht)
    }

    const handleDeleteLineFromTable = (tagNumber) => {
        // const isConfirmed = window.confirm("Are you sure you want to delete?");
        // if (isConfirmed) {
        //     window.api.send('remove-line-table', tagNumber);
        // }
        console.log(tagNumber);
        setCurrentDeleteTag(tagNumber);
        setShowConfirm(true);
    }

    const handleConfirmDelete = () => {
        window.api.send('remove-line-table', currentDeleteTag);
        setShowConfirm(false);
        setCurrentDeleteTag(null);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setCurrentDeleteTag(null);
    };

    const handleImportClick = () => {
        window.api.send('import-line-list');
    };

    const handleExport = () => {
        // Define the headers for the equipment list with actual field names
        const headers = [
            'tag', 'fluidCode', 'lineId', 'medium', 'lineSizeIn', 'lineSizeNb', 'pipingSpec', 'insType', 'insThickness', 'heatTrace', 'lineFrom', 'lineTo', 'maxOpPress', 'maxOpTemp', 'dsgnPress', 'minDsgnTemp', 'maxDsgnTemp', 'testPress', 'testMedium', 'testMediumPhase', 'massFlow', 'volFlow', 'density', 'velocity', 'paintSystem', 'ndtGroup', 'chemCleaning', 'pwht'
        ];

        // Combine headers with the actual equipment list data if it exists
        const dataToExport = alllines.length > 0 ? alllines : [];

        // Convert data to a sheet
        const ws = XLSX.utils.json_to_sheet(dataToExport, { header: headers });

        // Create a new workbook and append the sheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Line List');

        // Write the workbook to an array buffer
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Save the file using FileSaver
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'LineList.xlsx');
    };

    // const handleExport = () => {
    //     const ws = XLSX.utils.json_to_sheet(alllines);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Line List');
    //     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //     saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'LineList.xlsx');
    // };


    // const handleExport = () => {
    //     // Define the headings of your table
    //     const headings = ["Column1", "Column2", "Column3"]; // Replace with your actual headings

    //     // Check if the alllines array is empty
    //     const dataToExport = alllines.length === 0 ? [headings] : [headings, ...alllines];

    //     // Convert the data to a sheet
    //     const ws = XLSX.utils.json_to_sheet(dataToExport, { skipHeader: true });
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Line List');

    //     // Write the workbook and trigger the download
    //     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //     saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'LineList.xlsx');
    // };
    const handleSearchline = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredLineList = alllines.filter(line =>
        line.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handletagselect = (data) => {
        window.api.send('tag-doc-con', data)
    }

    return (


        <div style={{ width: '100%', height: '100vh', backgroundColor: 'white', position: 'fixed', width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0' }}>
            <form>
                <div className="table-container">
                    <table className="linetable">
                        <thead>
                            <tr>
                                <th className="wideHead">Tag</th>
                                <th className="wideHead">Fluid code</th>
                                <th className="wideHead">Line ID</th>
                                <th >Medium</th>
                                <th >Line size (inch)</th>
                                <th >Line size (NB)</th>
                                <th>Piping spec.</th>
                                <th >Insulation type</th>
                                <th >Insulation thickness</th>
                                <th >Heat tracing</th>
                                <th className="wideHead">Line from</th>
                                <th className="wideHead">Line to</th>
                                <th >Maximum operating pressure (bar)</th>
                                <th >Maximum operating tempertature (ºC)</th>
                                <th >Design pressure (bar)</th>
                                <th >Minimum design tempertature (ºC)</th>
                                <th>Maximum design tempertature (ºC)</th>
                                <th >Test pressure (bar)</th>
                                <th >Test medium</th>
                                <th >Test medium phase</th>
                                <th >Mass flow (kg/hr)</th>
                                <th >Volume flow (m<sup>3</sup>/hr)</th>
                                <th >Density (kg/m<sup>3</sup>)</th>
                                <th >Velocity (m/s)</th>
                                <th >Paint system</th>
                                <th>NDT group</th>
                                <th >Chemical cleaning</th>
                                <th >PWHT</th>
                                <th className="tableActionCell">
                                    <i className="fa fa-upload" title="Export" onClick={handleExport}></i>
                                    <i className="fa fa-download ms-2" title="Import" onClick={handleImportClick}></i>
                                </th>
                            </tr>
                            <tr>
                                <th colSpan={20}>
                                    <input
                                        type="text"
                                        placeholder="Search by Tag"
                                        value={searchQuery}
                                        onChange={handleSearchline}
                                        style={{ width: '100%', padding: '5px' }}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLineList.map((line, index) => (
                                <tr key={index} style={{ color: 'black',cursor:'pointer' }}>
                                    <td onClick={() => handletagselect(line.tag)} style={{ backgroundColor: '#f0f0f0' }}>{line.tag}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setFluidCode1(e.target.value)} type="text" value={fluidCode1} /> : line.fluidCode}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setlineId1(e.target.value)} type="text" value={lineId1} /> : line.lineId}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => setmedium1(e.target.value)} type="text" value={medium1} /> : line.medium}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setlineSizeIn1(e.target.value)} type="text" value={lineSizeIn1} /> : line.lineSizeIn}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setlineSizeNb1(e.target.value)} type="text" value={lineSizeNb1} /> : line.lineSizeNb}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setpipingSpec1(e.target.value)} type="text" value={pipingSpec1} /> : line.pipingSpec}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setinsType1(e.target.value)} type="text" value={insType1} /> : line.insType}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setinsThickness1(e.target.value)} type="text" value={insThickness1} /> : line.insThickness}</td>
                                    {/* <td style={{ color: 'black' }}>{editedRowIndex === index ? <input onChange={e => setpnid1(e.target.value)} type="text" value={pnid1} /> : line.pnid}</td>
                                 <td style={{ color: 'black' }}>{editedRowIndex === index ? <input onChange={e => setpipingIso1(e.target.value)} type="text" value={pipingIso1} /> : line.pipingIso}</td> 
                                    <td style={{ color: 'black' }}>{editedRowIndex === index ? <input onChange={e => setpipingStressIso1(e.target.value)} type="text" value={pipingStressIso1} /> : line.pipingStressIso}</td> */}
                                    <td >{editedRowIndex === index ? <input onChange={e => setheatTrace1(e.target.value)} type="text" value={heatTrace1} /> : line.heatTrace}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setlineFrom1(e.target.value)} type="text" value={lineFrom1} /> : line.lineFrom}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => setlineTo1(e.target.value)} type="text" value={lineTo1} /> : line.lineTo}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setmaxOpPress1(e.target.value)} type="text" value={maxOpPress1} /> : line.maxOpPress}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setmaxOpTemp1(e.target.value)} type="text" value={maxOpTemp1} /> : line.maxOpTemp}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setdsgnPress1(e.target.value)} type="text" value={dsgnPress1} /> : line.dsgnPress}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setminDsgnTemp1(e.target.value)} type="text" value={minDsgnTemp1} /> : line.minDsgnTemp}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setmaxDsgnTemp1(e.target.value)} type="text" value={maxDsgnTemp1} /> : line.maxDsgnTemp}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => settestPress1(e.target.value)} type="text" value={testPress1} /> : line.testPress}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => settestMedium1(e.target.value)} type="text" value={testMedium1} /> : line.testMedium}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => settestMediumPhase1(e.target.value)} type="text" value={testMediumPhase1} /> : line.testMediumPhase}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setmassFlow1(e.target.value)} type="text" value={massFlow1} /> : line.massFlow}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setvolFlow1(e.target.value)} type="text" value={volFlow1} /> : line.volFlow}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setdensity1(e.target.value)} type="text" value={density1} /> : line.density}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => setvelocity1(e.target.value)} type="text" value={velocity1} /> : line.velocity}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => setpaintSystem1(e.target.value)} type="text" value={paintSystem1} /> : line.paintSystem}</td>
                                    <td>{editedRowIndex === index ? <input onChange={e => setndtGroup1(e.target.value)} type="text" value={ndtGroup1} /> : line.ndtGroup}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setchemCleaning1(e.target.value)} type="text" value={chemCleaning1} /> : line.chemCleaning}</td>
                                    <td >{editedRowIndex === index ? <input onChange={e => setpwht1(e.target.value)} type="text" value={pwht1} /> : line.pwht}</td>
                                    <td style={{ backgroundColor: '#f0f0f0' }}>
                                        {
                                            editedRowIndex === index ?
                                                <>
                                                    <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSave(line.tag)}></i>
                                                    <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEdit}></i>
                                                </>
                                                :
                                                <>
                                                    <i className="fa-solid fa-pencil" onClick={() => handleEditOpen(index)}></i>
                                                    <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeleteLineFromTable(line.tag)}></i>
                                                </>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>

            {showConfirm && (
                <DeleteConfirm
                    message="Are you sure you want to delete?"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>

    )
}

export default Linelist