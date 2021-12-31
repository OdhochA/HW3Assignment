const identifiers = {
    class: {
      mode: "mode",
      selected: "selected",
      square: "square",
    },
    id: {
      colorDisplay: "color-display",
      r: "r",
      g: "g",
      b: "b",
      reset: "reset",
    },
  };
  
  const rElement = document.getElementById(identifiers.id.r);
  const gElement = document.getElementById(identifiers.id.g);
  const bElement = document.getElementById(identifiers.id.b);
  
  const levels = Array.from(
    document.getElementsByClassName(identifiers.class.mode)
  );
  
  
  let gameLevel = levels.find((level) => {
    const classList = [...level.classList];
    return classList.includes(identifiers.class.selected);
  }).innerHTML;
  
  let squares = getSquares(gameLevel);
  
  
  levels.forEach((level) => {
    level.addEventListener("click", function () {
      levels.forEach((mode) => mode.classList.remove(identifiers.class.selected));
      this.classList.add(identifiers.class.selected);
  
      gameLevel = this.innerHTML;
      squares = getSquares(gameLevel);
    });
  });
  
  // event handler for the RESET button, when clicked it will...
  // 1) generate new color values for each of the squares and set them.
  // 2) get a random rgb color from the ones generated and set it in the header.
  document
    .getElementById(identifiers.id.reset)
    .addEventListener("click", function () {
      const rgbValues = [];
  
      squares.forEach((square) => {
        const values = rgbGenerator();
        setBackGroundColor(square, values);
        rgbValues.push(values);
      });
  
      // change the text
      this.innerHTML = "New Colors";
  
      // pick a random RGB color from the values generated for the squares
      const randomIndex = Math.floor(Math.random() * squares.length); // genRandInt
      const [hr, hg, hb] = rgbValues[randomIndex];
      setHeaderRgbBackgroundImages(hr, hg, hb);
    });
  
  // set up event handler for each of the squares
  // when clicked it will either be hidden if wrong guess or
  // set the background color of all other squares to the winning color
  squares.forEach((square) => {
    square.addEventListener("click", function () {
      const headerRgb = [rElement, gElement, bElement].map((e) => {
        const [r, g, b] = getRgbValues(e);
        return r || g || b;
      });
  
      const squareRgb = getRgbValues(square);
      if (arrayEqual(headerRgb, squareRgb)) {
        const [hr, hg, hb] = headerRgb;
        const bkColor = mkBackGroundColor(hr, hg, hb);
        setBackGroundColorsAfterWin(bkColor);
      } else {
        square.classList.add("hidden");
      }
    });
  });
  
  function setBackGroundColorsAfterWin(backGroundColor) {
    squares.forEach((sq) => {
      sq.style.backgroundColor = backGroundColor;
      sq.classList.remove("hidden");
    });
  }
  
  function arrayEqual(first, second) {
    if (first.length === second.length) {
      const reducer = (prev, current, index) => {
        return prev && current === second[index];
      };
      return first.reduce(reducer, true);
    }
    return false;
  }
  
  function getRgbValues(element) {
    const rgbValues = element.dataset.rgbValues;
    return JSON.parse(rgbValues);
  }
  
  // Returns a function which returns a list of three r, g, b values when invoked.
  function rgbGenerator() {
    const generateRgbValues = () => {
      // genRgbInt
      const rgb = () => Math.floor(Math.random() * 256);
      return [rgb(), rgb(), rgb()];
    };
  
    // In hard mode, we generate radom values every time.
    return generateRgbValues();
  }
  
  function setBackGroundColor(e, rgbValues) {
    const [r, b, g] = rgbValues;
    e.style.backgroundColor = mkBackGroundColor(r, b, g);
    e.dataset.rgbValues = JSON.stringify(rgbValues);
  }
  
  function mkBackGroundColor(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // sets numeric color values in the header as well as the background colors (image)
  function setHeaderRgbBackgroundImages(r, g, b) {
    const setElementValues = (element, red, green, blue) => {
      setBackGroundColor(element, [red, green, blue]);
      element.innerHTML = red || green || blue;
    };
  
    setElementValues(rElement, r, 0, 0);
    setElementValues(gElement, 0, g, 0);
    setElementValues(bElement, 0, 0, b);
  }
  
  function getSquares(level) {
    const tiles = Array.from(
      document.getElementsByClassName(identifiers.class.square)
    );
  
    tiles.forEach((sq) => sq.classList.remove("hidden"));
  
    if (level === "Easy") {
      const hiddenSquares = tiles.slice(3, tiles.length);
      const squares = tiles.slice(0, 3);
  
      hiddenSquares.forEach((sq) => sq.classList.add("hidden"));
  
      return squares;
    }
  
    return tiles;
  }