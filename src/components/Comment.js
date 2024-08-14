import React, { useEffect, useState } from 'react'
import Alert from './Alert';

function Comment({ x,y,onClose,isOpen,content }) {
    // { x, y, isOpen, onClose, content }
    const [comment, setComment] = useState('');
    const [status, setstatus] = useState('');
    const [priority, setPriority] = useState('');
    // const [comments, setComments] = useState([]);
    const [customAlert, setCustomAlert] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    // useEffect(() => {
    //     console.log(x);
    // }, [])
    // useEffect(() => {
    //     console.log(y);
    // }, [])

    const handleCommentClick = () => {
        // setComment('');
        // onClose();
        if (!comment) {
            // alert("please fill correctly or the given object details not availible")
            setCustomAlert(true);
            setModalMessage('please fill correctly or the given object details not availible');
        }
        else {
            const data = {
                comment: comment,
                status: status,
                priority: priority,
                coordinateX: content.isX,
                coordinateY: content.isy,
            }
            window.api.send('add-comment', data)
            setComment('');
            setstatus('');
            setPriority('');
            onClose()
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setComment('');
            setstatus('');
            setPriority('');
        }
    }, [isOpen]);
    const menuHeight = '400px'
    return (
        <div id="commentModal" class="modalcomment" style={{
            position: 'absolute',
            width: '300px',
            top: y + menuHeight > window.innerHeight ? y - menuHeight : y,
            left: x - 250,
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: '5px',
            boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            borderBlockColor: 'black',
        }}>
            {/* <!-- Modal content --> */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', color: 'white', padding: '10px' }}>
                <h6 style={{ margin: '0' }}>Set Comment</h6><span class="closes" style={{ cursor: 'pointer' }} onClick={onClose}>&times;</span>
                {/*  */}
            </div>
            <div class="comment-modal-content">

                <label>comment</label>
                <textarea id="commentInput" placeholder="Enter your comment here..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                {/* onChange={(e) => setComment(e.target.value)} */}
                <label for="status" >Status:</label>
                <select id="status" value={status} onChange={(e) => setstatus(e.target.value)}>
                    {/* onChange={(e) => setstatus(e.target.value)} */}
                    <option value="" disabled>Choose status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="ongoing">Ongoing</option>
                </select>
                <div class="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    {/* onChange={(e) => setPriority(e.target.value)} */}
                    <label className='label'>Priority:</label>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <input type="radio" id="priority1" name="priority" value="1" />
                        <label for="priority1" style={{ marginRight: '5px' }}>1</label>
                        <input type="radio" id="priority2" name="priority" value="2" />
                        <label for="priority2" style={{ margin: '0 5px' }}>2</label>
                        <input type="radio" id="priority3" name="priority" value="3" />
                        <label for="priority3" style={{ marginLeft: '5px' }}>3</label>
                    </div>

                </div>
                <button id="addCommentBtn" className='btn' onClick={() => handleCommentClick(x, y)}>Save Comment</button>
                {/* onClick={() => handleCommentClick(x, y)} */}
            </div>
            {customAlert && (
                <Alert
                    message={modalMessage}
                    onAlertClose={() => setCustomAlert(false)}
                />
            )}
        </div>
        
    )
}

export default Comment