// const img = fetch();

// console.log(img);
import fetch from "node-fetch";
fetch(
  "https://github.com/Jashwanth-k/space-tourism-website/blob/master/assets/crew/background-crew-desktop.jpg"
)
  .then((response) => response.json())
  .then((data) => console.log(data));
