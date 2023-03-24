const searchBar = document.querySelector(".Search-Input");
const profilePicture = document.querySelector(".Profile-Picture");
const fullName = document.querySelector(".Profile-Name");
const bio = document.querySelector(".Profile-Bio");
const follower = document.querySelector(".Follower");
const following = document.querySelector(".Following");
const repositorys = document.querySelector(".Repositorys");
const repositorysAppend = document.querySelector(".Repos-Flex");
const emptyContainer = document.querySelector(".empty");
const showContainer = document.querySelector(".show");
const followButton = document.querySelector(".Follow-Button");

async function fetchDataProfile() {
  const api = "https://api.github.com/users/";
  const username = searchBar.value;
  return await fetch(api + username);
}

async function fetchDataRepositorys() {
  const api = "https://api.github.com/users/";
  const username = searchBar.value;
  return await fetch(api + username + "/repos");
}

function setProfileAttributes(object) {
  const {
    avatar_url: currentProfilePicture,
    name: currentFullName,
    bio: currentBio,
    followers: currentFollowers,
    following: currentFollowing,
    public_repos: currentRepositorys,
  } = object;
  followButton.onclick = (e) => {
    const URL = "https://github.com/" + searchBar.value;
    window.open(URL, "_blank").focus();
  };
  profilePicture.src = currentProfilePicture;
  fullName.textContent = currentFullName;
  bio.textContent = currentBio;
  follower.textContent = currentFollowers;
  following.textContent = currentFollowing;
  repositorys.textContent = currentRepositorys;
}

function removeAllChilds(object) {
  while (object.firstChild) {
    object.removeChild(object.firstChild);
  }
}

function setRepositorys(object) {
  removeAllChilds(repositorysAppend);
  object.forEach((element) => {
    const button = document.createElement("input");
    const { html_url: repoUrl, name: repoName } = element;

    button.type = "button";
    button.value = repoName;
    button.classList.add("Flex-Items");
    button.onclick = (e) => {
      window.open(repoUrl, "_blank").focus();
    };
    repositorysAppend.appendChild(button);
  });
}

function showContent() {
  emptyContainer.classList.add("hide");
  showContainer.classList.remove("hide");
}

function hideContent() {
  emptyContainer.classList.remove("hide");
  showContainer.classList.add("hide");
}

searchBar.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    showContent();
    fetchDataProfile()
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          hideContent();
          throw new Error("Pofile not Found!");
          return;
        }
      })
      .then((response) => {
        setProfileAttributes(response);

        fetchDataRepositorys()
          .then((repos) => repos.json())
          .then((repos) => {
            setRepositorys(repos);
          });
      })
      .catch((error) => {
        console.log(error);
        hideContent();
      });
  }
});
