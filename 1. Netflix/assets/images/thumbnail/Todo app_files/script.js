const addModalButton = document.getElementById('add-button');
const deleteButton = document.getElementById('x-icon');
const addButton = document.getElementById('enter-icon');
const todoInput = document.getElementById('todo-input');
const todoBox = document.getElementsByClassName('main-box');
const modalBox = document.getElementsByClassName('modal-box');
const modalCloseBtn = document.getElementById('x-mark');
const modalBackground = document.getElementsByClassName('overlay');

// modal 열기
addModalButton.addEventListener('click', showModal);
function showModal() {
  modalBox[0].classList.remove('hidden');
  modalBackground[0].classList.remove('hidden');
}

// modal 닫기
modalCloseBtn.addEventListener('click', hiddenModal);
function hiddenModal() {
  modalBox[0].classList.add('hidden');
  modalBackground[0].classList.add('hidden');
}

// 페이지 로드 시 저장된 항목이 있는지 확인 및 업데이트
document.addEventListener('DOMContentLoaded', function () {
  loadingTasks();
});

// 로컬스토리지 확인하는 함수
function loadingTasks() {
  let todos;

  if (localStorage.getItem('todos') === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem('todos'));
    todos.forEach(updateUI);
  }
}

// todo task 추가
function addTask() {
  if (todoInput.value === '') {
    alert('TODO 리스트를 작성해주세요');
    return;
  }
  if (todoInput.value) {
    let task = {
      id: new Date().getTime(),
      text: todoInput.value,
      completed: false,
    };

    // localStorage에 task 저장
    let todos;
    if (localStorage.getItem('todos') === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(task);
    localStorage.setItem('todos', JSON.stringify(todos));

    // UI 업데이트
    updateUI(task);

    // 입력창 초기화
    todoInput.value = '';
    modalBox[0].classList.add('hidden');
    modalBackground[0].classList.add('hidden');
  }
}

// UI 업데이트 함수 생성
function updateUI(task) {
  let tem = `<div class="main-list-box" data-id="${task.id}">           
              <div class="todo-box">            
                <p class="todo-uncheck">${task.text}</p>             
                <input type="text" class="todo-input hidden" value="${task.text}" />           
              </div>           
              <div>             
                <img id="edit-icon" src="/todo/img/edit.png" />             
                <img id="x-icon" src="/todo/img/x-mark.png" />           
              </div>         
            </div>`;
  todoBox[0].insertAdjacentHTML('beforeend', tem);
  let newItem = todoBox[0].lastElementChild.querySelector('.todo-uncheck');
  let editButton = todoBox[0].lastElementChild.querySelector('#edit-icon');
  let deleteButton = todoBox[0].lastElementChild.querySelector('#x-icon');
  newItem.addEventListener('click', toggleCheckStatus);
  editButton.addEventListener('click', editTask);
  deleteButton.addEventListener('click', deleteTask);
  if (todoBox[0].children.length > 1) {
    document.getElementsByClassName('empty-data')[0].style.display = 'none';
  } else {
    document.getElementsByClassName('empty-data')[0].style.display = '';
  }
}

// 클릭시 이벤트 추가
addButton.addEventListener('click', addTask);

// 엔터키 눌렀을 때 이벤트 추가
todoInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

// chexkbox 변경 로직
function toggleCheckStatus(event) {
  event.target.classList.toggle('todo-check');
  event.target.classList.toggle('todo-uncheck');

  const todoText = event.target;
  if (todoText.classList.contains('todo-check')) {
    todoText.style.textDecoration = 'line-through';
  } else {
    todoText.style.textDecoration = 'none';
  }
}

const todoItems = document.querySelectorAll('.todo-uncheck');

todoItems.forEach((item) => {
  item.addEventListener('click', toggleCheckStatus);
});

// task 수정 로직
function editTask(event) {
  const editButton = event.target;
  const todoItem = editButton.closest('.main-list-box');
  const todoId = parseInt(todoItem.dataset.id);
  const todoText = todoItem.querySelector('.todo-uncheck');
  const todoEditInput = todoItem.querySelector('.todo-input');

  if (todoEditInput.value === '') {
    alert('수정할 내용을 작성해주세요');
    return;
  }
  if (todoEditInput.classList.contains('hidden')) {
    todoText.classList.add('hidden');
    todoEditInput.classList.remove('hidden');
    editButton.src = '/todo/img/save.png';
  } else {
    // localStorage 업데이트
    let todos = JSON.parse(localStorage.getItem('todos'));
    const index = todos.findIndex((todo) => todo.id === todoId);
    todos[index].text = todoEditInput.value;
    localStorage.setItem('todos', JSON.stringify(todos));

    // UI 업데이트
    todoText.innerText = todoEditInput.value;
    todoText.classList.remove('hidden');
    todoEditInput.classList.add('hidden');
    editButton.src = '/todo/img/edit.png';
  }
}

// task 삭제 로직
function deleteTask(event) {
  const deleteButton = event.target;
  const todoItem = deleteButton.closest('.main-list-box');
  const todoId = parseInt(todoItem.dataset.id);
  const isConfirmed = confirm('정말로 삭제하시겠습니까?');
  if (isConfirmed) {
    // localStorage 업데이트
    let todos = JSON.parse(localStorage.getItem('todos'));
    const newTodos = todos.filter((todo) => todo.id !== todoId);
    localStorage.setItem('todos', JSON.stringify(newTodos));

    //UI 업데이트
    todoItem.remove();

    if (newTodos.length === 0 && todoBox[0].children.length === 1) {
      document.getElementsByClassName('empty-data')[0].style.display = '';
    } else {
      document.getElementsByClassName('empty-data')[0].style.display = 'none';
    }
  } else {
    return;
  }
}