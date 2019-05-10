class UserService {
    constructor() {
        this.endpoint = 'http://localhost:3006'
    }

    userLogin(postBody) {
        let url = this.endpoint + '/login';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Sorry the password and username do not match');
            }
            return resp.json();
        });
    }
    userRegister(postBody) {
        let url = this.endpoint + '/register';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('User already exists');
            }
            return resp.json();
        });
    }
    getAll() {
        let url = this.endpoint + '/getAll';
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            console.log(resp)
            return resp.json();
        });
    }
    getItem(postBody) {
        let url = this.endpoint + '/getItem';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            console.log(resp)
            return resp.json();
        });
    }
    getShipAddress(postBody) {
        let url = this.endpoint + '/getShipAddress';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Please Log in');
            }
            return resp.json();
        });
    }
    markDelivered(postBody) {
        let url = this.endpoint + '/markDelivered';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Sorry, update status failed');
            }
            return resp.json();
        });
    }
    checkAvailable(postBody) {
        let url = this.endpoint + '/checkAvailable';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Sorry, some items are Out Of Stock/Please Log in');
            }
            return resp.json();
        });
    }
    getOrderHistory(postBody) {
        let url = this.endpoint + '/getOrderHistory';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Cannot get order history');
            }
            return resp.json();
        });
    }
    getOrderHistoryDetail(postBody) {
        let url = this.endpoint + '/getOrderHistoryDetail';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Cannot get order history');
            }
            return resp.json();
        });
    }
    submitOrder(postBody) {
    let url = this.endpoint + '/submitOrder';
    return fetch(url, {
        method: 'POST',
        body: postBody,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((resp) => {
        if (!resp.ok) {
            throw Error('Cannot get orders');
        }
        return resp.json();
        });
    }
    addItem(postBody) {
        let url = this.endpoint + '/addItem';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Cannot Add Item/Please Login');
            }
            return resp.json();
        });
    }
    deleteItem(postBody) {
        let url = this.endpoint + '/deleteItem';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Cannot Delete Item/Please Login');
            }
            return resp.json();
        });
    }
    addShoppingCart(postBody) {
        let url = this.endpoint + '/addShoppingCart';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Cannot add to Shopping Cart/Please log in');
            }
            return resp.json();
        });
    }
    getShoppingCart(postBody) {
        let url = this.endpoint + '/getShoppingCart';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Nothing in Shopping Cart/Please log in');
            }
            return resp.json();
        });
    }
    deleteShoppingCart(postBody) {
        let url = this.endpoint + '/deleteShoppingCart';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Cannot delete item');
            }
            return resp.json();
        });
    }
    deleteWholeShoppingCart(postBody) {
        let url = this.endpoint + '/deleteWholeShoppingCart';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Cannot delete whole item');
            }
            return resp.json();
        });
    }
    editShoppingCart(postBody) {
        let url = this.endpoint + '/editShoppingCart';
        return fetch(url, {
            method: 'POST',
            body: postBody,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((resp) => {
            if (!resp.ok) {
                throw Error('Cannot edit quantity of the item');
            }
            return resp.json();
        });
    }

}

export default new UserService();
