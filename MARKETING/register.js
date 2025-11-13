function showAlert() {
  document.getElementById("alertOverlay").style.display = "flex";
}

function redirectToSignin() {
  document.getElementById("alertOverlay").style.display = "none";

  window.location.href = "signin.html";
}
