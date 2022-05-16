

function errHandler(err){
    switch(err.name){

        case 'JsonWebTokenError':
            return {
                name: err.name,
                errCode: 1, 
                message: 'Invalid Authentication Token',
                status: 401
            }


        case 'AuthenticationFailUserNotFound':
            return {
                name: err.name,
                errCode: 2,
                message: 'Authentication Fail: User not found',
                status: 401
            }


        case 'AuthorizationUserFail':
            return {
                name: err.name,
                errCode: 3,
                message: 'Authorization Fail: User not authorized',
                status: 403
            }


        case 'loginFieldEmpty':
            return {
                name: err.name,
                errCode: 4,
                message: 'Username or Password cannot be empty',
                status: 400
            }

        case 'invalidUserusername':
            return {
                name: err.name,
                errCode: 5,
                message: 'Invalid password or username',
                status: 404
            }
        case 'SyntaxError':
            return {
                name: err.name,
                errCode: 6,
                message: 'Invalid Authentication Token',
                status: 401
            }

        case 'registerFieldEmpty':
            return {
                name: err.name,
                errCode: 7,
                message: 'Username or Role cannot be empty',
                status: 400
            }
        
        case 'registerUsernameLength':
            return {
                name: err.name,
                errCode: 8,
                message: 'Username length must be at least 4 characters',
                status: 400
            }

        case 'registerUsernameExist':
            return {
                name: err.name,
                errCode: 9,
                message: 'Username already exist',
                status: 400
            }

        default:
            return {
                name: err.name,
                errCode: 'Global',
                message: {
                    default: "Internal Server Error",
                    typeError: err.message
                },
                status: 500
            }

    }
}

module.exports = errHandler