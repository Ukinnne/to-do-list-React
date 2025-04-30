const button = document.getElementById('Plus_Button');


button.addEventListener('click', function() {
  const newDiv = document.createElement('div');
  newDiv.textContent = 'Новый div';
  document.body.appendChild(newDiv);
});