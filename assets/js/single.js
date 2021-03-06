var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name")

// Extract Repo Name from search query 
var getRepoName = function () {
    //use document location to extract query value from search
    var queryString = document.location.search;
    //Use split method to remove the = sign and get username and repo name only
    var repoName = queryString.split("=")[1];
    //console.log(repoName);
    if (repoName) { //if repoName exists = true
        //display repo name 
        repoNameEl.textContent = repoName;

        //pass repoName into getRepoIssues to fetch the related isssues from GitHub API issue point
        getRepoIssues(repoName);
    }
    else { //if repoName doesnt exist, re-direct to home page
        document.location.replace("./index.html");
      }
}


// Fetch issues from api URL
var getRepoIssues = function (repo) {
    console.log(repo);

    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    //use fetch method to pass apiUrl variable
    fetch(apiUrl).then(function (response) {
        // request was successful
        if (response.ok) {
            response.json().then(function (data) {
                //once received, pass reponse data to DOM function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    //if more than 30 pass repo thru displayWarning()
                    displayWarning(repo);
                }
            });
        }
        else {
            //if not sucessful, re-direct to home page
            document.location.replace("./index.html");;
        }
    });
};



// Create DOM elements to display issues responses
var displayIssues = function (issues) {
    //check if repo has any issues
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    //loop over responses 
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container element
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        // append to container
        issueEl.appendChild(typeEl);
        //apend anchor element to issues container on page to display
        issueContainerEl.appendChild(issueEl);
    }

};

var displayWarning = function (repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    //link element to navifate to more issues
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};


getRepoName();