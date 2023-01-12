import checkIcon from "./assets/checkMarkWhite.svg";
// import pdf_certificate from "./assets/coding_dojo_certificate.pdf#toolbar=1&navpanes=0&scrollbar=0";
import pdf from "./assets/Tony_Avis_Resume.pdf"
import copyIcon from "./assets/copy-paste-logo.svg";
import Lottie from "lottie-web";
import handgesture from "./assets/hand_gesture.json"
import { isOnMobile } from "./script"
import { link } from "fs";

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
    // const pdfElement = document.createElement("embed");
    // pdfElement.style.height = "100%";
    // pdfElement.style.marginBottom = "1rem";
    // pdfElement.style.width = "100%";
    // pdfElement.src = pdf_certificate;
    const pdfResume = document.createElement("iframe");
    pdfResume.style.height = "100%";
    pdfResume.style.marginBottom = "1rem";
    pdfResume.style.width = "100%";
    pdfResume.src = pdf;
    resumeDiv.prepend(pdfResume);
    // resumeDiv.prepend(pdfElement);
    const canvas = document.getElementsByTagName("canvas")[0];
    const overlay = document.getElementById("overlay");
    overlay.style.display = 'block';
    resumeBtn.addEventListener("click", () => {
        resumeDiv.style.display = "flex";
        if (!isOnMobile) {
            canvas.style.opacity = 0.2;
        }
        overlay.style.opacity = 0.2;
    });
    document.getElementById("close").addEventListener("click", () => {
        resumeDiv.style.display = "none";
        overlay.style.opacity = 1;
        if (!isOnMobile) {
            canvas.style.opacity = 1;
        }
    });
    addApps()
    const handGestureDiv = document.getElementById("handGesture");
    Lottie.loadAnimation({
        container: handGestureDiv,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: handgesture
    })
    handGestureDiv.style.animation = " moveGesture 5s infinite"
    const links = document.querySelector('.sociaL_links')
    links.style.display = "flex"
    if (isOnMobile) {
        links.style.display = "flex"
        links.style.flexDirection = "column"
        links.style.justifyContent = "center"
        links.style.alignItems = "center"
    }
}
const createStarSvg = () => {
    const starSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    starSvg.setAttribute('viewbox', "0 0 95.1 91")
    starSvg.setAttribute('xmlns', "http://www.w3.org/2000/svg")
    starSvg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    polygon.classList.add('starSvg')
    polygon.setAttribute('points', "62.3,30.1 95.1,35.5 70.8,58.2 75.8,91 46.7,75 17,89.8 23.3,57.2 0,33.6 32.9,29.5 48.2,0 ")
    starSvg.append(polygon)
    return starSvg
}
const addApps = () => {
    const apps = {
        "Javascript":
            [{
                name: "MERN | Chat app",
                link: "https://message.tonyavis.com",
                sophistication: 3,
                mobileFriendly: true,
            }, {
                name: "game",
                link: "https://jsgame.tonyavis.com",
                sophistication: 2,
                mobileFriendly: false,
            }],
        "Java spring":
            [{
                name: "To-Do app",
                link: "https://todo.tonyavis.com",
                sophistication: 3,
                mobileFriendly: true,
            }],
        "Python":
            [{
                name: "Flask | charity app",
                link: "https://planet.tonyavis.com",
                sophistication: 2,
                mobileFriendly: true,
            }, {
                name: "Flask | credit app",
                link: "https://credit.tonyavis.com",
                sophistication: 1,
                mobileFriendly: false,
            }
            ],
    }
    const project_container = document.getElementById('project_container')
    for (const framework in apps) {
        const div = document.createElement('div')
        div.classList.add('apps')
        const p = document.createElement('p')
        p.textContent += framework
        const pre = document.createElement('pre')
        pre.textContent += '|'
        div.append(p, pre)
        if (apps[framework].length > 1) {
            const innerDiv = document.createElement('div')
            innerDiv.classList.add('innerDiv')
            for (const appsInFrameWork of apps[framework]) {
                if (isOnMobile && appsInFrameWork.mobileFriendly) {
                    const link = document.createElement('a')
                    link.href = appsInFrameWork['link']
                    link.setAttribute("target", "_blank")
                    link.setAttribute("ref", "noopener noreferrer")
                    link.textContent += appsInFrameWork['name']
                    innerDiv.append(link)
                } else if (!isOnMobile) {
                    const link = document.createElement('a')
                    link.href = appsInFrameWork['link']
                    link.setAttribute("target", "_blank")
                    link.setAttribute("ref", "noopener noreferrer")
                    link.textContent += appsInFrameWork['name']
                    innerDiv.append(link)
                }
            }
            div.append(innerDiv)
        } else {
            if (isOnMobile && apps[framework][0]['mobileFriendly']) {
                const link = document.createElement('a')
                link.href = apps[framework][0]['link']
                link.setAttribute("target", "_blank")
                link.setAttribute("ref", "noopener noreferrer")
                link.textContent += apps[framework][0]['name']
                div.append(link)
            } else if (!isOnMobile) {
                const link = document.createElement('a')
                link.href = apps[framework][0]['link']
                link.setAttribute("target", "_blank")
                link.setAttribute("ref", "noopener noreferrer")
                link.textContent += apps[framework][0]['name']
                div.append(link)
            }
        }
        project_container.append(div)
    }
    const p = document.createElement('p')
    p.classList.add('overlay__p')
    if (isOnMobile) {
        p.innerText += 'you can see all my projects if you visit this site on a computer, my projects where build with many different libraries, bundlers and frameworks if your curious contact me!'
    } else {
        p.innerText += 'my projects where build with many different libraries, bundlers and frameworks if your curious contact me!'
    }
    project_container.append(p)
}
//  <div class="one_app">
    // <p>Mern-stack</p>
    // <pre>|</pre>
    // <a target="_blank" rel="noopener noreferrer" href="#">Chat app</a>
// </div>
