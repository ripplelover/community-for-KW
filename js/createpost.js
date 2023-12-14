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
    (error) => {},
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
  let timestamp = new Date().getTime().toString();
  console.log(timestamp);
  if (postvalue.value !== "" || url !== "") {
    // 시간 함수 사용해서 시간의 값으로 정렬을 할 수 있도록 만듬
    // 이때 firestore가 문자열을 읽기 때문에 앞에 'a'를 추가하여 문자열 형태로 변환 하고 이를 documnet 이름으로 지정
    // 도큐멘트의 아이디 값으로 시간을 지정하여 아이디를 확인할 수 있도록 제작
    firebase
      .firestore()
      .collection("posts")
      .doc(timestamp)
      .set({
        postvalue: postvalue.value,
        uid: currentuser.uid,
        url: url,
        filetype: fileType,
        like: [],
        dislikes: [],
        comments: [],
        Date: `${d}`,
        id: `${timestamp}`,
      })
      .then(() => {
        done.style.display = "none";
        document.getElementById("uploadmessage").style.display = "block";
        setTimeout(() => {
          location.reload();
        }, 2000);
      });

    // firebase
    //   .firestore()
    //   .collection("posts")
    //   .add({
    //     postvalue: postvalue.value,
    //     uid: currentuser.uid,
    //     url: url,
    //     filetype: fileType,
    //     like: [],
    //     dislikes: [],
    //     comments: [],
    //     Date: `${d}`,
    //     time: timestamp,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     firebase
    //       .firestore()
    //       .collection("posts/")
    //       .doc(res.id)
    //       .update({
    //         id: res.id,
    //       })
    //       .then(() => {
    //         done.style.display = "none";
    //         document.getElementById("uploadmessage").style.display = "block";
    //         setTimeout(() => {
    //           //   location.reload();
    //         }, 2000);
    //       });
    //   });
  }
}

const logout = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.assign("../Pages/login.js");
    });
};
