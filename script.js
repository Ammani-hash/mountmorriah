const scrollHeight = document.body.scrollHeight;
const halfHeight = scrollHeight / 2;

window.addEventListener("scroll", () => {
  if (window.scrollY >= halfHeight) {
    window.scrollTo({
      top: 1,
      behavior: "instant"
    });
  }

  if (window.scrollY <= 0) {
    window.scrollTo({
      top: halfHeight - 1,
      behavior: "instant"
    });
  }
});
