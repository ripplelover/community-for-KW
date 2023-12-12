const FirstName = document.getElementById("first_name")
const LastName = document.getElementById("last_name")
const Hakbun = document.getElementById("hakbun")
const Major = document.getElementById("major")
const Email = document.getElementById("user_email")
const Signdate = document.getElementById("signdate")

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Firestore에서 사용자 문서를 가져오기
        firebase.firestore().collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {

                // HTML 요소에 사용자 정보 표시
                var userData = doc.data();
                Email.innerHTML = "Email: " + userData.email;
                FirstName.innerHTML = "First Name: " + userData.firstName;
                LastName.innerHTML = "Last Name: " + userData.lastName;
                Major.innerHTML = "Major: " + userData.major;
                Hakbun.innerHTML = "Student Number: " + userData.학번;
                Signdate.innerHTML = "Sign-up date: " + userData.Signupdate;
            } else {
                console.log("사용자 문서가 존재하지 않습니다.");
            }
        }).catch((error) => {
            console.log("사용자 문서 가져오기 오류:", error);
        });
    } else {
        window.location.assign("../Pages/Login.html");
    }
});
