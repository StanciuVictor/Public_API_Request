// Create HTML markup for search bar
const formHTML = `
  <form action="#" method="GET">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;

let usersInfo = null;  // this will keep only the user info fetched from the server
const searchCont = document.querySelector('div.search-container');
searchCont.innerHTML = formHTML;
const gallery = document.getElementById('gallery');
const script = document.querySelector('script');
const form = document.querySelector('form');


/* 
* Get info for 12 random users
* 1.3 --> tells the api to use v1.3
* results=12  --> tells the server to send info for 12 users
* nat=us --> tells the server to send info only on users from US
*/
fetch('https://randomuser.me/api/1.3/?results=12&nat=us')
  .then(checkStatus)
  .then(res => res.json())
  .then(data => {
    usersInfo = data.results;
    displayUsers(usersInfo);
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
  // console.log('usersInfo', users);
  // Make sure the "No results" is removed
  gallery.innerHTML = '';

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


// Display modal when a user is clicked
gallery.addEventListener('click', (e) => {
  // If the target does not have 'gallery' in class list
  // If any part of a user card is clicked
  if (e.target.className.indexOf('gallery') === -1) {

    let element = e.target;

    // Get element with .card class
    while (/^card$/.test(element.className) === false) {
      element = element.parentElement;
    }

    // Get user email, which is unique
    const email = element.querySelector('p').textContent;

    usersInfo.forEach(user => {
      if (user.email === email) {
        displayModal(user);
      }
    });
  }
});

/**
 * Create HTML markup for Modal
 * Display modal
 * Add event listeners for modal's buttons
 *
 * @param {object} user - All information available on the selected user
 */
function displayModal (user) {
  // Create HTML markup
  const modalHTML = `
    <div class="modal-container">
      <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
          <img class="modal-img" src=${user.picture.large} alt="profile picture">
          <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="modal-text">${user.email}</p>
          <p class="modal-text cap">${user.location.city}</p>
          <hr>
          <p class="modal-text">${user.cell}</p>
          <p class="modal-text">
            ${user.location.street.number}
            ${user.location.street.name}
            ${user.location.city}
            ${user.location.state}
            ${user.location.postcode}
          </p>
          <p class="modal-text">Birthday: ${user.dob.date}</p>
        </div>
      </div>

      <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
    </div>
  `;
  // Display modal
  script.insertAdjacentHTML('beforebegin', modalHTML);


  // ##### Event Listeners #####

  // Remove displayed modal when "x" is clicked
  const closeBtn = document.getElementById('modal-close-btn');
  closeBtn.addEventListener('click', () => {
    document.querySelector('div.modal-container').remove();
  });


  // Add functionality to Prev and Next buttons
  const prevBtn = document.getElementById('modal-prev');
  prevBtn.addEventListener('click', () => {

    // Get email of user displayed in modal
    const email = document.querySelector('div.modal-container p.modal-text').textContent;

    // Go through all <p> elements and find the card of the user displayed in modal
    // then get the previous user based on the email address
    const paragraphs = document.querySelectorAll('div p.card-text');
    let selectedUser = null;
    let previousUser = null;
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].textContent === email) {
        selectedUser = paragraphs[i].parentElement.parentElement;
        previousUser = selectedUser.previousElementSibling;
      }
    }

    // If there is a previous user (if the user displayed in modal is not the first user)
    // get info from the usersInfo array and display the new modal with prev user
    if (previousUser) {
      const previousEmail = previousUser.querySelector('div p.card-text').textContent;
      usersInfo.forEach(user => {
        if (user.email === previousEmail) {
          // Remove the current modal
          document.querySelector('div.modal-container').remove();
          displayModal(user);
        }
      });
    }
  });


  const nextBtn = document.getElementById('modal-next');
  nextBtn.addEventListener('click', () => {

    // Get email of user displayed in modal
    const email = document.querySelector('div.modal-container p.modal-text').textContent;

    // Go through all <p> elements and find the card of the user displayed in modal
    // then get the next user based on the email address
    const paragraphs = document.querySelectorAll('div p.card-text');
    let selectedUser = null;
    let nextUser = null;
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].textContent === email) {
        selectedUser = paragraphs[i].parentElement.parentElement;
        nextUser = selectedUser.nextElementSibling;
      }
    }

    // If there is a next user (if the user displayed in modal is not the last user)
    // get info from the usersInfo array and display the new modal with next user
    if (nextUser) {
      const nextEmail = nextUser.querySelector('div p.card-text').textContent;
      usersInfo.forEach(user => {
        if (user.email === nextEmail) {
          // Remove the current modal
          document.querySelector('div.modal-container').remove();
          displayModal(user);
        }
      });
    }
  });
}


// Add search functionality
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchInput = document.getElementById('search-input');
  const search = searchInput.value;
  // console.log('Form submitted', search);

  // If the search bar is not empty, perform search
  if (search !== '') {
    searchFn(usersInfo, search);
  } else {
    // Else, display all users
    displayUsers(usersInfo);
  }
});

/**
 * Takes the text inserted in the search bar and perforsm a filtering action, displaying only matching users
 * 
 * @param {array} usersInfo - Array of objects containing all info on every user. One object represents one user
 * @param {string} search - The string inserted in the search bar, used to filter the users on the page
 */
function searchFn (usersInfo, search) {
  // Remove any users that might have previously been displayed.
  gallery.innerHTML = '';

  // This array will hold users matching the search input.
  const filteredList = [];

  for (let i = 0; i < usersInfo.length; i++) {
    // If search bar is not empty AND if first OR last names of every user include searched text,
    // then add the user to filteredList array.
    if (search.length !== 0 &&
      (usersInfo[i].name.first.toLowerCase().includes(search.toLowerCase()) ||
        usersInfo[i].name.last.toLowerCase().includes(search.toLowerCase()))) {
      filteredList.push(usersInfo[i]);
    }
  }
  // console.log(filteredList);
  if (filteredList.length !== 0) {
    displayUsers(filteredList);
  } else {
    gallery.innerHTML = `<p class="no-results">No results found! ${String.fromCodePoint(0x1f615)}</p>`;
  }
}