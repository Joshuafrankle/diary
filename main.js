const winWidth = window.innerWidth;
const ratio = winWidth / 1920;
const fontSize = {
  small: 12,
  medium: 14,
};
const played = [0, 0, 0];
const vara = [];
const bodyFontSize = Math.max(16 * ratio, 10);
const posX = Math.max(80 * ratio, 30);
document.body.style.setProperty("font-size", bodyFontSize + "px");
fontSize.small = Math.max(fontSize.small * ratio, 7);
fontSize.medium = Math.max(fontSize.medium * ratio, 10);

const style = document.createElement("style");
const pages = document.getElementById("pages");

const data = [
  {
    date: "15 Jan 2019",
    txt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere odio corporis, beatae praesentium commodi unde voluptatibus! Libero impedit excepturi est culpa sunt? Recusandae iste delectus at sit repudiandae esse totam.",
  },
  {
    date: "16 Jan 2019",
    txt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere odio corporis, beatae praesentium commodi unde voluptatibus! Libero impedit excepturi est culpa sunt? Recusandae iste delectus at sit repudiandae esse totam.",
  },
  {
    date: "17 Jan 2019",
    txt: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere odio corporis, beatae praesentium commodi unde voluptatibus! Libero impedit excepturi est culpa sunt? Recusandae iste delectus at sit repudiandae esse totam.",
  },
];

const maxLetters = 226;
const lastIndex = data.length - 1;
let isLoading = true;
let totalPages = 1;
let currentPage = 0;

function shorten(str, separator = " ") {
  return str.substring(0, str.lastIndexOf(separator, maxLetters));
}

function generateTxt(item, continuation = false) {
  vara[currentPage - 1] = new Vara(
    `#vara-container${currentPage}`,
    "https://rawcdn.githack.com/akzhy/Vara/ed6ab92fdf196596266ae76867c415fa659eb348/fonts/Satisfy/SatisfySL.json",
    [
      !continuation && {
        text: item.date,
        textAlign: "right",
        y: 20,
        x: -30,
        delay: 500,
        duration: 1500,
        fontSize: fontSize.small,
      },
      {
        text: item.txt,
        y: 40,
        x: posX,
        duration: 4000,
      },
    ],
    {
      strokeWidth: 2,
      fontSize: fontSize.medium,
      autoAnimation: false,
    }
  );
}

function htmlCss(islast = false) {
  const page = `<div class="page-${currentPage} paper">
  <div class="page ${islast && "last"} front contents">
    <div id="vara-container${currentPage}"></div>
  </div>
  <div class="page back"></div>
</div>`;

  const styles = `.book .paper.page-${currentPage} {
  z-index: ${totalPages - currentPage};
}.book .paper.page-${currentPage} .front {
  transform: translateZ(0.${totalPages - currentPage}px);
}
${
  !islast &&
  `.book .open.page-${currentPage} .back {
    transform: translateZ(-${currentPage}px);
  }`
}
`;
  style.innerHTML += styles;
  pages.innerHTML += page;
}

function subText(item, index) {
  let continuation = false;

  function f(itemm) {
    if (itemm.txt.length > maxLetters) {
      const newItem = { ...itemm, txt: shorten(itemm.txt) };
      currentPage += 1;
      htmlCss();
      generateTxt(newItem, continuation);
      continuation = true;
      f(newItem);
    } else {
      currentPage += 1;
      htmlCss(index === lastIndex);
      generateTxt(itemm, continuation);
    }
  }

  f(item);
}

function calTotalPages(item) {
  if (item.txt.length > maxLetters) {
    totalPages += 1;
    const newItem = { ...item, txt: shorten(item.txt) };
    calTotalPages(newItem);
  } else {
    totalPages += 1;
  }
}

function main() {
  data.forEach((value) => {
    calTotalPages(value);
  });

  data.forEach((value, index) => {
    subText(value, index);
  });

  style.innerHTML += `.book .paper.first {
      z-index: ${totalPages};
    }.book .paper.first .front {
      transform: translateZ(0.${totalPages}px);
    }`;
  pages.innerHTML += `<div class="side"></div>
    <div class="bottom"></div>
    <div class="shadow"></div>`;

  document.head.appendChild(style);
}

main();

console.log(vara);

vara[currentPage - 1].ready(function () {
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
          var rect = vara[currentPage - 1].createNode("rect", {
            x: 0,
            y: 0,
            width: o.container.getBoundingClientRect().width,
            height: o.container.getBoundingClientRect().height,
            fill: "transparent",
          });
          group.appendChild(rect);
          $(rect).css("cursor", "pointer");
          $(rect).click(function () {
            // console.log(true);
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
