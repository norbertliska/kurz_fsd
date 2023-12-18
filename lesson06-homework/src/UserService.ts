/** simulujeme service */

export interface IUser {
    id:number;
    username: string;
    password: string;
    fullName: string;
    address: string;    
}

class UserService {
    protected users:IUser[] = [];

    constructor() {
        this.users = [
            { id:1, username: "user1", password: "pwd1", fullName: "User1 User1", address:"USA"},
            { id:2, username: "user2", password: "pwd2", fullName: "User2 User2", address: "EU" },
            { id:3, username: "user3", password: "pwd3", fullName: "User3 User3", address: "Africa"  },
            { id:4, username: "user4", password: "pwd4", fullName: "User4 User4", address: "Germany" }
        ]        
    }


    // returns null if not found or password match
    getByNameAndPassword(n:string, p:string):IUser {
        n = n.toLowerCase();
        const _this = userService; // trochu krepo, neviem ako to v JS inak spravne spravit
        for (var i in _this.users) {
            const u = _this.users[i];
            if (u.username.toLowerCase() === n && u.password === p) return u;
        }
        return null;
    }

    // returns null if not found
    private  getById(id:number):IUser  {
        for (var i in this.users) {
            const u = this.users[i];
            if (u.id === id) return u;
        }
        return null;
    }
}

// jedna jedina instancia

export var userService = new UserService();



