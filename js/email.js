let Email = document.getElementById("emailid");
let Message = document.getElementById("message");

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        //console.log(user);
        if (user.emailVerified) {
            window.location.assign("../Pages/home.html");
        } else {
            Email.innerHTML = user.Email;
        }
    } else {
        window.location.assign("../Pages/Login.html");
    }
});


const resend = () => {
    firebase.auth().currentUser.sendEmailVerification().then(() => {
        Message.innerHTML = "A verification link has been send to your email account";
        Message.style.color = "green";
        Message.style.marginBottom = "15px";
    });
};

const reloud = () => {
    location.reload();
};