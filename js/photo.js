const monthsarray = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
const detailButtons = ["zoomin", "up", "zoomout", "block", "blocks", "left", "down", "right", "inwards", "outwards"]
var currentMonth = 0;
var saturation = 100;
var brightness = 100;
var contrast = 100;
var fotos = [];
var image = id("imageHolder");
var moving = false;

function id(id) { return document.getElementById(id); }
function cls(cls) { return document.getElementsByClassName(cls); }

const sliders = [
    id("contrast"),
    id("saturation"),
    id("brightness")
];

function init() {
    for (let i = 0; i < 3; i++) {
        sliders[i].addEventListener("change", function () {
            imageHandler();
        });
        sliders[i].addEventListener("dblclick", function () {
            sliders[i].value = 100;
            imageHandler();
        });
    }

    // Make a JSON object containing all 12 months
    for (let i = 0; i < 12; i++) {
        fotos.push({
            "maxDays": new Date("2024", i + 1, 0).getDate(), // 2024 is a leap year
            "files": "",
            "titleColor": "#ffffff",
            "textColor": "#000000",
            "lineHeight": 0.67,
            "format": 1,
            "size": 100,
            "width": 15,
            "height": 10,
            "offsetX": 0,
            "offsetY": 0,
            "contrast": 100,
            "saturation": 100,
            "brightness": 100
        });
        btn = document.createElement("button");
        btn.innerText = monthsarray[i];
        btn.id = monthsarray[i];
        btn.className = "months"
        btn.addEventListener("click", function () {
            changeMonth(i)
        });
        id("month").appendChild(btn);
    }

    // Basic functionality for the 'small' details buttons
    for (let i = 0; i < 10; i++) {
        btn = document.createElement("button");
        btn.id = detailButtons[i];
        if (detailButtons[i] != "") { btn.style.backgroundImage = "url('img/" + detailButtons[i] + ".png')"; }
        btn.addEventListener("click", function () {
            changeImage(detailButtons[i]);
        });
        id("detail").appendChild(btn);
    }
}

function changeImage(type) {
    img = id("imageHolder");
    txt = cls("dayHolder");
    curr = fotos[currentMonth];
    switch (type) {
        case "zoomin":
            curr.size += 1;
            img.style.backgroundSize = curr.size + "%";
            break;
        case "zoomout":
            curr.size -= 1;
            img.style.backgroundSize = curr.size + "%";
            break;
        case "left":
            curr.offsetX -= 2;
            img.style.backgroundPositionX = curr.offsetX + "px";
            break;
        case "up":
            curr.offsetY -= 2;
            img.style.backgroundPositionY = curr.offsetY + "px";
            break;
        case "right":
            curr.offsetX += 2;
            img.style.backgroundPositionX = curr.offsetX + "px";
            break;
        case "down":
            curr.offsetY += 2;
            img.style.backgroundPositionY = curr.offsetY + "px";
            break;
        case "block":
            curr.format = 0;
            formatText();
            break;
        case "blocks":
            curr.format = 1;
            formatText();
            break;
        case "inwards":
            curr.lineHeight += 0.07;
            for (let i = 0; i < txt.length; i++) { txt[i].style.lineHeight = curr.lineHeight; }
            break;
        case "outwards":
            curr.lineHeight -= 0.07;
            for (let i = 0; i < txt.length; i++) { txt[i].style.lineHeight = curr.lineHeight; }
            break;
    }
}

function changeMonth(month) {
    currentMonth = month;
    curr = fotos[month];
    if (cls("selected").length > 0) {
        cls("selected")[0].classList.toggle("selected");
    }
    id("width").value = curr.width;
    id("height").value = curr.height;
    cls("months")[month].classList.toggle("selected");
    imgHolder = id("imageHolder");
    pic = id("picture");
    imgHolder.style.width = curr.width + "cm";
    imgHolder.style.height = curr.height + "cm";
    picture.style.width = curr.width + "cm";
    picture.style.height = curr.height + "cm";
    id("title").value = curr.titleColor;
    id("tekst").value = curr.textColor;
    sliders[0].value = curr.contrast;
    sliders[1].value = curr.saturation;
    sliders[2].value = curr.brightness;

    img = id("imageHolder").style;
    img.backgroundSize = curr.size + "%";
    img.backgroundPositionX = curr.offsetX + "px";
    img.backgroundPositionY = curr.offsetY + "px";

    fileFormatter(curr);
    formatText();
    changeColor();
    imageSize();
    imageHandler();
}

function formatText() {
    curr = fotos[currentMonth];
    id("text").innerHTML = "<span id='name'>" + monthsarray[currentMonth] + "</span>";
    if (curr.format == 0) {
        str = document.createElement("p"); str.className = "dayHolder long"; str.style.lineHeight = curr.lineHeight;
        for (let i = 1; i <= curr.maxDays; i++) {
            str.innerHTML += i + "."
            str.innerHTML += "<span class='line'></span>"
        }
        id("text").appendChild(str);
    } else {
        str1 = document.createElement("p"); str1.className = "dayHolder"; str1.style.lineHeight = curr.lineHeight;
        str2 = document.createElement("p"); str2.className = "dayHolder"; str2.style.lineHeight = curr.lineHeight;
        for (let i = 1; i <= curr.maxDays; i++) {
            if (i <= (curr.maxDays - parseInt(curr.maxDays / 2))) {
                str = i + "."
                str += "<span class='line'></span>"
                str1.innerHTML += str
            } else {
                str = i + ".";
                str += "<span class='line'></span>"
                str2.innerHTML += str
            }
        }
        if (curr.maxDays / 30 != 1) { str2.innerHTML += "<br><br><br>" }
        id("text").appendChild(str1);
        id("text").appendChild(str2);
    }
}

