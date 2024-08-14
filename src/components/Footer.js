import React from 'react'

function Footer() {
    return (
        <div className='d-flex justify-content-between' style={{position:'fixed',bottom:'0',width:'100%',backgroundColor:'#181818',zIndex:'2'}}>
            <div className='footText'>Developed by Poul Consult AS, Norway</div>
            <div className='footText'>
                <span id="mail" class="fa fa-envelope"></span><a style={{ textDecoration: 'none', color: 'white',paddingRight:'6px' }} href="MAILTO:jpo@poulconsult.com">jpo@poulconsult.com</a>
                <span id="web" class="fa fa-globe"></span><a style={{ textDecoration: 'none', color: 'white' }} id="url" href="http://www.poulconsult.com" target="_blank">www.poulconsult.com</a>
            </div>
        </div>
    )
}

export default Footer