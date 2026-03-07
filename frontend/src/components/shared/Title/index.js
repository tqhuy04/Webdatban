import React from 'react'

const Title = ({ title }) => {
    return (
        <div className='d-flex align-items-center justify-content-center w-100 pt-3'>
            <img src='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/dish.png' />
            <p style={{ fontFamily: " 'Dancing Script', cursive ", fontSize: '40px', color: '#fff', padding: '0 12px' }}>{title}</p>
            <img src='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/dish.png' />
        </div>
    )
}

export default Title