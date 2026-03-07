
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';


function Sidebar() {
    useEffect(() => {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide) => {
            slide.addEventListener('click', () => {
                // Loại bỏ class active khỏi tất cả slide
                slides.forEach((s) => s.classList.remove('activead'));
                // Thêm class active vào slide được chọn
                slide.classList.add('activead');
            });
        });
    }, []);
    return (
        <div className='col-md-2' style={{ background: '#3d454e', height: '100vh', position: 'fixed' }}>
            <p style={{ fontFamily: " 'Dancing Script', cursive ", fontSize: '30px', textAlign: 'center', color: '#bd8133', marginTop: '16px' }}>Dola Restaurant</p>


            <h6 className="m-4" style={{ color: '#62677399' }}>NAVIGATION</h6>
            <ul className='navigation m-0 p-0'>

                <li className='slide activead' style={{ padding: '8px 20px' }}>
                    <Link to='/Admin/Home'><i className="fas fa-home me-2 "></i> Dashboard </Link>
                </li>
                <li className='slide' style={{ padding: '8px 20px' }}><Link to='/Admin/Account'><i className="fas fa-user me-2"></i> Tài khoản</Link> </li>
                <li className='slide' style={{ padding: '8px 20px' }}><Link to='/Admin/Customer'><i className="fas fa-user me-2"></i> Khách hàng</Link> </li>
                <li className='slide' style={{ padding: '8px 20px' }}><Link to='/Admin/Menu_category'><i className="fas fa-list me-2"></i>Danh mục món</Link> </li>
                <li className='slide' style={{ padding: '8px 20px' }}><Link to='/Admin/Menu_item'><i className="fas fa-utensils me-2"></i>Món</Link> </li>
                <li className='slide' style={{ padding: '8px 20px' }}><Link to='/Admin/Table'><i className="fas fa-table me-2"></i>Bàn</Link> </li>
                <li className='slide' style={{ padding: '8px 20px' }}><Link to='/Admin/Promotion'><i className="fas fa-tags me-2"></i> Khuyến mại</Link> </li>
                <li className='slide' style={{ padding: '8px 20px' }}><Link to='/Admin/Table_booking'><i className="fas fa-clipboard-list me-2"></i> Lượt đặt bàn </Link> </li>
                <li className='slide' style={{ padding: '8px 20px' }}><Link to='/Admin/Feedback'><i className="fas fa-clipboard-list me-2"></i> Lượt đánh giá </Link> </li>




            </ul>
        </div>
    )
}

export default Sidebar