let uid;
let allusers = [];
//let fileType = ""

let userimg = document.getElementById("userimg");
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if (user.emailVerified) {
      uid = user.uid;
      var createpostinput = document.getElementById("a");
      firebase
        .firestore()
        .collection("users/")
        .onSnapshot((result) => {
          result.forEach((users) => {
            allusers.push(users.data());
            filetype = users.data().filetype;

            if (users.data().uid === user.uid) {
              createpostinput.setAttribute(
                "placeholder",
                users.data().firstName +
                  users.data().lastName +
                  ` 님, 반가워요! 새로운 글들을 확인해보세요!`
              );
              if (users.data().ProfilePicture !== "") {
                userimg.setAttribute("src", users.data().ProfilePicture);
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

var loading = document.getElementById("loaderdiv");
var showposts = document.getElementById("showposts");

firebase
  .firestore()
  .collection("posts/")
  .onSnapshot((result) => {
    loading.style.display = "none";
    let allposts = [];
    if (result.size === 0) {
      let nodata = document.getElementById("h1");
      nodata.style.display = "block";
    } else {
      result.forEach((post) => {
        allposts.push(post.data());
      });
      showposts.style.display = "block";
      showposts.innerHTML = "";
      for (let i = 0; i < allposts.length; i++) {
        let likearray = allposts[i].like;
        let dislikearray = allposts[i].dislikes;
        let commentarray = allposts[i].comments;
        let postmain = document.createElement("div");
        showposts.appendChild(postmain);
        postmain.setAttribute("class", "postmain");

        //post header
        let postheader = document.createElement("div");
        postmain.appendChild(postheader);
        postheader.setAttribute("class", "postheader");

        //user data
        firebase
          .firestore()
          .collection("users/")
          .doc(allposts[i].uid)
          .get()
          .then((res) => {
            let userprodiv = document.createElement("div");

            let userprofileimg = document.createElement("img");

            postheader.appendChild(userprodiv);
            userprodiv.setAttribute("class", "userprodiv");
            userprodiv.appendChild(userprofileimg);
            userprofileimg.setAttribute(
              "src",
              res.data().ProfilePicture === ""
                ? "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png"
                : res.data().ProfilePicture
            );

            userprofileimg.setAttribute("class", "profileimage");
            let userdiv = document.createElement("div"); //userprodev -> userprodiv
            userprodiv.appendChild(userdiv);

            userdiv.setAttribute("class", "userdiv");

            let username = document.createElement("h6");
            userdiv.appendChild(username);
            username.innerHTML = `${res.data().firstName} ${
              res.data().lastName
            }`;

            let date = document.createElement("h6");
            userdiv.appendChild(date);
            date.innerHTML = `${allposts[i].Date}`;
            //여기까지 확인.
            let postdetail = document.createElement("p");
            postheader.appendChild(postdetail); //변수명 수정.
            postdetail.innerHTML = allposts[i].postvalue;

            //postdetail.setAttribute("class", "postdetail")

            if (allposts[i].url !== "") {
              if (
                allposts[i].filetype === "image/png" || //fileType->filetype으로 수정(이미지 잘 나오게 됨)
                allposts[i].filetype === "image/jpg" ||
                allposts[i].filetype === "image/jpeg"
              ) {
                //images
                let postimage = document.createElement("img");
                postmain.appendChild(postimage);
                //postimage.setAttribute("src", "");      //코드 추가->삭제할지 고민.
                postimage.setAttribute("src", allposts[i].url);
                postimage.setAttribute("class", "postimage col-12");
              } else {
                //videos
                let postvideo = document.createElement("video");
                postmain.appendChild(postvideo);
                postvideo.setAttribute("controls", "true");
                postvideo.setAttribute("class", "postvideo");

                let source = document.createElement("source");
                postvideo.appendChild(source);
                source.setAttribute("src", allposts[i].url);
                source.setAttribute("type", "video/mp4"); //Type-> type 수정
              }
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
            liketitle.innerHTML = `like (${likearray.length})`;

            for (let likeIndex = 0; likeIndex < likearray.length; likeIndex++) {
              if (likearray[likeIndex] === uid) {
                // 라이크어레이자체가 uid 모음

                // .select의 클래스를 추가하는 식 생성
                likeicon.classList.add("select");
                liketitle.classList.add("select");
              }
            }

            let like = false;
            let dislike = false;

            //this is like function
            likebutton.addEventListener("click", () => {
              // uid = 고유 아이디,

              // 고유아이디가 좋아요와 싫어요에 있다.

              // 만약 싫어요를 눌렀을 때 고유아이디가 좋아요에 있다면 좋아요를 없애고 싫어요로 가자

              for (
                let likeIndex = 0;
                likeIndex < likearray.length;
                likeIndex++
              ) {
                if (likearray[likeIndex] === uid) {
                  like = true;
                  likearray.splice(likeIndex, 1);
                  dislike = true;
                }
              }
              if (!like) {
                likearray.push(uid);

                dislike = true;
              }

              console.log(like);

              firebase
                .firestore()
                .collection("posts/")
                .doc(allposts[i].id)
                .update({
                  like: likearray,
                });

              // 싫어요 로직을 추가
              for (
                let dislikeIndex = 0;
                dislikeIndex < dislikearray.length;
                dislikeIndex++
              ) {
                // 취소시 로직
                if (dislikearray[dislikeIndex] === uid) {
                  dislike = true;
                  dislikearray.splice(dislikeIndex, 1);
                }
              }

              //  추가 로직
              if (!dislike) {
                dislikearray.push(uid);
                like = false;
              }
              firebase
                .firestore()
                .collection("posts/")
                .doc(allposts[i].id)
                .update({
                  dislikes: dislikearray,
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

            for (
              let dislikeIndex = 0;
              dislikeIndex < dislikearray.length;
              dislikeIndex++
            ) {
              if (dislikearray[dislikeIndex] === uid) {
                // .select의 클래스를 추가하는 식 생성
                dislikeicon.classList.add("select");
                disliketitle.classList.add("select");
              }
            }

            //dislike button function

            dislikebutton.addEventListener("click", () => {
              for (
                let dislikeIndex = 0;
                dislikeIndex < dislikearray.length;
                dislikeIndex++
              ) {
                // 취소시 로직
                if (dislikearray[dislikeIndex] === uid) {
                  dislike = true;
                  dislikearray.splice(dislikeIndex, 1);
                  like = true;
                }
              }

              //  추가 로직
              if (!dislike) {
                dislikearray.push(uid);
                like = true;
              }
              firebase
                .firestore()
                .collection("posts/")
                .doc(allposts[i].id)
                .update({
                  dislikes: dislikearray,
                });
              // 좋아요 로직 추가
              for (
                let likeIndex = 0;
                likeIndex < likearray.length;
                likeIndex++
              ) {
                if (likearray[likeIndex] === uid) {
                  like = true;

                  likearray.splice(likeIndex, 1);
                  dislike = false;
                }
              }
              if (!like) {
                likearray.push(uid);

                dislike = true;
              }

              console.log(like);

              firebase
                .firestore()
                .collection("posts/")
                .doc(allposts[i].id)
                .update({
                  like: likearray,
                });
            });

            //comment button
            let commentbtn = document.createElement("button"); //let->var
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
              for (
                var commentIndex = 0;
                commentIndex < commentarray.length;
                commentIndex++
              ) {
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
                firebase
                  .firestore()
                  .collection("users")
                  .doc(commentarray[commentIndex].uid)
                  .get()
                  .then((comment) => {
                    //currentuserres->comment
                    commentprofileimage.setAttribute(
                      "src",
                      "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png"
                    );
                    if (comment.data().ProfilePicture !== "") {
                      commentprofileimage.setAttribute(
                        "src",
                        comment.data().ProfilePicture
                      );
                    }
                    commentusername.innerHTML = `${comment.data().firstName} ${
                      comment.data().lastName
                    }`;
                  });
                let commentvalue = document.createElement("p");
                commentmessage.appendChild(commentvalue);
                commentvalue.innerHTML =
                  commentarray[commentIndex].commentvalue;
                // 삭제 버튼 추가
                let deleteButton = document.createElement("button");
                commentmain.appendChild(deleteButton);
                deleteButton.setAttribute("class", "deleteButton");
                deleteButton.innerHTML = "X";

                // 삭제 버튼 클릭 이벤트 리스너 추가
                deleteButton.addEventListener("click", async (e) => {
                  // Firebase에서 해당 댓글 삭제

                  // 클릭된 삭제 버튼이 속한 댓글 객체를 찾습니다.
                  const clickedComment = commentarray.find(
                    (comment) =>
                      comment.uid === uid &&
                      comment.commentvalue ===
                        e.target.previousSibling.childNodes[1].innerHTML
                  );

                  if (clickedComment) {
                    // 로컬 배열에서 댓글을 제거합니다.
                    commentarray = commentarray.filter(
                      (comment) => comment !== clickedComment
                    );

                    // Firebase 데이터베이스를 업데이트합니다.
                    await firebase
                      .firestore()
                      .collection("posts")
                      .doc(allposts[i].id)
                      .update({
                        comments: commentarray,
                      });

                    // 해당 댓글을 표시하고 있는 HTML 요소를 제거합니다.
                    commentmain.remove();
                  } else {
                    console.log("클릭된 댓글을 찾을 수 없습니다.");
                  }
                });
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
            sendbutton.setAttribute(
              "src",
              "https://cdn-icons-png.flaticon.com/512/3682/3682321.png"
            );
            sendbutton.setAttribute("class", "sendbutton");

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
                firebase
                  .firestore()
                  .collection("posts")
                  .doc(allposts[i].id)
                  .update({
                    comments: commentarray,
                  });
              }
            });
          });
      }
    }
  });
const logout = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.assign("./login.js");
    });
};
