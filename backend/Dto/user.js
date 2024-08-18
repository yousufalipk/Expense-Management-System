class userDto {
    constructor(user){
        this._id = user._id, 
        this.username = `${user.fname} ${user.lname}`, 
        this.email = user.email
    }
}

module.exports = userDto;