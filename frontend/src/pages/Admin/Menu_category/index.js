import React, { useEffect, useState } from "react";
import menu_categoryApi from "../../../api/menu_categoryApi";
import CreateForm from "./create";
import EditForm from "./edit";

function Menu_category() {
    const [Menu_categorys, setMenu_categorys] = useState([]);
    const [isShowFormCreate, setisShowFormCreate] = useState(false);
    const [isShowFormEdit, setisShowFormEdit] = useState(null);

    useEffect(() => {
        GetMenu_categorys();
    }, []);

    function GetMenu_categorys() {
        menu_categoryApi
            .getAll()
            .then((response) => {
                setMenu_categorys(response.data);
            })
            .catch((error) => {
                console.error("Có lỗi:", error);
            });
    }

    function Deletetable(id) {
        if (window.confirm("Bạn có chắc muốn xóa nhóm này không?")) {
            menu_categoryApi
                .delete(id)
                .then(() => {
                    alert("Xóa nhóm thành công");
                    GetMenu_categorys();
                })
                .catch((error) => {
                    console.error("Có lỗi:", error);
                });
        }
    }

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <button
                    className="btn btn-primary"
                    onClick={() => setisShowFormCreate(true)}
                >
                    <i className="fa fa-plus"></i> Thêm
                </button>

                {isShowFormCreate && (
                    <CreateForm
                        setisShowFormCreate={setisShowFormCreate}
                        GetMenu_categorys={GetMenu_categorys}
                    />
                )}
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>Tên nhóm món ăn</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {Menu_categorys.map((menu_category) => (
                        <tr key={menu_category.CategoryID}>
                            <td>{menu_category.CategoryName}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => setisShowFormEdit(menu_category)}
                                >
                                    Sửa
                                </button>

                                {isShowFormEdit?.CategoryID ===
                                    menu_category.CategoryID && (
                                        <EditForm
                                            setisShowFormEdit={setisShowFormEdit}
                                            GetMenu_categorys={GetMenu_categorys}
                                            data={menu_category}
                                            id={menu_category.CategoryID}
                                        />
                                    )}

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                        Deletetable(menu_category.CategoryID)
                                    }
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Menu_category;
