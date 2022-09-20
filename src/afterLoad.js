import checkIcon from "./assets/checkMarkWhite.svg";
import pdf from "./assets/resume.pdf";
import copyIcon from "./assets/copy-paste-logo.svg";
import Lottie from "lottie-web";
import handgesture from "./assets/hand_gesture.json"

export default () => {
    const copyEmail = document.querySelector(".email_two");
    copyEmail.addEventListener("click", () => {
        copyEmail.children[0].src = checkIcon;
        console.log("Copied");
        navigator.clipboard.writeText("ttavis1999@gmail.com");
        setTimeout(() => (copyEmail.children[0].src = copyIcon), 3000);
    });
    const resumeBtn = document.getElementById("resume");
    document.getElementById("download").setAttribute("href", pdf);

    const resumeDiv = document.querySelector(".show_resume");
    const pdfElement = document.createElement("embed");
    pdfElement.style.height = "100%";
    pdfElement.style.marginBottom = "1rem";
    pdfElement.style.width = "100%";
    pdfElement.src = pdf + "#toolbar";
    resumeDiv.prepend(pdfElement);
    const canvas = document.getElementsByTagName("canvas")[0];
    const overlay = document.getElementById("overlay");
    overlay.style.display = 'block';
    resumeBtn.addEventListener("click", () => {
        console.log("resume clicked");
        resumeDiv.style.display = "flex";
        canvas.style.opacity = 0.2;
        overlay.style.opacity = 0.2;
    });
    document.getElementById("close").addEventListener("click", () => {
        resumeDiv.style.display = "none";
        overlay.style.opacity = 1;
        canvas.style.opacity = 1;
    });
    const handGestureDiv = document.getElementById("handGesture");
    Lottie.loadAnimation({
        container: handGestureDiv,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: handgesture
    })
    handGestureDiv.style.animation = " moveGesture 5s infinite"
}