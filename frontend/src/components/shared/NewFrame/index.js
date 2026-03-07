import React from 'react'
import { Link } from 'react-router-dom'

const NewFrame = ({ imgSrc, title, text }) => {
    return (
        <div className='news-item d-flex flex-column align-items-center justify-content-center text-white' style={{ height: 'auto', width: '100%' }}>
            <img className='w-100' src={imgSrc} />
            <h5 className='mt-5 text-center'>{title}</h5>
            <p>{text}</p>
            <Link to='' className='mb-3'>Xem thêm</Link>
        </div>
    );
}

export default NewFrame