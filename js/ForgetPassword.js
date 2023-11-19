var back = () => {
    window.location.assign("../Pages/Login.html")
};

let email = document.getElementById("email")
let Message = document.getElementById("message")


const reset = () => {
    if (email.value === "") {
        Message.innerHTML = "Email Address is required."
        Message.style.color = "red"
        email.focus()
    }
    firebase.auth().sendPasswordResetEmail(email.value)
        .then(() => {
            Message.innerHTML = "password reset link has been send on your email, check your email please."
            Message.style.color = "green"
            //alert("password reset link has been send on your email")
            //window.location.assign("../Pages/emailVerification.html")

        })
        .catch((error) => {
            //var errorMessage = error.message;
            Message.innerHTML = error.message;
            Message.style.color = "red"

        });
}