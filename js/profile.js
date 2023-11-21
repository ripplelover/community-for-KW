let userprofileimg = document.getElementById("userprofileimg")
let usercoverimg = document.getElementById("usercoverimg")
let progressdiv = document.getElementById("progressdiv")
let progressbar = document.getElementById("progressbar")

let fileType = "";
let uid;
let updateurl;
let allUsers = []


let changeCoverImage = (event) => {
    var uploadTask = firebase
    .storage()
    .ref()
    .child(`users/${uid}/coverpicture`)
    .put(event.target.files[0]);

    uploadTask.on('state_changed', 
    (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        var uploadpercentage = Math.round(progress);
        progressdiv.style.display = "block";
        progressbar.style.width = `${uploadpercentage}%`;
        progressbar.innerHTML = `${uploadpercentage}%`;
    }, 
    (error) => {
        // Handle unsuccessful uploads
    }, 
    () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            progressdiv.style.display = "none";
            firebase.firestore().collection("users/").doc(uid).update({
                CoverPicture: downloadURL
            })
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
        var uploadpercentage = Math.round(progress);
        progressdiv.style.display = "block";
        progressbar.style.width = `${uploadpercentage}%`;
        progressbar.innerHTML = `${uploadpercentage}%`;
    }, 
    (error) => {
        // Handle unsuccessful uploads
    }, 
    () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            progressdiv.style.display = "none"; // some issue int progress thats why it is not shown we will check it out upcoming videos
            firebase.firestore().collection("users/").doc(uid).update({
                ProfilePicture: downloadURL
            })
        });
    }
    );
};


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            uid = user.uid;
            // Show the image in website
            firebase.firestore().collection()("users/").onSnapshot((result)=>{
                result.forEach((user)=>{
                    allUsers.push(user.data())
                    fileType = user.data.fileType;
                    if(user.data().uid === user.uid) {
                        if(user.data().ProfilePicture !== "" || user.data().CoverPicture !== "") {
                            userprofileimg.setAttribute("src", user.data().ProfilePicture || "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png")
                            usercoverimg.setAttribute("src", user.data().CoverPicture || "https://c.wallhere.com/photos/3f/04/person_silhouette_bench_evening_decline_sky-741824.jpg!d")
                        }
                    }
                })
            })
        } else {
                window.location.assign("../Pages/emailVerification.html");
        }
    } else {
            window.location.assign("../Pages/Login.html");
    }
});
