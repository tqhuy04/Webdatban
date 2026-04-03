import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';


function Sidebar() {
    useEffect(() => {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide) => {
            slide.addEventListener('click', () => {
                slides.forEach((s) => s.classList.remove('activead'));
                slide.classList.add('activead');
            });
        });
    }, []);
    return (
        <div className='col-md-2-sidebar admin-sidebar'>
            <div className="admin-sidebar-brand">
                <h1>Dola Restaurant</h1>
            </div>

            <nav className="admin-sidebar-nav">
                <h6>NAVIGATION</h6>
                <ul className='navigation'>

                    <li className='slide activead'>
                        <Link to='/Admin/Home'><i className="fas fa-home"></i> Dashboard </Link>
                    </li>
                    <li className='slide'><Link to='/Admin/Account'><i className="fas fa-user-cog"></i> Tài khoản</Link> </li>
                    <li className='slide'><Link to='/Admin/Customer'><i className="fas fa-users"></i> Khách hàng</Link> </li>
                    <li className='slide'><Link to='/Admin/Menu_category'><i className="fas fa-list-alt"></i> Danh mục món</Link> </li>
                    <li className='slide'><Link to='/Admin/Menu_item'><i className="fas fa-utensils"></i> Món</Link> </li>
                    <li className='slide'><Link to='/Admin/Table'><i className="fas fa-chair"></i> Bàn</Link> </li>
                    <li className='slide'><Link to='/Admin/Promotion'><i className="fas fa-tags"></i> Khuyến mại</Link> </li>
                    <li className='slide'><Link to='/Admin/Table_booking'><i className="fas fa-calendar-check"></i> Lượt đặt bàn </Link> </li>
                    <li className='slide'><Link to='/Admin/Feedback'><i className="fas fa-star"></i> Lượt đánh giá </Link> </li>

                </ul>
            </nav>
        </div>
    )
}

export default Sidebar