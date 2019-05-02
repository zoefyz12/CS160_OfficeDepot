import React from 'react';
import './AddItem.css';
import UserStoreService from "../../../common/services/User/UserStoreService";
import userService from "../../../common/services/User/UserService";

const AddItem = (props) => {

    const handleSubmit = (event) => {
        let body = {
            authorization: UserStoreService.getToken(),
            warehouseid: event.target.wareNum.value,
            quantity: parseInt(event.target.itemQuantity.value,10),
            price: event.target.price.value,
            name: event.target.itemName.value,
            weight: event.target.itemWeight.value,
            description: event.target.itemDescription.value,
            category: event.target.itemCategory.value,
            url: event.target.itemPicture.value
        };


        console.log(parseInt(event.target.itemQuantity.value,10),"parse");
        let all = UserStoreService.getAllItem()[UserStoreService.getAllItem().length - 1].itemid;
        let itemNames = [];
        let itemName = "";
        for(let i =0; i < UserStoreService.getAllItem().length; i++){
            itemName = UserStoreService.getAllItem()[i].name;
            itemNames.push(itemName);
        }

        if( !itemNames.includes(event.target.itemName.value) )
        {
            let newItem = {"name" : event.target.itemName.value, "url" : event.target.itemPicture.value, "itemid" : all+1};
            console.log(all,"show the last one Id");
            UserStoreService.addAllItem(newItem);
        }



        console.log(UserStoreService.getAllItem(), "all item");

        userService.addItem(JSON.stringify(body)).then((data) => {
             console.log(data);

            alert('Add/Update Item Successfully!');

            props.closeModal();

          //  this.props.history.push('/manager')

        }).catch((error) => {
           alert(error.message);
        });


        //userService.userLogin(body)
        event.preventDefault();
    };

    return (
        <div>


            <div>
                <h1>Add Item</h1>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="form-group">
                        <label htmlFor="wareNum">Warehouse #<span className="text-danger">*</span></label>
                        <select class = "form-control" type="number" name="wareNum" id="wareNum">
                            <option value = "1">Warehouse 1</option>
                            <option value = "2">Warehouse 2</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="itemQuantity">Quantity<span className="text-danger">*</span></label>
                        <input type="number" name="itemQuantity" required min='1' step='1'
                               placeholder="Enter Quantity" className="form-control" id="itemQuantity"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price<span className="text-danger">*</span></label>
                        <input type="number" step="0.01" name="price" required
                               placeholder="Enter Price" className="form-control" id="price"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="itemName">Name<span className="text-danger">*</span></label>
                        <input type="text" name="itemName" required
                               placeholder="Enter Item Name" className="form-control" id="itemName"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="itemWeight">Weight<span className="text-danger">*</span></label>
                        <input type="number" step="1" name="itemWeight" required
                               placeholder="Enter Item Weight" className="form-control" id="itemWeight"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="itemDescription">Description<span className="text-danger">*</span></label>
                        <input type="text" name="itemDescription" required
                               placeholder="Enter Item Description" className="form-control" id="itemDescription"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="itemCategory">Category<span className="text-danger">*</span></label>
                        <select class = "form-control" name="itemCategory" id="itemCategory">
                            <option value = "electronic">Electronic</option>
                            <option value = "paper">Paper</option>
                            <option value = "office supplies">Office Supplies</option>
                            <option value = "school supplies">School Supplies</option>
                            <option value = "ink & toner">Ink & Toner</option>
                            <option value = "furniture">Furniture</option>
                            <option value = "cleaning">Cleaning</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="itemCategory">Picture<span className="text-danger">*</span></label>
                        <input type="text" name="itemPicture" required
                               placeholder="Enter Item Picture Url" className="form-control" id="itemPicture"/>
                    </div>
                    {/*<div>*/}
                        {/*<label htmlFor="itemPicture">Picture<span className="text-danger">*</span></label>*/}
                        {/*<input type="file" accept="image/*" id="itemPicture"/>*/}
                    {/*</div>*/}
                    <div className="btnCenter">
                    <button
                        className="btn btn-danger"
                    >
                        Add Item
                    </button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default AddItem;