let postValue = document.getElementById("textarea");
let progressdiv = document.getElementById("progressdiv");
let progressbar = document.getElementById("progressbar");
let currentUser= "";
let url = "";
let fileType = "";
let done = document.getElementById("done");
let uid;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            setTimeout(() => {
                uid = user.uid;
            }, 1000)
        } else {
            setTimeout(() => {
                window.location.assign("../Pages/emailVerification.html");
            }, 1000)
        }
    } else {
        setTimeout(() => {
            window.location.assign("../Pages/Login.html");
        }, 1000)
    }
});

firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
});

let uploadimg = (event) => {
    fileType = event.target.files[0].fileType;
    var uploadTask = firebase
    .storage()
    .ref()
    .child(`posts/${event.target.files[0].name}`)
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
        url = downloadURL;
        done.style.display = "block";
        progressdiv.style.display = "none";
        });
    }
    );
};

// store the data on firestore

var d = new Date().toLocaleDateString();
function createPost(){
    if(postValue !== "" || url !== ""){
        firebase.firestore().collection("posts").add({
            postValue:postValue.ariaValueMax,
            uid: currentUser.uid,
            url:url,
            fileType: fileType,
            like: "",
            dislike: "",
            comment: "",
            Date: `${d}`
        }).then((res)=>{
            firebase.firestore().collection("posts/").doc(res.id).update({
                id:res.id
            }).then(()=>{
                done.style.display = none;
                document.getElementById("uploadmessage").style.display = "block";
                setTimeout(()=> {
                    location.reload();
                },2000)
            })
        })
    }
}