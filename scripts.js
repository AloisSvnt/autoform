const loadData = async () => {
  const response = await fetch('./data.json');
  const users = await response.json();

  const usersWithoutErrors = [];
  const usersWithErrors = [];

  for (const [i, user] of users.entries()) {
    const validationErrors = validateUser(user, i);

    if (validationErrors !== true) {
      usersWithErrors.push({ ...user, errors: validationErrors });
      continue;
    }

    fillForm(user);
    usersWithoutErrors.push(user);
    await sendForm();
    await pause(1000);
  }

  notified(usersWithoutErrors, usersWithErrors);
};

const validateUser = (user, i) => {
  const errors = [];

  if (!user.firstname || typeof user.firstname !== 'string') {
    errors.push("Missing or invalid first name");
  }

  if (!user.lastname || typeof user.lastname !== 'string') {
    errors.push("Missing or invalid last name");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user.email || typeof user.email !== 'string' || !emailPattern.test(user.email)) {
    errors.push("Missing or invalid email");
  }

  const ageValid = typeof user.age === 'number' && !isNaN(user.age) && user.age >= 0;
  if (!ageValid) {
    errors.push("Missing or invalid age");
  }

  if (errors.length > 0) {
    return errors;
  }
  
  return true;
};

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

const notified = (users, usersErrors) => {
  const notif = getElement('notif');

  const names = users.map(user =>
    `<li>${user.firstname} ${user.lastname}</li>`
  ).join('');

const namesError = usersErrors.map(user => {
  return `<li><strong>${user.firstname} ${user.lastname}</strong><ul>` +
    user.errors.map(e => `<li style="color:red">⚠️ ${e}</li>`).join('') +
    `</ul></li>`;
}).join('');

  notif.innerHTML = `
    <p><strong>✅ Forms sent for :</strong></p>
    <ul>${names}</ul>
    <p><strong>❌ Errors with :</strong></p>
    <ul>${namesError}</ul>
  `;
  notif.style.opacity = 1;
};

document.addEventListener('DOMContentLoaded', () => {
  getElement('user-form').addEventListener('submit', (event) => {
    event.preventDefault();
  });

  loadData();
})