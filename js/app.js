let usersInfo;  // this will keep only the user info fetched from the server
const searchCont = document.querySelector('div.search-container');
const gallery = document.getElementById('gallery');
const script = document.querySelector('script');


/* 
* Get info for 12 users
* 1.3 --> tells the api to use v1.3
* results=12  --> tells the server to send info for 12 users
* nat=us --> tells the server to send info only on users from US
*/
fetch('https://randomuser.me/api/1.3/?results=12&nat=us')
  .then(checkStatus)
  .then(res => res.json())
  .then(data => {
    displayUsers(data.results);
    usersInfo = data.results;
  })
  .catch(err => console.log('Looks like there\'s a problem: ', err));

/**
 * Check if the server response is 200 OK
 * 
 * @param {object} response - The response received from the server
 */
function checkStatus (response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

/**
 * Create HTML markup for each user and display it on the page
 *
 * @param {array} users - Each element of the array represents info on one user
 */
function displayUsers (users) {
  console.log(users);
  users.forEach(user => {
    const userHTML = `
      <div class="card">
        <div class="card-img-container">
          <img class="card-img" src=${user.picture.large} alt="profile picture">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3 >
          <p class="card-text">${user.email}</p>
          <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
      </div>
      `;
    gallery.insertAdjacentHTML('beforeend', userHTML);
  });
}


// Create HTML markup for search bar
const formHTML = `
  <form action="#" method="GET">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;
searchCont.innerHTML = formHTML;

gallery.addEventListener('click', (e) => {
  // If the target does not have 'gallery' in class list
  // If any part of a user item is clicked
  if (e.target.className.indexOf('gallery') === -1) {
    console.log(e.target);
    // Create an array with all children and grandchildren of gallery
    const galleryArray = [...gallery.getElementsByTagName("*")];

    // Set index to be the card's number in the order they are displayed
    // e.g. First card --> index 0 (regardless of the indexes of grand/children in the array)
    const index = Math.floor(galleryArray.indexOf(e.target) / 7);
    console.log(index);

    const modalHTML = `
      <div class="modal-container">
        <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
            <img class="modal-img" src=${usersInfo[index].picture.large} alt="profile picture">
            <h3 id="name" class="modal-name cap">${usersInfo[index].name.first} ${usersInfo[index].name.last}</h3>
            <p class="modal-text">${usersInfo[index].email}</p>
            <p class="modal-text cap">${usersInfo[index].location.city}</p>
            <hr>
            <p class="modal-text">${usersInfo[index].cell}</p>
            <p class="modal-text">
              ${usersInfo[index].location.street.number} 
              ${usersInfo[index].location.street.name} 
              ${usersInfo[index].location.city} 
              ${usersInfo[index].location.state}
              ${usersInfo[index].location.postcode}
            </p>
            <p class="modal-text">Birthday: ${usersInfo[index].dob.date}</p>
          </div>
        </div>

        // IMPORTANT: Below is only for exceeds tasks 
        <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
      </div>
    `;
    script.insertAdjacentHTML('beforebegin', modalHTML);
  }
});

// no, str, city, state, postcode