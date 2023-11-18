var signup = () => {
    window.location.assign("../Pages/Register.html")
}

const Email = document.getElementById("email")
const Password = document.getElementById("password")
const Message = document.getElementById("message")

const login = () => {
    if(Email.value === "" || Password.value === "") {
        Message.innerHTML = "Please fill all the fields."
        Message.style.color = "red"
    }
    else {
        Message.innerHTML = "Login successful."
        Message.style.color = "green"
        const userData = {
            email: Email.value,
            password: Password.value
        }
        console.log(userData)
    }

}
