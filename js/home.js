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
                            users.data().firstName + users.data().lastName + ` 님, 검색어를 입력해 주세요.`)
                        if (users.data().ProfilePicture !== "") {
                            userimg.setAttribute("src", users.data().ProfilePicture)
                        }
                    }
                })
            })
        }
        else { window.location.assign("../Pages/emailVerification.html") }
    }
    else { window.location.assign("../Pages/Login.html") }
});

var loading = document.getElementById("loaderdiv")
var showposts = document.getElementById("showposts")

firebase.firestore().collection("posts/").onSnapshot((result) => {
    loading.style.display = "none";
    let allposts = [];
    if (result.size === 0) {
        let nodata = document.getElementById("h1")
        nodata.style.display = "block"
    } else {
        result.forEach((post) => {
            allposts.push(post.data())
        });
        showposts.style.display = "block"
        showposts.innerHTML = ""
        for (let i = 0; i < allposts.length; i++) {

            let likearray = allposts[i].like
            let displayarray = allposts[i].dislike
            let commentarray = allposts[i].comments
            let postmain = document.createElement("div");
            showposts.appendChild(postmain);
            postmain.setAttribute("class", "postmain");

            //post header
            let postheader = document.createElement("div");
            postmain.appendChild(postheader);
            postheader.setAttribute("class", "postheader");

            //user data
            firebase.firestore().collection("users/").doc(allposts[i].uid).get().then((res) => {

                let userprodev = document.createElement("div");

                let userprofileimg = document.createElement("img");

                postheader.appendChild(userprodev);
                userprodev.setAttribute("class", "userprodev");
                userprodev.appendChild(userprofileimg);
                userprofileimg.setAttribute("src", res.data().ProfilePicture === "" ? "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png" :
                    res.data().ProfilePicture
                );

                userprofileimg.setAttribute("class", "profileimage");
                let userdiv = document.createElement("div");
                userprodev.appendChild(userdiv);

                userdiv.setAttribute("class", "userdiv");

                let username = document.createElement("h6");
                userdiv.appendChild(username);
                username.innerHTML = `${res.data().firstName} ${res.data().lastName}`

                let date = document.createElement("h6");
                userdiv.appendChild(date);
                date.innerHTML = `${allposts[i].Date}`;
                //여기까지 확인.
                let postdetail = document.createElement("p");
                postheader.appendChild(postdetail); //변수명 수정.
                postdetail.innerHTML = allposts[i].postvalue;

                //postdetail.setAttribute("class", "postdetail")

                if (allposts[i].url !== "") {
                    if (allposts[i].fileType === "image/png"
                        || allposts[i].fileType === "image/jpg"
                        || allposts[i].fileType === "image/jpeg") {
                        //images
                        let postimage = document.createElement("img");
                        postmain.appendChild(postimage);
                        postimage.setAttribute("src", allposts[i].url);
                        postimage.setAttribute("class", "postimage col-12")
                    } else {
                        //videos
                        let postvideo = document.createElement("video")
                        postmain.appendChild(postvideo)
                        postvideo.setAttribute("controls", true)
                        postvideo.setAttribute("class", "postvideo")
                        let source = document.createElement("source")
                        postvideo.appendChild(source)
                        source.setAttribute("src", allposts[i].url)
                        source.setAttribute("Type", "video/mp4")
                    }
                }

            })
        }
    }
})