//DOM ELements
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

// Capture form's input on button submission
var formSubmitHandler = function (event) {
    event.preventDefault();
    // Get value of input thru DOM variable. use trim method to rid of extra spaces. store input value in username variable
    var username = nameInputEl.value.trim();
    if (username) {
        //pass the username value into getUserRepos() to get that user's data
        getUserRepos(username);
        //set value of nameInputEl to whatever is submitted
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
    //console.log(event);
};

// Establish connection to girhub API & Retrieve data
var getUserRepos = function (user) {
    // Format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // Make a request to the url
    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            // After response data is converted to JSON, pass it to displayRepos() along with user
            displayRepos(data, user);
            //console.log(data);
        });

    });
};

// Display Repo data
var displayRepos = function (repos, searchTerm) {
    //console.log(repos);
    //console.log(searchTerm);

    // Clear old search content from page
    repoContainerEl.textContent = "";
    //display user name that matches the searched term "username" 
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format each[i] repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
                console.log(statusEl.innerHTML)
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append span element(s) to repo container(s)
        repoEl.appendChild(titleEl);

        // append repo container(s) to repoContainerEl DOM element
        repoContainerEl.appendChild(repoEl);
    }
};

//event-listener to execute formSubmiteHandle() upon form submisssion
userFormEl.addEventListener("submit", formSubmitHandler);