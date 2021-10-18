'use strict';
$(initPage);

var gProjects = [
    {
        id: 'sokoban',
        name: 'Sokoban',
        title: 'Better push those boxes.',
        logo: 'projects/sokoban/img/logo.PNG',
        preview: 'projects/sokoban/img/preview.PNG',
        desc: 'Sokoban (倉庫番, Sōko-ban) is a puzzle video game genre in which the player pushes crates or boxes around in a warehouse, trying to get them to storage locations.',
        url: 'projects/sokoban/index.html',
        publishedAt: getDate(Date.now()),
        labels: ['Gaming'],
    },
    {
        id: 'pacman',
        name: 'Pacman',
        title: `Don't let them touch you.`,
        logo: 'projects/Pacman/img/logo.PNG',
        preview: 'projects/Pacman/img/preview.PNG',
        desc: 'Pacman is an action maze chase video game; the player controls the eponymous character through an enclosed maze. The objective of the game is to eat all of the dots placed in the maze while avoiding three random colors ghosts — that pursue him.',
        url: 'projects/Pacman/index.html',
        publishedAt: getDate(Date.now()),
        labels: ['Gaming'],
    },
    {
        id: 'minesweeper',
        name: 'Minesweeper',
        title: `Be careful ! A minefield in front of you.`,
        logo: 'projects/minesweeper/img/logo.PNG',
        preview: 'projects/minesweeper/img/preview.PNG',
        desc: 'Minesweeper is single-player logic-based computer game played on rectangular board whose object is to locate a predetermined number of randomly-placed "mines" in the shortest possible time by clicking on "safe" squares while avoiding the squares with mines. If the player clicks on a mine, the game ends.',
        url: 'projects/minesweeper/index.html',
        publishedAt: getDate(Date.now()),
        labels: ['Gaming'],
    },
    {
        id: 'library',
        name: 'Library',
        title: `Tell me what you read, and I'll tell you who you are.`,
        logo: 'projects/bookshop/imgs/logo.PNG',
        preview: 'projects/bookshop/imgs/preview.PNG',
        desc: `The online rare library is a collection of rare books that are buyable  and not for display purposes. 
        The library provides  rare books in a delivery to the customer's home.`,
        url: 'projects/bookshop/index.html',
        publishedAt: getDate(Date.now()),
        labels: ['Shoping'],
    },
    {
        id: 'spaceInvaders',
        name: 'Space Invaders',
        title: `Don't let them take the earth.`,
        logo: 'projects/spaceInvaders/img/logo.png',
        preview: 'projects/spaceInvaders/img/preview.png',
        desc: `Space Invaders is a Fixed shooter in which the player moves a laser cannon horizontally across the bottom of the screen and fires at aliens overhead. The aliens move left and right as a group, shifting downward each time they reach a screen edge. The goal is to eliminate all of the aliens by shooting them. the game ends immediately if the invaders reach the bottom of the screen.`,
        url: 'projects/spaceInvaders/index.html',
        publishedAt: getDate(Date.now()),
        labels: ['Gaming'],
    },
];

function initPage() {
    renderCards();
}

function renderCards() {
    var strHTMLs = gProjects.map(function (proj) {
        return ` <div onclick="renderProjectModal() "class="col-md-4 col-sm-6 portfolio-item">
        <a class="portfolio-link" data-toggle="modal" href="#${proj.id}">
          <div class="portfolio-hover">
            <div class="portfolio-hover-content">
              <i class="fa fa-plus fa-3x"></i>
            </div>
          </div>
          <img class="img-fluid" src="${proj.logo}" alt="">
        </a>
        <div class="portfolio-caption">
          <h4>${proj.name}</h4>
          <p class="text-muted">${proj.title}</p>
        </div>
        </div> `;
    });
    $('.card-container').html(strHTMLs);
}

function renderProjectModal() {
    var strHTMLs = gProjects.map(function (proj) {
        return `
     <div class="portfolio-modal modal fade" id="${proj.id}" tabindex="-1" role="dialog" aria-hidden="true">
     <div class="modal-dialog">
       <div class="modal-content">
         <div class="close-modal" data-dismiss="modal">
           <div class="lr">
             <div class="rl"></div>
           </div>
         </div>
         <div class="container">
           <div class="row">
             <div class="col-lg-8 mx-auto">
               <div class="modal-body">   
                 <h2>${proj.name}</h2>
                 <p class="item-intro text-muted">${proj.title}</p>
                 <img class="img-fluid d-block mx-auto" src="${proj.preview}" alt="">
                 <a href="${proj.url}" target="_blank">Open Project</a>
                 <p>${proj.desc}</p>
                 <ul class="list-inline">
                   <li>Date: ${proj.publishedAt}</li>
                   <li>Client: Threads</li>
                   <li>Category: ${proj.labels}</li>
                 </ul>
                 <button class="btn btn-primary" data-dismiss="modal" type="button">
                   <i class="fa fa-times"></i>
                   Close Project</button>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div> `;
    });
    $('.modal-container').html(strHTMLs);
}

function getDate(currDate) {
    const year = new Date(currDate).getFullYear();
    const month = new Date(currDate).getMonth();
    const day = new Date(currDate).getDate();
    const hours = new Date(currDate).getHours();
    const minutes = new Date(currDate).getMinutes();
    const seconds = new Date(currDate).getSeconds();
    const date = new Date(Date.UTC(year, month, day));
    const time = new Date(Date.UTC(0, 0, 0, hours, minutes, seconds));
    const optionsDate = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const newDate = date.toLocaleDateString('en-GB', optionsDate);
    const newTime = time.toUTCString().substring(17, 25);
    return newDate + ' ' + newTime;
}

function contect() {
  var subject = $('.subject').val()
  var content = $('.content').val()
 var strMail = `https://mail.google.com/mail/?view=cm&fs=1&to=danielradia20@gmail.com&su=${subject}&body=${content}`
  window.open(strMail)
  email.val() = ''
  subject.val() = ''
  content.val() = ''
}
