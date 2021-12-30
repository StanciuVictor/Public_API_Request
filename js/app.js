let usersInfo;  // this will keep inly the important info fetched from the server
const searchCont = document.querySelector('div.search-container');
const gallery = document.getElementById('gallery');

// Create HTML markup for search bar
const formHTML = `
  <form action="#" method="GET">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
`;
searchCont.innerHTML = formHTML;


// Get info for 12 users
// results=12 tels the server to send info for 12 users
fetch('https://randomuser.me/api/1.3/?results=12&nat=gb')
  .then(res => res.json())
  .then(data => {
    console.log(data);
    usersInfo = data.results;
    usersInfo.forEach(user => {
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
  });