function fileFormatter(dddd) {
    preview = id("month")
    if (!dddd.files) { image.style.backgroundImage = "url(http://placekitten.com/600/400)"; }
    for (let i = 0; i < dddd.files.length; i++) {
        const file = dddd.files[i];

        if (!file.type.startsWith('image/')) { continue }

        const reader = new FileReader();
        reader.onload = (function (aImg) { return function (e) { aImg.style.backgroundImage = "url(" + e.target.result + ")"; }; })(image);
        reader.readAsDataURL(file);
        fotos[currentMonth].files = dddd.files;
    }
}

function imageHandler() {
    contrast = sliders[0].value;
    saturation = sliders[1].value;
    brightness = sliders[2].value;
    fotos[currentMonth].contrast = contrast;
    fotos[currentMonth].saturation = saturation;
    fotos[currentMonth].brightness = brightness;
    id("imageHolder").style.filter = "contrast(" + contrast + "%) saturate(" + saturation + "%) brightness(" + brightness + "%)";
}

function imageSize() {
    w = id("width").value;
    h = id("height").value;
    if (w >= 0 && w < 22 && h >= 0 && h < 22) {
        k = fotos[currentMonth];
        k.width = w;
        k.height = h;
        imgHolder = id("imageHolder").style;
        pic = id("picture").style;
        imgHolder.width = w + "cm";
        imgHolder.height = h + "cm";
        pic.width = w + "cm";
        pic.height = h + "cm";
        for (let i = 0; i < cls("dayHolder").length; i++) { cls("dayHolder")[i].style.lineHeight = curr.lineHeight; }
    }
}

function changeColor() {
    dayHolder = cls("dayHolder");
    spn = cls("line");
    id("name").style.color = id("title").value;
    for (let i = 0; i < dayHolder.length; i++) { dayHolder[i].style.color = id("tekst").value; }
    for (let i = 0; i < spn.length; i++) { spn[i].style.backgroundColor = id("tekst").value; }
    fotos[currentMonth].titleColor = id("title").value
    fotos[currentMonth].textColor = id("tekst").value
}

function printToPage() {
    document.body.innerHTML = "";
    document.body.style.width = "210mm";
    for (let i = 0; i < 12; i++) {
        let f = fotos[i]
        let a4 = document.createElement("div");
        a4.className = "a4"
        a4.style.width = f.width + "cm";
        a4.style.height = f.height + "cm";
        if (f.files[0]) {
            var img = document.createElement("div");
            img.className="tmpimg";
            img.style.backgroundPosition = f.offsetX + " " + f.offsetY;
            img.style.backgroundSize = f.size + "%";
            img.style.filter = "contrast(" + f.contrast + "%) saturate(" + f.saturation + "%) brightness(" + f.brightness + "%)";
            const reader = new FileReader();
            reader.onload = (function (aImg) { return function (e) { aImg.style.backgroundImage = "url(" + e.target.result + ")"; }; })(img);
            reader.readAsDataURL(f.files[0]);
            a4.appendChild(img);
        }

        var txt = document.createElement("div")
        txt.id = "text"
        txt.innerHTML = "<span id='name'>" + monthsarray[i] + "</span>";
        txt.style.color = f.titleColor;
        if (f.format == 0) {
            str = document.createElement("p"); str.className = "dayHolder long"; str.style.lineHeight = f.lineHeight; str.style.color = f.textColor;
            for (let i = 1; i <= f.maxDays; i++) {
                str.innerHTML += i + "."
                str.innerHTML += "<span class='line' style=background-color:"+f.textColor+"></span>"
            }
            txt.appendChild(str);
        } else {
            str1 = document.createElement("p"); str1.className = "dayHolder"; str1.style.lineHeight = f.lineHeight; str1.style.color = f.textColor;
            str2 = document.createElement("p"); str2.className = "dayHolder"; str2.style.lineHeight = f.lineHeight; str2.style.color = f.textColor;
            for (let i = 1; i <= f.maxDays; i++) {
                if (i <= (f.maxDays - parseInt(f.maxDays / 2))) {
                    str = i + "."
                    str += "<span class='line' style='background-color:"+f.textColor+"'></span>"
                    str1.innerHTML += str
                } else {
                    str = i + ".";
                    str += "<span class='line' style='background-color:"+f.textColor+"'></span>"
                    str2.innerHTML += str
                }
            }
            if (f.maxDays / 30 != 1) { str2.innerHTML += "<br><br><br>" }
            txt.appendChild(str1);
            txt.appendChild(str2);
        }
        a4.appendChild(txt);
        document.body.appendChild(a4);
    }
    setTimeout(function () { window.print() }, 2000);
}

init();
changeMonth(0);