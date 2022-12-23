import checkIcon from "./assets/checkMarkWhite.svg";
import pdf from "./assets/coding_dojo_certificate.pdf#toolbar=1&navpanes=0&scrollbar=0";
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
    pdfElement.src = pdf;
    resumeDiv.prepend(pdfElement);
    const canvas = document.getElementsByTagName("canvas")[0];
    const overlay = document.getElementById("overlay");
    overlay.style.display = 'block';
    resumeBtn.addEventListener("click", () => {
        resumeDiv.style.display = "flex";
        canvas.style.opacity = 0.2;
        overlay.style.opacity = 0.2;
    });
    document.getElementById("close").addEventListener("click", () => {
        resumeDiv.style.display = "none";
        overlay.style.opacity = 1;
        canvas.style.opacity = 1;
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
}

const addApps = () => {
    const apps = {
        "JS":
            [{
                name: "MERN Chat app",
                link: "https://message.tonyavis.com",
            }, {
                name: "js game",
                link: "https://jsgame.tonyavis.com",
            }],
        "Java spring":
            [{
                name: "To-Do app",
                link: "https://todo.tonyavis.com",
            }],
        "Python flask":
            [{
                name: "charity app",
                link: "https://planet.tonyavis.com",
            }, {
                name: "credit app",
                link: "https://credit.tonyavis.com",
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
            console.log('here')
            const innerDiv = document.createElement('div')
            innerDiv.classList.add('innerDiv')
            for (const appsInFrameWork of apps[framework]) {
                const link = document.createElement('a')
                link.href = appsInFrameWork['link']
                link.setAttribute("target", "_blank")
                link.setAttribute("ref", "noopener noreferrer")
                link.textContent += appsInFrameWork['name']
                innerDiv.append(link)
            }
            div.append(innerDiv)
        } else {
            const link = document.createElement('a')
            link.href = apps[framework][0]['link']
            link.setAttribute("target", "_blank")
            link.setAttribute("ref", "noopener noreferrer")
            link.textContent += apps[framework][0]['name']
            div.append(link)
        }
        project_container.append(div)
    }
    const p = document.createElement('p')
    p.classList.add('overlay__p')
    p.innerText += 'my projects where build with many different libraries, bundlers and frameworks if your curious contact me!'
    project_container.append(p)
}
//  <div class="one_app">
    // <p>Mern-stack</p>
    // <pre>|</pre>
    // <a target="_blank" rel="noopener noreferrer" href="#">Chat app</a>
// </div>

// TODO when make the two_app for when a framework has more then one a