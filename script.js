const winWidth = $(window).width();
const ratio = winWidth / 1920;
const fontSize = {
  small: 12,
  medium: 14,
};
const played = [];
const vara = [];
const bodyFontSize = Math.max(16 * ratio, 10);
const posX = Math.max(80 * ratio, 30);
$("body").css("font-size", bodyFontSize + "px");
fontSize.small = Math.max(fontSize.small * ratio, 7);
fontSize.medium = Math.max(fontSize.medium * ratio, 10);

const pages = document.getElementById("pages");
const styles = document.createElement("style");

// 208 max letters

const data = [
  {
    date: "15 Jan 2019",
    txt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetu",
    continuation: false,
  },
  {
    txt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    continuation: true,
  },
  {
    date: "16 Jan 2019",
    txt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    continuation: false,
  },
  {
    date: "17 Jan 2019",
    txt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    continuation: false,
  },
  {
    date: "18 Jan 2019",
    txt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    continuation: false,
  },
  {
    date: "19 Jan 2019",
    txt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    continuation: false,
  },
  {
    date: "20 Jan 2019",
    txt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    continuation: false,
  },
  {
    date: "20 Jan 2019",
    txt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
    continuation: false,
  },
];

const lastIndex = data.length - 1;
const totalPages = data.length + 2;
let currentPage = 0;

function htmlCss(isFirst, isLast) {
  let page = "";
  let style = "";

  if (isFirst) {
    style = `.book .paper.first {
              z-index: ${totalPages};
            }
            .book .paper.first .front {
              transform: translateZ(${totalPages}px);
            }`;
  }

  page += `<div class="page-${currentPage} paper">
            <div class="page ${isLast ? "last" : ""} front contents">
              <div id="vara-container${currentPage}"></div>
            </div>
            <div class="page back"></div>
           </div>`;

  style += `.book .paper.page-${currentPage} {
              z-index: ${totalPages - currentPage};
            }
            .book .paper.page-${currentPage} .front {
              transform: translateZ(${totalPages - currentPage}px);
            }
            ${
              !isLast
                ? `.book .open.page-${currentPage} .back {
              transform: translateZ(-${currentPage}px);
              }`
                : ""
            }
  `;

  if (isLast) {
    page += `<div class="side"></div>
              <div class="bottom"></div>
            <div class="shadow"></div>`;
  }

  styles.innerHTML += style;
  pages.innerHTML += page;
}

data.forEach((_, index) => {
  currentPage += 1;
  htmlCss(index === 0, index === lastIndex);
});

document.head.appendChild(styles);

data.forEach((val, index) => {
  const arr = [
    {
      text: val.txt,
      y: 20,
      x: posX,
      duration: val.txt.length > 100 ? 6000 : 3000,
    },
  ];
  const datObj = {
    text: val.date,
    textAlign: "right",
    delay: 500,
    y: 20,
    x: -30,
    duration: 1000,
    fontSize: fontSize.small,
  };
  if (!val.continuation) arr.unshift(datObj);

  vara.push(
    new Vara(
      `#vara-container${index + 1}`,
      "https://rawcdn.githack.com/akzhy/Vara/ed6ab92fdf196596266ae76867c415fa659eb348/fonts/Satisfy/SatisfySL.json",
      arr,
      {
        strokeWidth: 2,
        fontSize: fontSize.medium,
        autoAnimation: false,
      }
    )
  );
  played.push(0);
});

vara[lastIndex].ready(function () {
  $(".front:not(.last)").click(function () {
    var ix = $(this).parent(".paper").index();
    $(".book").addClass("open");
    $(this).parent(".paper").addClass("open");
    if (!played[ix]) {
      vara[ix].playAll();
      vara[ix].animationEnd(function (i, o) {
        played[ix] = 1;
        if (i == "link") {
          var group = o.container;
          var rect = vara[lastIndex].createNode("rect", {
            x: 0,
            y: 0,
            width: o.container.getBoundingClientRect().width,
            height: o.container.getBoundingClientRect().height,
            fill: "transparent",
          });
          group.appendChild(rect);
          $(rect).css("cursor", "pointer");
          $(rect).click(function () {
            console.log(true);
            document.querySelector("#link").click();
          });
        }
      });
    }
  });
  $(".back").click(function () {
    if ($(this).parent(".paper").index() == 0) $(".book").removeClass("open");
    $(this).parent(".paper").removeClass("open");
  });
});
