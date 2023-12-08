let uid;
let allusers = [];
let fileType = ""

let userimg = document.getElementById("userimage")
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            uid = user.uid;
            var createpostinput = document.getElementById("a")
            firebase.firestore().collection("users/").onSnapshot((result) => {
                result.forEach((users) => {
                    allusers.push(users.data())
                    fileType = users.data().fileType

                    if (users.data().uid === user.uid) {
                        createpostinput.setAttribute("placeholder",
                            `${users.data().FirstName + " " + users.data().LastName} 님, 검색어를 입력해 주세요.`)
                        if (users.data().ProfilePicture !== "") {
                            userimg.setAttribute("src", users.data().ProfilePicture)
                        }
                    }
                })
            })
        } else {
            window.location.assign("../Pages/emailVerification.html")
        }
    }
    else {
        window.location.assign("../Pages/Login.html")
    }
});