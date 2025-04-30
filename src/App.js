document.addEventListener('DOMContentLoaded', function() {

  const container = document.getElementById('container');

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.placeholder = 'Введите текст и нажмите Enter';
  inputField.style.width = '20%';
  inputField.style.marginBottom = '10px';
  inputField.style.padding = '8px';
  inputField.style.boxSizing = 'border-box';
  
  container.appendChild(inputField);
  inputField.focus();

  inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const text = inputField.value.trim();
      if (text) {
        addListItem(text);
        inputField.value = '';
      }
    }
  });

  function addListItem(text) {
    container.insertBefore(listItem, inputField.nextSibling);
    saveToLocalStorage();
    const listItem = document.createElement('div');
    listItem.style.display = 'flex';
    listItem.style.alignItems = 'center';
    listItem.style.marginBottom = '5px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginRight = '10px';

    checkbox.addEventListener('change', function() {
      if (this.checked) {
        listItem.style.transition = 'opacity 0.3s';
        listItem.style.opacity = '0';
        setTimeout(() => {
          container.removeChild(listItem);
          saveToLocalStorage();
        }, 300);
      }
    });

    const textSpan = document.createElement('span');
    textSpan.textContent = text;

    listItem.appendChild(checkbox);
    listItem.appendChild(textSpan);

    container.insertBefore(listItem, inputField.nextSibling);
  }
});

function saveToLocalStorage() {
  const tasks = [];
  const items = container.querySelectorAll('div[style*="display: flex"]');
  
  items.forEach(item => {
    const text = item.querySelector('span').textContent;
    tasks.push(text);
  });
  
  localStorage.setItem('savedTasks', JSON.stringify(tasks));
}