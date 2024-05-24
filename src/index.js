let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyCollection = document.getElementById("toy-collection");

  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        renderToy(element);
      })
      patch();
    })

    
  function renderToy(toy){
    const card = document.createElement('div');
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `
    toyCollection.appendChild(card);
  }

  const form = document.querySelector("form");
  const inputs = document.querySelectorAll('input');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": inputs[0].value,
        "image": inputs[1].value,
        "likes": 0
      })
    })
      .then((response) => response.json())
      .then((data) => {
        renderToy(data);
      })
  })

  function patch(){
    const buttons = document.querySelectorAll(".like-btn");
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const newNumberOfLikes = parseInt(button.previousElementSibling.innerText.split(" ")[0], 10) + 1;
        fetch(`http://localhost:3000/toys/${button.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            "likes": newNumberOfLikes
          })
        })
          .then((response) => response.json())
          .then(() => {
            button.previousElementSibling.innerText = `${newNumberOfLikes} likes`;
          })
      })
    })
  }
});
