let postvalue = document.getElementById("textarea");
var progressDiv = document.getElementById("progressdiv");
var progressbar = document.getElementById("progressbar");
let currentuser = "";
let url = "";
let fileType = "";
var done = document.getElementById("done");
let uid;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {      
            uid = user.uid;
        } else {    
            window.location.assign("../Pages/emailVerification.html");
        }
    } else {
        window.location.assign("../Pages/Login.html");
    }
});


firebase.auth().onAuthStateChanged((user) => {
    currentuser = user;
});

let uploadimg = (event) => {
    fileType = event.target.files[0].type;
    var uploadfile = firebase
    .storage()
    .ref()
    .child(`postFiles/${event.target.files[0].name}`)
    .put(event.target.files[0]);
    uploadfile.on(
        "state_changed",
        (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            var uploadpercentage = Math.round(progress);
            console.log(uploadpercentage);
            progressDiv.style.display = "block";
            progressbar.style.width = `${uploadpercentage}%`;
            progressbar.innerHTML = `${uploadpercentage}%`;
        },
        (error) => { },
        () => {
            uploadfile.snapshot.ref.getDownloadURL().then((downloadURL) => {
            url = downloadURL;
            done.style.display = "block";
            progressDiv.style.display = "none";
        });
    }
    );
};
var d = new Date().toLocaleDateString();

// store the data on firestore

function createPost() {
    if (postvalue.value !== "" || url !== "") {
        firebase
        .firestore()
        .collection("posts")
        .add({
        postvalue: postvalue.value,
        uid: currentuser.uid,
        url: url,
        filetype: fileType,
        like: [],
        dislikes: [],
        comments: [],
        Date: `${d}`
        })
        .then((res) => {
            firebase
            .firestore()
            .collection("posts/")
            .doc(res.id)
            .update({
                id: res.id
            })
            .then(() => {
                done.style.display = "none"
                document.getElementById("uploadmessage").style.display = "block";
                setTimeout(() => {
                location.reload();
                }, 2000);
            });
        });
    }
}

const logout = ()=>{
    firebase.auth().signOut().then(() => {
        window.location.assign("../Pages/login.js")
    })
}