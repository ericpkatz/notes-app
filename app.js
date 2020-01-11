const userContainer = document.querySelector('#user-info');
const notesContainer = document.querySelector('#notes-container');
const notesForm = document.querySelector('form');
const textInput = document.querySelector('input');

notesContainer.addEventListener('click', async(ev)=> {
  const id = ev.target.getAttribute('data-id'); 
  if(id){
    await axios.delete(`${API}/users/${user.id}/notes/${id}`);
  }
});

notesForm.addEventListener('submit', async(ev)=> {
  ev.preventDefault();
  const note = {
    text: textInput.value
  };
  const response = await axios.post(`${API}/users/${user.id}/notes`, note);
  const created = response.data;
  //notes = notes.push(created);
  notes = [...notes, created];
  renderNotes();
});
let user, notes;

const API = 'https://acme-users-api-rev.herokuapp.com/api';

const fetchUser = async ()=> {
  const storage = window.localStorage;
  const userId = storage.getItem('userId'); 
  if(userId){
    try {
      return (await axios.get(`${API}/users/detail/${userId}`)).data;
    }
    catch(ex){
      storage.removeItem('userId');
      return fetchUser();
    }
  }
  const user = (await axios.get(`${API}/users/random`)).data;
  storage.setItem('userId', user.id);
  return  user;
};

const renderUser = ()=> {
  const html = `
    <h2>${ user.fullName}</h2>
    <img src='${user.avatar}'/>
    <div>${ user.bio }</div>
  `;
  userContainer.innerHTML = html;
};

const renderNotes = ()=> {
  let html = notes.map( note => {
    return `
      <li>
        ${ note.text }
        <button data-id='${note.id}'>X</button>
      </li>
    `;
  }).join('');
  html = `<h2>Notes (${ notes.length})</h2><ul>${html}</ul>`;
  notesContainer.innerHTML = html;

};

const startApp = async()=> {
  user = await fetchUser();
  renderUser();
  const response = await axios.get(`${API}/users/${user.id}/notes`);
  notes = response.data;
  renderNotes();
};

startApp();
