const FirstName = document.getElementById("first_name");
const LastName = document.getElementById("last_name");
const Hakbun = document.getElementById("hakbun");
const Major = document.getElementById("major");
const Password = document.getElementById("password");
const ConfirmPassword = document.getElementById("confirm_password");
const Message = document.getElementById("message");
// const Reauth_message = document.getElementById("reauth_message");
const currentPasswordInput = document.getElementById("current_password");
const Email_read = document.getElementById("user_email");

// 현재 로그인한 사용자 가져오기
let user = firebase.auth().currentUser;

// 사용자 상태 변경 감지
firebase.auth().onAuthStateChanged((currentUser) => {
    user = currentUser; // 현재 사용자 업데이트

    if (user) {
        // Firestore에서 사용자 문서를 가져오기
        firebase.firestore().collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                // HTML 요소에 사용자 정보 표시
                var userData = doc.data();
                Email_read.innerHTML = userData.email;
                Email_read.style.color = "#404aaa";
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

// 재인증 함수
const reauthenticate = (email, currentPassword) => {
    const credential = firebase.auth.EmailAuthProvider.credential(email, currentPassword);
    return user.reauthenticateWithCredential(credential);
};

// 사용자 정보 변경 함수
const changeinfo = () => {
    // 입력 필드 검증
    if (FirstName.value === "" || LastName.value === "" || Password.value === "" || ConfirmPassword.value === "") {
        Message.textContent = "Please fill all the fields.";
        Message.style.color = "red";
        return;
    } else if (Password.value.length < 8) {
        Message.textContent = "Password must be at least 8 characters.";
        Message.style.color = "red";
        return;
    } else if (Password.value !== ConfirmPassword.value) {
        Message.textContent = "Password and Confirm Password do not match.";
        Message.style.color = "red";
        return;
    }

    // 현재 패스워드 입력
    const currentPassword = currentPasswordInput.value;

    // 사용자 재인증 및 비밀번호 변경
    if (user) {
        reauthenticate(user.email, currentPassword).then(() => {
            // 재인증 성공 후 비밀번호 변경
            user.updatePassword(Password.value).then(() => {
                // Firestore 사용자 문서 업데이트
                const userData = {
                    firstName: FirstName.value,
                    lastName: LastName.value,
                    학번: Hakbun.value,
                    major: Major.value,
                };
                firebase.firestore().collection("users").doc(user.uid).update(userData).then(() => {
                    Message.textContent = "Account successfully changed.";
                    Message.style.color = "green";
                }).catch((error) => {
                    Message.textContent = error.message;
                    Message.style.color = "red";
                });
            }).catch((error) => {
                Message.textContent = error.message;
                Message.style.color = "red";
            });
        }).catch((error) => {
            Message.textContent = error.message;
            Message.style.color = "red";
        });
    } else {
        // Message.textContent = "Please enter the current password.";
        // Message.style.color = "red";
        window.location.assign("../Pages/Login.html");
    }
};