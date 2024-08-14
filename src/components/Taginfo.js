import React, { useState, useEffect } from 'react';
import DeleteConfirm from './DeleteConfirm';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Table from 'react-bootstrap/Table';
function Taginfo({ isSideNavOpen, userTagInfotable = [], generalTagInfoFields = {}, taginfohead = {} }) {
    const [editedRowIndex, setEditedRowIndex] = useState(-1);
    const [editedTagData, setEditedTagData] = useState({});
    const [currentDeleteNumber, setCurrentDeleteNumber] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [numFields, setNumFields] = useState(16);
    const [editUserField, setEditUserField] = useState(false);
    const [editUnitField, setEditUnitField] = useState(false);
    const [displayFields, setDisplayFields] = useState([]);
    const [istaginfotab, settaginfotab] = useState(true)
    const [istagsettab, settagsettab] = useState(false)
    const [selectedRows, setSelectedRows] = useState([]);
    const [maintabledata, setmaintabledata] = useState([])
    // const [selectedcheck, setselectedcheck] = useState([])
    useEffect(() => {
        const initialFields = generalTagInfoFields.length > 0
            ? generalTagInfoFields.slice(0, numFields)
            : Array.from({ length: numFields }, (_, index) => ({
                field: `Field ${index + 1}`,
                unit: `Unit ${index + 1}`,
            }));
        setDisplayFields(initialFields);
    }, [numFields, generalTagInfoFields]);

    useEffect(() => {
        console.log(displayFields);
    }, [displayFields])



    const handleConfirm = () => {
        window.api.send('remove-taginfo-table', currentDeleteNumber);
        setShowConfirm(false);
        setCurrentDeleteNumber(null);
    };


    const handleCancel = () => {
        setShowConfirm(false);
        setCurrentDeleteNumber(null);
    };

    const handleEditOpen = (index) => {
        setEditedRowIndex(index);
        setEditedTagData(userTagInfotable[index]);
    };

    const handleCloseEdit = () => {
        setEditedRowIndex(-1);
        setEditedTagData({});
        setEditUserField(false);
        setEditUnitField(false);
    };

    const handleChange = (field, value) => {
        setEditedTagData({
            ...editedTagData,
            [field]: value,
        });
    };

    const handleSave = (tagId) => {
        console.log(tagId);
        const updatedUserTagInfo = [...userTagInfotable];
        updatedUserTagInfo[editedRowIndex] = { ...editedTagData, tagId };

        setEditedRowIndex(-1);
        setEditedTagData({});
        console.log("editedTagData", editedTagData)

        window.api.send('update-taginfo-table', editedTagData);
    };

    const handleDeleteTagInfoFromTable = (tagNumber) => {
        setCurrentDeleteNumber(tagNumber);
        setShowConfirm(true);
    };

    const handleExport = () => {
        // Generate headers from generalTagInfoFields and add Tag and Type
        const headers = ['tag', 'type', ...generalTagInfoFields.map(field => field.field)];

        // Create data rows by mapping each entry in userTagInfotable
        const dataToExport = userTagInfotable.map(info => {
            const row = {
                tag: info.tag || '',
                type: info.type || '',
            };

            // Include additional taginfo fields based on generalTagInfoFields
            generalTagInfoFields.forEach((field, index) => {
                row[field.field] = info[`taginfo${index + 1}`] || '';
            });

            return row;
        });

        // Convert data to a sheet with headers
        const ws = XLSX.utils.json_to_sheet(dataToExport, { header: headers });

        // Create a new workbook and append the sheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'General Tag List');

        // Write the workbook to an array buffer
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Save the file using FileSaver
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'General-Tag-Info.xlsx');
    };

    const handleImportClick = () => {
        window.api.send('import-taginfo-list');
    }
    const handleNumFieldsChange = (event) => {
        const newNumFields = parseInt(event.target.value, 10);
        setNumFields(newNumFields);
    };

    const handleEditUserField = () => {
        setEditUserField(true);
    }

    const handleEditUnitField = () => {
        setEditUserField(true);
        setEditUnitField(true);
    }
    const handleFieldChange = (index, field, value) => {
        const updatedFields = [...displayFields];
        updatedFields[index][field] = value;
        setDisplayFields(updatedFields);
    };

    const handleSaveUserDefined = () => {
        console.log(displayFields)
        setEditUserField(false);
        setEditUnitField(false);
        window.api.send('saveUserDefinedFields', displayFields);
    }

    const handlesettings = () => {
        settaginfotab(false)
        settagsettab(true)
    }

    // useEffect(() => {
    //     console.log(maintabledata);
    //     maintabledata.forEach(data => {
    //         console.log(data);
    //         window.api.send('add-taginfoname-table', data);
    //     })
    // }, [maintabledata])

    // useEffect(() => {
    //     console.log(selectedRows);
    //     const fpush = []
    //     // Log selected rows' data to the console whenever it changes
    //     selectedRows.forEach(index => {
    //         console.log('Selected row data:', displayFields[index]);
    //         fpush.push(displayFields[index])

    //     });
    //     console.log(fpush);
    //     setmaintabledata(fpush)
    //     // console.log(selectedRows);
    // }, [selectedRows]);

    const handleshow = (e) => {
      console.log(e);
      

        // setSelectedRows((prevSelectedRows) => {

        //     const isSelected = prevSelectedRows.includes(index);
        //     if (isSelected) {
        //         // Get the value of the row that is being filtered out
        //         const rowValue = displayFields[index];
        //         console.log(rowValue);

        //         // Send the row value to the API before filtering it out
        //         window.api.send('delete-taginfoname-row', rowValue.id);
        //         // console.log(prevSelectedRows.filter((row) => row !== index));
        //         // Remove from selected rows
        //         return prevSelectedRows.filter((row) => row !== index);
        //     } else {
        //         // Add to selected rows
        //         return [...prevSelectedRows, index];
        //     }
        // });
    };

    useEffect(() => {
        console.log(taginfohead);
        // const ipush=[]
        // if (taginfohead.length > 0) {
        //     console.log(taginfohead);
        //     // setSelectedRows(taginfohead)
        //     taginfohead.forEach(data => {
        //         // setSelectedRows(data)
        //         //    handleshow(data.id)
        //         // console.log(data.id);
        //         console.log(data.id - 1);
        //         // handleshow(data.id-1)
        //         ipush.push(data.id-1)
        //     })
        // }
        // setSelectedRows(ipush)
    }, [taginfohead]);


    const handlesettingclose = () => {
        settaginfotab(true)
        settagsettab(false)
    }


    return (
        <div style={{ width: isSideNavOpen ? '83.5%' : '100%', marginLeft: isSideNavOpen ? '260px' : '0', height: '100vh', backgroundColor: 'white', position: 'fixed' }}>
            {istaginfotab && <form>
                <div className="table-container">
                    <table className="taginfotable">
                        <thead>
                            <tr>
                                <th className="wideHead">Tag</th>
                                <th className="wideHead">Type</th>
                                {taginfohead.map(item => (
                                    <th key={item.id} style={{ border: '1px solid black', padding: '8px' }}>
                                        {item.field}
                                    </th>
                                ))}
                                <th>
                                    <i className="fa fa-upload" title="Export" onClick={handleExport}></i>
                                    <i className="fa fa-download ms-2" title="Import" onClick={handleImportClick}></i>
                                </th>
                            </tr>

                            <tr>
                                <th ></th>
                                <th></th>

                                {taginfohead.map(item => (
                                    <th key={item.id} style={{ border: '1px solid black', padding: '8px' }}>
                                        {item.unit}
                                    </th>
                                ))}
                                <th >
                                    <i onClick={handlesettings} style={{ cursor: 'pointer' }} class="fa-solid fa-gear"></i>

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(userTagInfotable) && userTagInfotable.map((info, index) => (
                                <tr key={index} style={{ color: 'black' }}>
                                    <td style={{ backgroundColor: '#f0f0f0' }}>{info.tag}</td>
                                    <td>{info.type}</td>
                                    {displayFields.slice(0, numFields).map((field, fieldIndex) => (
                                        <td key={fieldIndex}>
                                            {editedRowIndex === index ? (
                                                <input
                                                    onChange={(e) => handleChange(`taginfo${fieldIndex + 1}`, e.target.value)}
                                                    type="text"
                                                    value={editedTagData[`taginfo${fieldIndex + 1}`] || ''}
                                                />
                                            ) : (
                                                info[`taginfo${fieldIndex + 1}`]
                                            )}
                                        </td>
                                    ))}
                                    <td style={{ backgroundColor: '#f0f0f0' }}>
                                        {editedRowIndex === index ? (
                                            <>
                                                <i className="fa-solid fa-floppy-disk text-success" onClick={() => handleSave(info.tagId)}></i>
                                                <i className="fa-solid fa-xmark ms-3 text-danger" onClick={handleCloseEdit}></i>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-pencil" onClick={() => handleEditOpen(index)}></i>
                                                <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeleteTagInfoFromTable(info.tagId)}></i>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>


                </div>
            </form>}

            {istagsettab && <form>
                <div className="table-container">
                    <Table>
                        <thead style={{ backgroundColor: '#606BCB' }}>
                            <th>Field value</th>
                            <th>Value assigned</th>
                            <th>Unit</th>
                            <th>Unit assigned</th>
                            <th>Show<i class="ms-5 fa-regular fa-circle-xmark" onClick={handlesettingclose}></i></th>
                        </thead>
                        <tbody>
                            {displayFields.map((field, index) => (
                                <tr key={index}>
                                    <td>{field.field}</td>
                                    <td>{editUserField ? (
                                        <input
                                            type="text"
                                            value={field.field}
                                            onChange={(e) => handleFieldChange(index, 'field', e.target.value)}
                                        />
                                    ) : (field.field)}</td>
                                    <td>{field.unit}</td>
                                    <td>{editUnitField ? (
                                        <input
                                            type="text"
                                            value={field.unit}
                                            onChange={(e) => handleFieldChange(index, 'unit', e.target.value)}
                                        />
                                    ) : (field.unit)}</td>
                                    <td><>
                                        {editUnitField || editUserField ? (<>
                                            <i className="fa-solid fa-floppy-disk " onClick={handleSaveUserDefined}></i>
                                            <i className="fa-solid fa-xmark ms-3" onClick={handleCloseEdit}></i>
                                        </>) : (<><i className="fa-solid fa-pencil" onClick={handleEditUnitField}></i>
                                            <i className="fa-solid fa-trash-can ms-3"></i>
                                            <input className='ms-2' type="checkbox" id="all" name='alls'  onChange={handleshow} /></>)}
                                        {/* checked={taginfohead.some(item => item.id === index + 1)} */}
                                    </></td>
                                </tr>
                            ))}

                        </tbody>
                    </Table>
                </div>
            </form>}
        </div>
    );
}

export default Taginfo

