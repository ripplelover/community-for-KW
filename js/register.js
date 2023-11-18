var login = () => {
    window.location.assign("../Pages/Login.html")
}

const FirstName = document.getElementById("first_name")
const LastName = document.getElementById("last_name")
const Email = document.getElementById("email")
const Password = document.getElementById("password")
const ConfirmPassword = document.getElementById("confirm_password")
const Message = document.getElementById("message")
const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const signup = () => {
    if(FirstName.value === "" || LastName.value === "" || Email.value === "" || Password.value === "" || ConfirmPassword.value === "") {
        Message.innerHTML = "Please fill all the fields."
        Message.style.color = "red"
    }
    else if(!Email.value.match(regex)) {
        Message.innerHTML = "Invalid email address."
        Message.style.color = "red"
    }
    else if(!Email.value.endsWith("@kw.ac.kr")) {
        Message.innerHTML = "Only kw university email addresses are allowed."
        Message.style.color = "red"
    }
    else if(Password.value.length < 8) {
        Message.innerHTML = "Password must be at least 8 characters."
        Message.style.color = "red"
    }
    else if(Password.value !== ConfirmPassword.value) {
        Message.innerHTML = "Password and Confirm Password do not match."
        Message.style.color = "red"
    }
    else {
        Message.innerHTML = "Account successfully created."
        Message.style.color = "green"
        const userData = {
            firstName: FirstName.value,
            lastName: LastName.value,
            email: Email.value,
            password: Password.value,
            confirmPassword: ConfirmPassword.value
        }
        console.log(userData)
    }
}

