let uid;
let allusers = [];
//let fileType = ""

let userimg = document.getElementById("userimg")
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            uid = user.uid;
            console.log("emailverified true");

            firebase.firestore().collection("users/").onSnapshot((result) => {
                result.forEach((users) => {
                    allusers.push(users.data())
                    filetype = users.data().filetype;

                });
            });
        }
        else { window.location.assign("../Pages/emailVerification.html") }
    }
    else { window.location.assign("../Pages/Login.html") }
});

var loading = document.getElementById("loaderdiv")
var showposts = document.getElementById("showposts")

firebase.firestore().collection("posts/").onSnapshot((result) => {
    firebase.firestore().collection("posts/").where("filetype", "==", "video/mp4").get().then((result) => {
    console.log(result)
    loading.style.display = "none";
    let allposts = [];
    if (result.size === 0) {
        let nodata = document.getElementById("h1")
        nodata.style.display = "block"
    } else {
        result.forEach((post) => {
            allposts.push(post.data())
        });
        showposts.style.display = "block";
        showposts.innerHTML = "";
        for (let i = 0; i < allposts.length; i++) {

            let likearray = allposts[i].like
            let dislikearray = allposts[i].dislikes
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

                let userprodiv = document.createElement("div");

                let userprofileimg = document.createElement("img");

                postheader.appendChild(userprodiv);
                userprodiv.setAttribute("class", "userprodiv");
                userprodiv.appendChild(userprofileimg);
                userprofileimg.setAttribute("src", res.data().ProfilePicture === "" ? "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png" :
                    res.data().ProfilePicture
                );

                userprofileimg.setAttribute("class", "profileimage");
                let userdiv = document.createElement("div");        //userprodev -> userprodiv
                userprodiv.appendChild(userdiv);

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
                postdetail.innerHTML = allposts[i].postvalue; {

                //postdetail.setAttribute("class", "postdetail")

                        let postvideo = document.createElement("video");
                        postmain.appendChild(postvideo);
                        postvideo.setAttribute("controls", "true");
                        postvideo.setAttribute("class", "postvideo")

                        let source = document.createElement("source")
                        postvideo.appendChild(source);
                        source.setAttribute("src", allposts[i].url)
                        source.setAttribute("type", "video/mp4")        //Type-> type 수정
                }

                //footer
                let footerdiv = document.createElement("div");
                postmain.appendChild(footerdiv);
                footerdiv.setAttribute("class", "footerdiv");

                //like button
                var likebutton = document.createElement("button");
                footerdiv.appendChild(likebutton);
                likebutton.setAttribute("class", "likebutton");

                var likeicon = document.createElement("i");
                likebutton.appendChild(likeicon);
                likeicon.setAttribute("class", "fa-solid fa-thumbs-up");

                var liketitle = document.createElement("p");
                likebutton.appendChild(liketitle);
                liketitle.setAttribute("class", "impressionstitle");
                liketitle.innerHTML = `like (${likearray.length})`
                for (let likeIndex = 0; likeIndex < likearray.length; likeIndex++) {
                    if (likearray[likeIndex] === uid) {
                        likeicon.style.color = "blue"
                        liketitle.style.color = "blue"

                    }
                }

                //this is like function
                likebutton.addEventListener("click", () => {
                    let like = false;
                    let dislikeIndex = dislikearray.indexOf(uid);
                
                    if (dislikeIndex !== -1) {
                        // User has already disliked, remove the dislike first
                        dislikearray.splice(dislikeIndex, 1);
                        firebase.firestore().collection("posts/").doc(allposts[i].id).update({
                            dislikes: dislikearray,
                        });
                    }
                
                    for (let likeIndex = 0; likeIndex < likearray.length; likeIndex++) {
                        if (likearray[likeIndex] === uid) {
                            like = true;
                            likearray.splice(likeIndex, 1);
                        }
                    }
                    if (!like) {
                        likearray.push(uid);
                    }
                    firebase.firestore().collection("posts/").doc(allposts[i].id).update({
                        like: likearray,
                    });
                });
                

                //dislike button (same as like button)
                var dislikebutton = document.createElement("button");
                footerdiv.appendChild(dislikebutton);
                dislikebutton.setAttribute("class", "dislikebutton");

                var dislikeicon = document.createElement("i");
                dislikebutton.appendChild(dislikeicon);
                dislikeicon.setAttribute("class", "fa-solid fa-thumbs-down");

                var disliketitle = document.createElement("p");
                dislikebutton.appendChild(disliketitle);
                disliketitle.setAttribute("class", "impressionstitle");
                disliketitle.innerHTML = `dislike (${dislikearray.length})`;
                for (let dislikeIndex = 0; dislikeIndex < dislikearray.length; dislikeIndex++) {
                    if (dislikearray[dislikeIndex] === uid) {
                        dislikeicon.style.color = "blue";
                        disliketitle.style.color = "blue";
                    }
                }
                //dislike button function
                dislikebutton.addEventListener("click", () => {
                    let dislike = false;
                    let likeIndex = likearray.indexOf(uid);
                
                    if (likeIndex !== -1) {
                        // User has already liked, remove the like first
                        likearray.splice(likeIndex, 1);
                        firebase.firestore().collection("posts/").doc(allposts[i].id).update({
                            like: likearray,
                        });
                    }
                
                    for (let dislikeIndex = 0; dislikeIndex < dislikearray.length; dislikeIndex++) {
                        if (dislikearray[dislikeIndex] === uid) {
                            dislike = true;
                            dislikearray.splice(dislikeIndex, 1);
                        }
                    }
                    if (!dislike) {
                        dislikearray.push(uid);
                    }
                    firebase.firestore().collection("posts/").doc(allposts[i].id).update({
                        dislikes: dislikearray,
                    });
                });

                //comment button
                let commentbtn = document.createElement("button");  //let->var
                footerdiv.appendChild(commentbtn);
                commentbtn.setAttribute("class", "commentbtn"); //this code?

                var commenticon = document.createElement("i");
                commentbtn.appendChild(commenticon);
                commenticon.setAttribute("class", "fa-solid fa-message");

                var commentmessage = document.createElement("p");
                commentbtn.appendChild(commentmessage);
                commentmessage.setAttribute("class", "impressionstitle");
                commentmessage.innerHTML = `comment (${commentarray.length})`;
                // comment fuction
                if (commentarray.length !== 0) {
                    for (var commentIndex = 0; commentIndex < commentarray.length; commentIndex++) {

                        let commentmain = document.createElement("div");
                        postmain.appendChild(commentmain);
                        commentmain.setAttribute("class", "commentmain");
                        let commentprofileimage = document.createElement("img");
                        commentmain.appendChild(commentprofileimage);
                        commentprofileimage.setAttribute(
                            "class",
                            "commentprofileimage"
                        );
                        var commentmessage = document.createElement("div");
                        let commentusername = document.createElement("h6");
                        commentmain.appendChild(commentmessage);
                        commentmessage.appendChild(commentusername);
                        //user data
                        firebase.firestore().collection("users").doc(commentarray[commentIndex].uid).get().then((comment) => {//currentuserres->comment
                            commentprofileimage.setAttribute(
                                "src", "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png"
                            );
                            if (comment.data().ProfilePicture !== "") {
                                commentprofileimage.setAttribute(
                                    "src",
                                    comment.data().ProfilePicture
                                );
                            }
                            commentusername.innerHTML = `${comment.data().firstName} ${comment.data().lastName}`;
                        });
                        let commentvalue = document.createElement("p");
                        commentmessage.appendChild(commentvalue);
                        commentvalue.innerHTML = commentarray[commentIndex].commentvalue;
                    }
                }

                let writecomment = document.createElement("div");
                writecomment.setAttribute("class", "writecomment");
                postmain.appendChild(writecomment);
                let commentinput = document.createElement("input");
                writecomment.appendChild(commentinput);
                commentinput.setAttribute("class", "commentinput");
                commentinput.setAttribute("placeholder", "댓글을 작성해주세요.");
                let sendbutton = document.createElement("img");
                writecomment.appendChild(sendbutton);
                sendbutton.setAttribute("src", "https://cdn-icons-png.flaticon.com/512/3682/3682321.png");
                sendbutton.setAttribute("class", "sendbutton");

            // 모든 commentmain 요소들 찾기
            let commentmainElements = document.querySelectorAll(".commentmain");

            // comment button 눌렀을 때 이벤트 리스너 추가
            commentbtn.addEventListener("click", () => {
              // commentmain 요소들의 가시성을 toggle
              commentmainElements.forEach((commentmain) => {
                if (commentmain.style.display === "none") {
                  commentmain.style.display = "flex";
                } else {
                  commentmain.style.display = "none";
                }
              });
            });

                //comment fuction
                sendbutton.addEventListener("click", () => {
                    if (commentinput.value === "") {
                        alert("댓글이 입력되지 않았습니다!");
                    } else {
                        let commentdata = {
                            commentvalue: commentinput.value,
                            uid: uid,
                        };
                        commentarray.push(commentdata);
                        firebase.firestore().collection("posts").doc(allposts[i].id).update({
                            comments: commentarray,
                        });
                    }
                });

            })
        }
    }
    })
})
const logout = () => {
    firebase.auth().signOut().then(() => {
        window.location.assign("./login.js")
    })
}
