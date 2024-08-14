import React from 'react'

function Header({selectedprojectPath}) {
  return (
    <div  style={{backgroundColor:'#181818',paddingLeft:'3px',paddingTop:'4px',paddingBottom:'4px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <img style={{ width: '140px', height: '25px' }} id="logoPD" src="images/logo-pd.png" />
        <div style={{color:'white',textAlign:'center',flexGrow:'1'}}>{selectedprojectPath}</div>
    </div>
  )
}

export default Header