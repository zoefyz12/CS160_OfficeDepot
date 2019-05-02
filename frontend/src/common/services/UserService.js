let _instance = null;

class UserService {
    constructor() {
        if (_instance) {
            return _instance;
        }
    }

}

export default UserService();
