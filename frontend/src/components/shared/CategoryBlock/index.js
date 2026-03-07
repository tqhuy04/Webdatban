import React from 'react'

const CategoryBlock = ({ urlImg, categoryName, categoryDsc }) => {
    return (
        <div className='category-block' style={{ padding: '10px 8px', border: '2px solid #fff', borderRadius: '5px', color: '#fff' }}>
            <div className='text-center d-flex flex-column align-items-center justify-content-center category-block_child p-2'>
                <img style={{ width: '160px', height: '160px' }} src={urlImg} />
                <p style={{ fontSize: '26px', marginTop: '20px', marginBottom: '10px' }}>{categoryName}</p>
                <p style={{ fontSize: '16px', marginTop: '20px' }}>Các món {categoryDsc} được chế tinh tế với hương vị đặc biệt nhất</p>
            </div>

        </div>
    )
}

export default CategoryBlock