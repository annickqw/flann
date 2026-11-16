
(() => {

  /* SETTINGS */

  const colors = [
    "#FF00A8", // Pink
    "#0047FF", // Blue
    "#E8FF00", // Yellow
    "#00FF85"  // Green
  ];

  const speed = 300;

  /* FAVICON */

  const favicon = document.getElementById("favicon");
  const image = new Image();

  if (!favicon) {
    console.error("Favicon element not found");
    return;
  }

  image.onload = () => {

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let index = 0;

    function updateFavicon() {

      const size = canvas.width;

      ctx.clearRect(0, 0, size, size);
      ctx.globalCompositeOperation = "source-over";

      const ratio = Math.min(
        size / image.naturalWidth,
        size / image.naturalHeight
      );

      const width = image.naturalWidth * ratio;
      const height = image.naturalHeight * ratio;

      ctx.drawImage(
        image,
        (size - width) / 2,
        (size - height) / 2,
        width,
        height
      );

      // Color the visible pixels of the SVG
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = colors[index];
      ctx.fillRect(0, 0, size, size);

      ctx.globalCompositeOperation = "source-over";

      // Update favicon
      favicon.href = canvas.toDataURL("image/png");
      favicon.type = "image/png";

      index = (index + 1) % colors.length;
    }

    updateFavicon();

    setInterval(updateFavicon, speed);
  };

  image.onerror = () => {
    console.error("Could not load images/vector.svg");
  };

  image.src = "images/vector.svg";

})();
