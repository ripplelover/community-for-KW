firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (user.emailVerified) {
            firebase.firestore().collection("users").onSnapshot((users) => {
            var user = document.getElementById("users");
            document.getElementById("loaderdiv").style.display = "none";

            users.forEach((userdetail)=>{
                var name = userdetail.data().firstName + " " + userdetail.data().lastName;
                var userdetails = document.createElement("div");
                user.appendChild(userdetails);
                userdetails.setAttribute("id", "userdetailsdev");

                var userimgdiv = document.createElement("div");
                userdetails.appendChild(userimgdiv);
                userimgdiv.setAttribute("class", "userimg col-1");

                var userimg = document.createElement("img");
                userimgdiv.appendChild(userimg);
                userimg.setAttribute("src", "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png");
                if (userdetail.data().ProfilePicture !== "") {
                    userimg.setAttribute("src", userdetail.data().ProfilePicture);
                }
                userimg.setAttribute("class", "profilepicture");

                var userdata = document.createElement("div");
                userdetails.appendChild(userdata);
                userdata.setAttribute("id", "data");

                var username = document.createElement("p");
                userdata.appendChild(username);
                username.setAttribute("class", "username");
                username.innerHTML = name;

                var signupdate = document.createElement("p");
                userdata.appendChild(signupdate);
                signupdate.setAttribute("class", "signupdate");
                signupdate.innerHTML = userdetail.data().Signupdate;

                var dropdown = document.createElement("div");
                userdetails.appendChild(dropdown);
                dropdown.setAttribute("id", "dropdown");

                var dropdownshow = document.createElement("i");
                dropdown.appendChild(dropdownshow);
                dropdownshow.setAttribute("class", "fa-solid fa-angle-down dropdownbuttons");
                dropdownshow.setAttribute("id", "dropdownshow");

                var dropdownhide = document.createElement("i");
                dropdown.appendChild(dropdownhide);
                dropdownhide.setAttribute("class", "fa-solid fa-angle-up dropdownbuttons");
                dropdownhide.setAttribute("id", "dropdownhide");

                var userprofilediv = document.createElement("div");
                userdetails.appendChild(userprofilediv);
                userprofilediv.setAttribute("id", "userprofilediv");
                userprofilediv.style.marginBottom = "5px";

                var usercoverimg = document.createElement("img");
                userprofilediv.appendChild(usercoverimg);
                usercoverimg.setAttribute("id", "usercoverimg");
                usercoverimg.setAttribute("class", "col-12");
                usercoverimg.setAttribute("src","https://c.wallhere.com/photos/3f/04/person_silhouette_bench_evening_decline_sky-741824.jpg!d")
                if(userdetail.data().CoverPicture !== ""){
                 usercoverimg.setAttribute("src", userdetail.data().CoverPicture)
                }

                var usernamedetail =document.createElement("p")
                userprofilediv.appendChild(usernamedetail)
                usernamedetail.setAttribute("class","username")

                usernamedetail.innerHTML = (`이름: ` + name);

                var userhakbundetail =document.createElement("p")
                userprofilediv.appendChild(userhakbundetail)
                userhakbundetail.setAttribute("class","userhakbun")
                userhakbundetail.style.fontSize = "15px"

                userhakbundetail.innerHTML = (`학번: ` + userdetail.data().학번);

                var usermajordetail =document.createElement("p")
                userprofilediv.appendChild(usermajordetail)
                usermajordetail.setAttribute("class","usermajor")

                usermajordetail.innerHTML = (`학과: ` + userdetail.data().major);
                // 폰트크기 조절
                usermajordetail.style.fontSize = "15px"


                dropdownshow.addEventListener("click",()=>{
                    dropdownhide.style.display = "block"
                    dropdownshow.style.display ="none"
                    userprofilediv.style.display= "flex"
                   })
        
                   dropdownhide.addEventListener("click",()=>{
                    dropdownhide.style.display = "none"
                    dropdownshow.style.display ="block"
                    userprofilediv.style.display= "none"
                   })


            })
        });

        } else {
                window.location.assign("../Pages/emailVerification.html");
        }
    }
    else {
            window.location.assign("../Pages/Login.html");

    }

});