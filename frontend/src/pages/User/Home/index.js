import React from 'react'
import { Link } from 'react-router-dom'
import Title from '../../../components/shared/Title'
import CategoryBlock from '../../../components/shared/CategoryBlock'
import Menu from '../../../components/shared/Menu'
import NewFrame from '../../../components/shared/NewFrame'


function Home() {
    return (
        <div className='container-fluid m-0 p-0 ' >
            <div className='banner position-relative'>
                <div className='text-center text-white position-absolute' style={{ top: '30%', left: '40%' }}>
                    <p style={{ fontFamily: " 'Dancing Script', cursive ", fontSize: '50px' }}>Dola Restaurant</p>
                    <p style={{ fontSize: '30px' }}>Món ăn đa dạng</p>
                    <Link to='/Bookings'><button className='bt-booking' style={{ width: '180px' }}>Đặt bàn ngay</button> </Link>
                </div>
            </div>
            <div className='container-fluid pt-5 pb-5' id='gioithieu' style={{ height: '500px', background: '#143b36' }}>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <i style={{ color: '#d69c52', fontSize: '24px' }}>Về Chúng Tôi</i>
                            <p style={{ fontFamily: " 'Dancing Script', cursive ", fontSize: '50px', color: '#fff' }}>Dola Restaurant</p>
                            <p style={{ color: '#fff', fontSize: '16px' }}>Nhà hàng chúng tôi luôn luôn đặt khách hàng lên hàng đầu, tận tâm phục vụ,
                                mang lại cho khách hàng những trãi nghiệm tuyệt với nhất. Các món ăn với công thức độc quyền sẽ mang lại
                                hương vị mới mẻ cho thực khách. Dola Restaurant xin chân thành cảm ơn.</p>
                        </div>
                        <div className='col-md-6'>
                            <img className='w-100 img-aboutus' src='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/about_image.jpg?1705898809027' alt='' />
                        </div>
                    </div>
                </div>
            </div>
            {/*  */}
            <div className='container-fluid' style={{ background: '#10302c', height: '550px' }}>
                <div className='container pt-3'>
                    <Title
                        title='Danh mục nổi bật'></Title>
                    <div className='row mt-3'>
                        <div className='col-md-3'>
                            <CategoryBlock
                                urlImg='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/cate_1.jpg?1705898809027'
                                categoryName='Món bò'
                                categoryDsc='bò'
                            ></CategoryBlock>

                        </div>
                        <div className='col-md-3'>
                            <CategoryBlock
                                urlImg='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/cate_2.jpg?1705898809027'
                                categoryName='Món gà'
                                categoryDsc='gà'
                            ></CategoryBlock>

                        </div>
                        <div className='col-md-3'>
                            <CategoryBlock
                                urlImg='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/cate_3.jpg?1705898809027'
                                categoryName='Món heo'
                                categoryDsc='heo'
                            ></CategoryBlock>

                        </div>
                        <div className='col-md-3'>
                            <CategoryBlock
                                urlImg='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/cate_4.jpg?1705898809027'
                                categoryName='Món cá'
                                categoryDsc='cá'
                            ></CategoryBlock>

                        </div>

                    </div>
                </div>
            </div>
            {/*  */}
            <div className='container-fluid' id='thucdon' style={{ background: '#143b36' }}>
                <div className='container pb-5'>
                    <Title
                        title='Thực đơn của chúng tôi'></Title>
                    <Menu></Menu>
                </div>

            </div>

            {/* banner */}
            <div className='container-fluid pt-4' style={{ background: '#10302c' }}>
                <div className='container pb-5'>
                    <div className='row'>
                        <div className='col-md-3 position-relative section_banner'>
                            <img className='w-100' src='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/banner1.png?1705898809027' alt=''/>
                            <div className='content'>
                                <p className='title1'>Dola Restaurant</p>
                                <p className='title2'>Món ăn đa dạng</p>

                            </div>
                        </div>
                        <div className='col-md-3 position-relative section_banner'>
                            <img className='w-100' src='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/banner2.png?1705898809027'alt='' />
                            <div className='content'>
                                <p className='title1'>Dola Restaurant</p>
                                <p className='title2'>Hương vị đặc biệt</p>

                            </div>
                        </div>
                        <div className='col-md-3 position-relative section_banner'>
                            <img className='w-100' src='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/banner3.png?1705898809027'alt='' />
                            <div className='content'>
                                <p className='title1'>Dola Restaurant</p>
                                <p className='title2'>Công thức độc quyền</p>

                            </div>
                        </div>
                        <div className='col-md-3 position-relative section_banner'>
                            <img className='w-100' src='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/banner4.png?1705898809027'alt='' />
                            <div className='content'>
                                <p className='title1'>Dola Restaurant</p>
                                <p className='title2'>Đảm bảo chất lượng</p>

                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <div className='row mt-2'>
                        <div className='col-md-3 text-white d-flex align-items-center justify-content-center' style={{ borderRight: '1px solid #fff' }}>
                            <img src='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/thong_ke1.png?1705898809027' alt=''/>
                            <div className='' style={{ marginLeft: '8px' }}>
                                <h4 className='m-0'>8+</h4>
                                <p className='m-0'>Cửa hàng</p>
                            </div>
                        </div>
                        <div className='col-md-3 text-white d-flex align-items-center justify-content-center' style={{ borderRight: '1px solid #fff' }}>
                            <img src='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/thong_ke2.png?1705898809027' alt=''/>
                            <div className='' style={{ marginLeft: '8px' }}>
                                <h4 className='m-0'>200+</h4>
                                <p className='m-0'>Nhân viên</p>
                            </div>
                        </div>
                        <div className='col-md-3 text-white d-flex align-items-center justify-content-center' style={{ borderRight: '1px solid #fff' }}>
                            <img src='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/thong_ke3.png?1705898809027' alt=''/>
                            <div className='' style={{ marginLeft: '8px' }}>
                                <h4 className='m-0'>5000+</h4>
                                <p className='m-0'>Khách hàng</p>
                            </div>
                        </div>
                        <div className='col-md-3 text-white d-flex align-items-center justify-content-center'>
                            <img src='https://bizweb.dktcdn.net/100/469/097/themes/882205/assets/thong_ke4.png?1705898809027' alt=''/>
                            <div className='' style={{ marginLeft: '8px' }}>
                                <h4 className='m-0'>50+</h4>
                                <p className='m-0'>Món ăn</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            {/* tin tức */}
            <div className='container-fluid pt-4' id='tintuc' style={{ background: '#143b36' }}>
                <div className='container pb-5'>
                    <Title
                        title='Tin tức'>
                    </Title>
                    <div className='row mt-3'>
                        <div className='col-md-4'>
                            <NewFrame
                                title='Mách bạn công thức làm canh cá nấu mẻ thơm ngon đậm vị'
                                imgSrc='https://bizweb.dktcdn.net/100/469/097/articles/canh-ca-nau-me-2-7edb.jpg?v=1666608800047'
                                text='Canh cá nấu mẻ là món ăn dân dã,...'></NewFrame>
                        </div>
                        <div className='col-md-4'>
                            <NewFrame
                                title='Tuyển tập 8 món sào đơn giản, tiết kiệm thời gian'
                                imgSrc='https://bizweb.dktcdn.net/100/469/097/articles/dua-xao-long-me-ga-3b27.jpg?v=1666608739950'
                                text='Cùng bếp nhà Dola khám phá công thức làm 8 món sào đơn giản....'></NewFrame>
                        </div>
                        <div className='col-md-4'>
                            <NewFrame
                                title='Hé lộ chìa khóa vàng giúp thiết lập được công thức nấu ăn ngon'
                                imgSrc='https://bizweb.dktcdn.net/100/469/097/articles/kheo-leo-co-meo-nau-an-de-co-bua.jpg?v=1666608663653'
                                text='Mâm cơm ngon miệng và đầy đủ dinh dưỡng...'></NewFrame>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home