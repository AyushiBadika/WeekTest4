const videoPlayerBtn = document.querySelector(".play-pause");
const videoPlayer = document.querySelector(".videoPlayer");
const searchBtn = document.querySelector(".searchBtn");
const search = document.querySelector(".search");
const products = document.querySelector(".products");
let productArray = [];
let isFirst = true;

videoPlayerBtn.addEventListener("click", (e) => {
  if (videoPlayer.paused) {
    videoPlayer.play();
    videoPlayerBtn.innerHTML =
      '<i class="fa-solid fa-pause" style="color: #00000072;"></i>';
  } else {
    videoPlayer.pause();
    videoPlayerBtn.innerHTML =
      '<i class="fa-solid fa-play" style="color: #00000072;"></i>';
  }
});

searchfn("apple");

function searchfn(val) {
  fetch(`https://openapi.programming-hero.com/api/phones?search=${val}`)
    .then((res) => res.json())
    .then((result) => {
      productArray = result.data;
      creatingCards(productArray);
    });
}

let limit = 12;
function creatingCards(productArray) {
  products.innerHTML = "";
  if (productArray.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.innerHTML = `No Product for '${search.value}'`;
    products.append(emptyDiv);
    search.value = "";
  } else {
    productArray.forEach((product, index) => {
      if (index < limit) {
        const productImage = product.image;
        const productName = product.phone_name;
        const individualProduct = document.createElement("div");
        const imageCon = document.createElement("img");
        imageCon.style.marginBottom = "1rem";
        imageCon.src = productImage;
        const nameCon = document.createElement("h5");
        nameCon.innerHTML = productName;

        individualProduct.append(imageCon, nameCon);

        products.append(individualProduct);
        search.value = "";

        individualProduct.addEventListener("click", (e) => {
          e.preventDefault();
          const slugUrl = "https://openapi.programming-hero.com/api/phone/";
          fetch(`${slugUrl}${product.slug}`)
            .then((res) => res.json())
            .then((data) => {
              return data.data;
            })
            .then((data) => {
              const modalOverlay = document.querySelector(".modal-overlay");
              modalOverlay.style.display = "flex";
              const overlay = document.querySelector(".modal");

              const closeOverlayBtn = document.createElement("button");
              closeOverlayBtn.innerHTML = "Close";
              closeOverlayBtn.classList.add("btn", "modal-close-btn");
              closeOverlayBtn.addEventListener("click", () => {
                modalOverlay.style.display = "none";
                overlay.innerHTML = "";
              });

              const modalImage = document.createElement("img");
              modalImage.src = data.image;
              modalImage.classList.add("modal-image");

              const modalTitle = document.createElement("h5");
              modalTitle.classList.add("modal-title");
              modalTitle.innerHTML = data.brand + " " + data.name;

              const modalDetails = document.createElement("div");
              modalDetails.classList.add("modal-details");

              const storage = document.createElement("p");
              storage.innerHTML = `<strong>Memory and Storage :</strong> ${data?.mainFeatures?.memory}`;
              const processor = document.createElement("p");
              processor.innerHTML = `<strong>Processor :</strong> ${data?.mainFeatures?.chipSet}`;
              const display = document.createElement("p");
              display.innerHTML = `<strong>Display Size :</strong> ${data?.mainFeatures?.displaySize}`;
              const sensors = document.createElement("p");
              sensors.innerHTML = `<strong>Sensors :</strong> ${data?.mainFeatures?.sensors}`;
              const released = document.createElement("p");
              released.innerHTML = `<strong>Release Date :</strong> ${data?.releaseDate}`;

              modalDetails.append(
                storage,
                processor,
                display,
                sensors,
                released
              );

              overlay.append(
                modalImage,
                modalTitle,
                modalDetails,
                closeOverlayBtn
              );
            });
        });
      }
    });
    if (limit < productArray.length) {
      const showMoreBtn = document.querySelector(".showMoreBtn");
      showMoreBtn.style.display = "inline-block";
      showMoreBtn.addEventListener("click", (e) => {
        e.preventDefault();
        limit += 12;
        creatingCards(productArray);
      });
    } else {
      document.querySelector(".showMoreBtn").style.display = "none";
    }
  }
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  limit = 12;
  searchfn(search.value);
});
