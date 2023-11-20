var signup = () => {
    window.location.assign("../Pages/Register.html")
}

const Email = document.getElementById("email")
const Password = document.getElementById("password")
const Message = document.getElementById("message")

const login = () => {
    if (Email.value === "") {
        Message.innerHTML = "Email address is required."
        Message.style.color = "red"
    }
    else if (Password.value === "") {
        Message.innerHTML = "Password is required."
        Message.style.color = "red"
    }
    else {
        const userData = {
            Email: Email.value,
            Password: Password.value
        };
        firebase.auth().signInWithEmailAndPassword(userData.Email, userData.Password).then((userCredential) => {
            Message.innerHTML = "Login Success!"
            Message.style.color = "green"
            if (userCredential.user.emailVerified) {
                window.location.assign("../Pages/home.html")
            }
            else {
                window.location.assign("../Pages/emailVerification.html")
            }
        })
            .catch((error) => {
                //Message.innerHTML = error.message;
                Message.innerHTML = "your id or password is not correct."
                Message.style = "red"
            });
    }

}
const ForgetPassword = () => {
    window.location.assign("../Pages/ForgetPassword.html")
}