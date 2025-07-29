const loadData = async () => {
  const response = await fetch('./data.json');
  const users = await response.json();

  for (const user of users) {
    fillForm(user);
    await sendForm();
    await pause(1000);
  }
  notified(users);
}

const getElement = (name) => {
  return document.querySelector(`#${name}`)
}

const fillForm = ({ firstname, lastname, email, age }) => {
  getElement('firstname').value = firstname;
  getElement('lastname').value = lastname;
  getElement('email').value = email;
  getElement('age').value = age;
}

const sendForm = () => {
  return new Promise((resolve) => {
    getElement('user-form').requestSubmit();
    setTimeout(resolve, 500);
  });
};

const pause = (ms) => {
  return new Promise(resolve => setTimeout(resolve,ms));
}

const notified = (users) => {
  const names = users.map(user => `<li>${user.firstname} ${user.lastname}</li>`).join('');
  const notif = getElement('notif')
  notif.innerHTML = `All forms sent for : <ul>${names}</ul>`;
  notif.style.opacity = 1
}

document.addEventListener('DOMContentLoaded', () => {
  getElement('user-form').addEventListener('submit', (event) => {
    event.preventDefault();
  });

  loadData();
})