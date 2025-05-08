const defaultAvatarUrl = '../assets/img/avatar.png';
const defaultData = {
  username: 'seuusuario',
  name:     'Seu Nome',
  bio:      'Aqui vai a sua bio – conte um pouco sobre você!'
};

const profilePicEl    = document.getElementById('profilePic');
const usernameEl      = document.getElementById('profileUsername');
const nameEl          = document.getElementById('profileName');
const bioEl           = document.getElementById('profileBio');
const postsCountEl    = document.getElementById('postsCount');
const followersEl     = document.getElementById('followersCount');
const followingEl     = document.getElementById('followingCount');
const editBtn         = document.getElementById('editBtn');
const resetImgBtn     = document.getElementById('resetImgBtn');
const resetProfileBtn = document.getElementById('resetProfileBtn');
const headerEl        = document.querySelector('.profile-header');
let isEditing = false;

function loadProfile() {
  const p = JSON.parse(localStorage.getItem('clubefy_profile')) || {};
  profilePicEl.src       = p.pic       || defaultAvatarUrl;
  usernameEl.textContent = p.username  || defaultData.username;
  nameEl.textContent     = p.name      || defaultData.name;
  bioEl.textContent      = p.bio       || defaultData.bio;
  postsCountEl.textContent   = p.posts     != null ? p.posts     : 0;
  followersEl.textContent    = p.followers != null ? p.followers : 0;
  followingEl.textContent    = p.following != null ? p.following : 0;
}

function saveProfile() {
  const profile = {
    pic:       profilePicEl.src,
    username:  usernameEl.textContent.trim(),
    name:      nameEl.textContent.trim(),
    bio:       bioEl.textContent.trim(),
    posts:     Number(postsCountEl.textContent),
    followers: Number(followersEl.textContent),
    following: Number(followingEl.textContent),
  };
  localStorage.setItem('clubefy_profile', JSON.stringify(profile));
}

editBtn.addEventListener('click', () => {
  isEditing = !isEditing;
  headerEl.classList.toggle('editing', isEditing);
  [usernameEl, nameEl, bioEl].forEach(el => el.contentEditable = isEditing);
  editBtn.textContent = isEditing ? 'Salvar' : 'Editar Perfil';
  if (!isEditing) saveProfile();
});

function previewProfilePic(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    profilePicEl.src = e.target.result;
    saveProfile();
  };
  reader.readAsDataURL(file);
}

resetImgBtn.addEventListener('click', () => {
  profilePicEl.src = defaultAvatarUrl;
  saveProfile();
});

resetProfileBtn.addEventListener('click', () => {
  usernameEl.textContent = defaultData.username;
  nameEl.textContent     = defaultData.name;
  bioEl.textContent      = defaultData.bio;
  if (isEditing) {
    isEditing = false;
    headerEl.classList.remove('editing');
    [usernameEl, nameEl, bioEl].forEach(el => el.contentEditable = false);
    editBtn.textContent = 'Editar Perfil';
  }
  saveProfile();
});

window.addEventListener('DOMContentLoaded', loadProfile);
