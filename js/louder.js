firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            setTimeout(() => {
                window.location.assign("../Pages/home.html")
            }, 1000)
        } else {
            setTimeout(() => {
                window.location.assign("../Pages/emailVerification.html")
            }, 1000)
        }
    }
    else {
        setTimeout(() => {
            window.location.assign("../Pages/Login.html")
        }, 1000)

    }

});