var login = () => {
    window.location.assign("../Pages/Login.html")
}

const FirstName = document.getElementById("first_name")
const LastName = document.getElementById("last_name")
const Hakbun = document.getElementById("hakbun")
const Major = document.getElementById("major")
const Email = document.getElementById("email")
const Password = document.getElementById("password")
const ConfirmPassword = document.getElementById("confirm_password")
const Message = document.getElementById("message")
const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const signup = () => {
    if (FirstName.value === "" || LastName.value === "" || Email.value === "" || Password.value === "" || ConfirmPassword.value === "") {
        Message.innerHTML = "Please fill all the fields."
        Message.style.color = "red"
    }
    else if (!Email.value.match(regex)) {
        Message.innerHTML = "Invalid email address."
        Message.style.color = "red"
    }
    else if (!Email.value.endsWith("@kw.ac.kr")) {
        Message.innerHTML = "Only kw university email addresses are allowed."
        Message.style.color = "red"
    }
    else if (Password.value.length < 8) {
        Message.innerHTML = "Password must be at least 8 characters."
        Message.style.color = "red"
    }
    else if (Password.value !== ConfirmPassword.value) {
        Message.innerHTML = "Password and Confirm Password do not match.";
        Message.style.color = "red";
    }
    else {
        firebase.auth().createUserWithEmailAndPassword(Email.value, Password.value).then((userCredential) => {
            var d = new Date().toLocaleDateString();

            var userData = {
                firstName: FirstName.value,
                lastName: LastName.value,
                학번: Hakbun.value,
                major: Major.value,
                email: Email.value,
                password: Password.value,
                confirmPassword: ConfirmPassword.value,
                uid: userCredential.user.uid,
                ProfilePicture: "",
                CoverPicture: "",
                Description: "",
                Signupdate: `${d}`,
            };
            firebase.firestore().collection("users").doc(userCredential.user.uid).set(userData).then((res) => {
                Message.innerHTML = "Account successfully created."
                Message.style.color = "green"

                const user = firebase.auth().currentUser;
                user.sendEmailVerification().then((res) => {
                    setTimeout(() => {
                        window.location.assign("../Pages/emailVerification.html")
                    }, 2000)
                })
            })
            Message.innerHTML = "Sign up successful."
            Message.style.color = "green"
        })
            .catch((error) => {
                Message.innerHTML = error.message;
                Message.style.color = "red";
            });
    }
}
