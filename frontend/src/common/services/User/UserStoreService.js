let _instance = null;

class UserStoreService {
    constructor() {
        if (_instance) {
            return _instance;
        }

        _instance = this;
        this.initialize();
    }

    initialize() {
        this.userInfo = null;
        this.shoppingCart = [];
    }

    setUser(userInfo) {
        this.userInfo = userInfo;
    }

    getUser() {
        return this.userInfo;
    }
    setUserLevel(level) {
        this.level = level;
    }
    getUserLevel() {
        return this.level;
    }
    isLoggedin() {
        return this.level === 1;
    }
    setToken(token){
        this.token = token;
    }
    getToken(token){
        return this.token;
    }
    setUserId(userid){
        this.userid = userid;
    }
    getUserId(userid){
        return this.userid;
    }
    setUserName(name){
        this.name = name;
    }
    getUserName(name){
        return this.name;
    }
    setUserEmail(email){
        this.email = email;
    }
    getUserEmail(email){
        return this.email;
    }







    addShoppingCartInfo(additem) {
        this.shoppingCart.push(additem);
    }
    getShoppingCart() {
        return this.shoppingCart;
    }
    setShoppingCart(itemList) {
        this.shoppingCart = itemList;
    }
    setTotalPrice(price) {
        this.price = price;
    }
    getTotalPrice() {
        return this.price;
    }
    setTotalWeight(weight) {
        this.weight = weight;
    }
    getTotalWeight() {
        return this.weight;
    }
    setWareHouseId(wareHouseId) {
        this.wareHouseId = wareHouseId;
    }
    getWareHouseId() {
        return this.wareHouseId;
    }
    setItemId(itemId) {
        this.itemId = itemId;
    }
    getItemId() {
        return this.itemId;
    }
    setQuantities(quantities) {
        this.quantities = quantities;
    }
    getQuantities() {
        return this.quantities;
    }
    isOver() {
        return this.price >= 100;
    }
    isUnder() {
        return this.price < 100;
    }
    isUnderWeight(){
        return this.weight < 15;
    }
    isOverWeight(){
        return this.weight >= 15;
    }
    setAllItem(allItem){
        this.allItem = allItem;
    }
    getAllItem(allItem){
        return this.allItem;
    }
    addAllItem(item) {
        this.allItem.push(item);
    }



}

export default new UserStoreService();

