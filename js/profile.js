let userprofileimg = document.getElementById("userprofileimg");
let usercoverimg = document.getElementById("usercoverimg");
let progressbar1 = document.getElementById("progressbar");
let progressbardiv = document.getElementById("progressbardiv");

let fileType = "";
let uid;
let updateurl;
let allUsers = [];


let changeCoverImage = (event) => {
    var uploadTask = firebase
        .storage()
        .ref()
        .child(`users/${uid}/coverpicture`)
        .put(event.target.files[0]);

    uploadTask.on('state_changed',
        (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressbardiv.style.visibility = "visible";
            var uploadpercentage = Math.round(progress);
            progressbar.style.width = `${uploadpercentage}%`;
            progressbar.innerHTML = `${uploadpercentage}%`;
        },
        (error) => { },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((coverpicture) => {
                progressbardiv.style.visibility = "hidden";
                firebase
                    .firestore()
                    .collection("users/")
                    .doc(uid)
                    .update({ CoverPicture: coverpicture });
            });
        }
    );
};


let changeProfileImage = (event) => {
    var uploadTask = firebase
        .storage()
        .ref()
        .child(`users/${uid}/profilepicture`)
        .put(event.target.files[0]);

    uploadTask.on('state_changed',
        (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressbardiv.style.visibility = "visible";
            var uploadpercentage = Math.round(progress);
            progressbar1.style.width = `${uploadpercentage}%`;
            progressbar1.innerHTML = `${uploadpercentage}%`;
        },
        (error) => { },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((profileimage) => {
                progressbardiv.style.visibility = "hidden";
                firebase
                    .firestore()
                    .collection("users/")
                    .doc(uid)
                    .update({ ProfilePicture: profileimage });
            });
        }
    );
};


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            uid = user.uid;

            // Show the image in website
            firebase
                .firestore()
                .collection("users/").
                onSnapshot((result) => {
                    result.forEach((users) => {
                        allUsers.push(users.data());
                        fileType = users.data().fileType;
                        if (users.data().uid === user.uid) {
                            if (users.data().ProfilePicture !== "" || users.data().CoverPicture !== "") {
                                userprofileimg.setAttribute("src", users.data().ProfilePicture || "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png")
                                usercoverimg.setAttribute("src", users.data().CoverPicture || "https://c.wallhere.com/photos/3f/04/person_silhouette_bench_evening_decline_sky-741824.jpg!d")
                            }
                        }
                    });
                });
        } else {
            window.location.assign("../Pages/emailVerification.html");
        }
    } else {
        window.location.assign("../Pages/Login.html");
    }
});


const logout = () => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            window.location.assign("../Pages/Login.html");
        });
};