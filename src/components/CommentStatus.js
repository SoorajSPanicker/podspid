import React, { useEffect, useState } from 'react'
import Alert from './Alert';
import DeleteConfirm from './DeleteConfirm';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
function CommentStatus({ commentdet, onstop }) {
    const [editedtagrowIndex, setEditedtagrowIndex] = useState(-1);
    const [statusinfo1, setstatusinfo1] = useState('')
    const [colorinfo1, setcolorinfo1] = useState('')
    const [addstatus, setaddstatus] = useState('')
    const [addcolor, setaddcolor] = useState('')

    const [customAlert, setCustomAlert] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [currentDeleteTag, setCurrentDeleteTag] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [addform, setaddform] = useState(false)
    useEffect(() => {
        console.log(commentdet);
    }, [commentdet])

    const handleSavetag = (tag) => {

        console.log(statusinfo1);
        console.log(colorinfo1);
        const data = {
            statusname: statusinfo1,
            color: colorinfo1
        }
        setEditedtagrowIndex(-1);

        setstatusinfo1('')
        setcolorinfo1('')
        // window.api.send("update-taginfo-table", data);
    }

    const handletagCloseEdit = () => {
        setEditedtagrowIndex(-1);
    }

    const handletagEditOpen = (index) => {
        setEditedtagrowIndex(index);
        setstatusinfo1(commentdet[index].statusinfo1);
        setcolorinfo1(commentdet[index].colorinfo1);
    }


    const handleDeletetagFromTable = (statusname) => {
        // const isConfirmed = window.confirm("Are you sure you want to delete?");
        // if (isConfirmed) {
        //     window.api.send('remove-taginfo-table', tagNumber);
        // }
        console.log(statusname);
        setCurrentDeleteTag(statusname);
        setShowConfirm(true);
    }

    const handleConfirmDelete = () => {
        window.api.send('remove-commentstatus-table', currentDeleteTag);
        setShowConfirm(false);
        setCurrentDeleteTag(null);
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
        setCurrentDeleteTag(null);
    };

    const handleImportClick = () => {
        window.api.send('import-comment-details');
    };

    const handleaddClick = () => {
        setaddform(true)
    }

    const handleClose = () => setaddform(false);

    const handleAdd = () => {
        const data = {
            statusname: addstatus,
            color: addcolor
        }

        setaddstatus('')
        setaddcolor('')
        window.api.send('add-commentdetails-table', data);
        setaddform(false)
    }

    return (
        <div style={{ width: '300px', backgroundColor: '#fff', zIndex: '1000', position: 'fixed', top: '100px', left: '400px', height: '200px', display: 'flex', flexDirection: 'column' }}>
            <div style={{display:'flex',justifyContent:'space-between', backgroundColor: "black"}}><h6 style={{ margin: '0', color: 'white' }}>Set Comment </h6><span class="closes ps-5" style={{ cursor: 'pointer', color: 'white'}} onClick={onstop}>&times;</span></div>
            <form>
                <div className="comment-container">
                    <table className="infotable">
                        <thead>
                            <tr>
                                <th id='linehead' >status</th>
                                <th id='linehead'>color</th>
                                <th id='linehead' class="tableActionCell" >
                                    {/* <i class="fa fa-upload" title="Export" ></i> */}
                                    <i class="fa fa-download" title="Import" onClick={handleImportClick}></i>
                                    <i class="fa-solid fa-circle-plus ps-2" title onClick={handleaddClick}></i>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {commentdet.map((comment, index) => (
                                <tr key={index} style={{ color: 'black' }}>
                                    <td style={{ color: 'black' }}>{editedtagrowIndex === index ? <input onChange={e => setstatusinfo1(e.target.value)} type="text" value={statusinfo1} /> : comment.statusname}</td>
                                    <td style={{ color: 'black' }}>{editedtagrowIndex === index ? <input onChange={e => setcolorinfo1(e.target.value)} type="text" value={colorinfo1} /> : comment.color}</td>
                                    <td style={{ backgroundColor: '#f0f0f0' }}>
                                        <i className="fa-solid fa-trash-can ms-3" onClick={() => handleDeletetagFromTable(comment.statusname)} ></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </form>

            <Modal show={addform} onHide={handleClose}>
                <Modal.Header style={{ backgroundColor: '#ebedeb' }} closeButton>
                    <Modal.Title>Add Comment Status Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>

                        <FloatingLabel
                            controlId="floatingInput1"
                            label="status"
                            className="mb-2"
                        >
                            <Form.Control onChange={(e) => setaddstatus(e.target.value)} value={addstatus} name='uid' type="text" placeholder="status" />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="floatingInput2"
                            label="color"
                            className="mb-2"
                        >
                            <Form.Control onChange={(e) => setaddcolor(e.target.value)} value={addcolor} name='inr' type="text" placeholder="color" />
                        </FloatingLabel>
                        

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAdd}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

            {customAlert && (
                <Alert
                    message={modalMessage}
                    onAlertClose={() => setCustomAlert(false)}
                />
            )}

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

export default CommentStatus