document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.todo-input');
    const searchButton = document.querySelector('.todo-button');
    const sortButton = document.querySelector('.sort-button');

    // const filterOption = document.querySelector('.filter-task');
    const dateInput = document.querySelector('.date-input');
    const dateFilterButton = document.querySelector('.date-filter-button');

    searchButton.addEventListener('click', searchTasks);
    searchInput.addEventListener('input', searchTasks);
    sortButton.addEventListener('click', sortTasksByDueDate);

    const taskInput = document.querySelector('.task-input');
    const taskDueDateInput = document.querySelector('.task-due-date');
    const taskList = document.querySelector('.task-list');
    const filterOption = document.querySelector('.filter-task');
    filterOption.addEventListener('change', handleFilterOptionChange);
    dateFilterButton.addEventListener('click', filterTasksByDate);

    document.addEventListener('DOMContentLoaded', getTasks);
    document.querySelector('.task-input-button').addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);
    filterOption.addEventListener('change', filterTasks);

    function searchTasks() {
        const searchTerm = searchInput.value.toLowerCase();
        const tasks = taskList.querySelectorAll('.task');

        tasks.forEach(task => {
            const taskText = task.querySelector('.task-item').innerText.toLowerCase();
            if (taskText.includes(searchTerm)) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function addTask(event) {
        event.preventDefault();

        const taskText = taskInput.value;
        const taskDueDate = taskDueDateInput.value;
        const taskCategory = document.querySelector('.task-category-select').value;

        if (taskText === '' || taskDueDate === '') return;

        const taskDiv = createTaskElement(taskText, taskDueDate, taskCategory);
        taskList.appendChild(taskDiv);

        saveLocalTasks();

        taskInput.value = '';
        taskDueDateInput.value = '';
    }

    function createTaskElement(text, dueDate, category) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');

        const taskLi = document.createElement('li');
        taskLi.classList.add('task-item');
        taskLi.innerText = text;
        taskDiv.appendChild(taskLi);

        const taskDateElement = document.createElement('span');
        taskDateElement.classList.add('task-date');
        taskDateElement.innerText = dueDate;
        taskDiv.appendChild(taskDateElement);

        const taskCategoryElement = document.createElement('span');
        taskCategoryElement.classList.add('task-category');
        taskCategoryElement.innerText = category;
        taskDiv.appendChild(taskCategoryElement);

        const editButton = document.createElement('button');
editButton.innerHTML = '<i class="fas fa-edit"></i>';
editButton.classList.add('edit-btn');
taskDiv.appendChild(editButton);

        const completeButton = document.createElement('button');
        completeButton.innerHTML = '<i class="fas fa-check-circle"></i>';
        completeButton.classList.add('complete-btn');
        taskDiv.appendChild(completeButton);

        

        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add('trash-btn');
        taskDiv.appendChild(trashButton);

        return taskDiv;
    }

    function sortTasksByDueDate() {
        const tasksArray = Array.from(taskList.childNodes);
        const sortedTasks = tasksArray.sort((taskA, taskB) => {
            const dueDateA = new Date(taskA.querySelector('.task-date').innerText);
            const dueDateB = new Date(taskB.querySelector('.task-date').innerText);
            return dueDateA.getTime() - dueDateB.getTime();
        });

        taskList.innerHTML = '';
        sortedTasks.forEach(task => {
            taskList.appendChild(task);
        });
    }

    function handleFilterOptionChange() {
        const selectedFilter = filterOption.value;

        if (selectedFilter === 'date') {
            dateInput.style.display = 'inline-block';
            dateFilterButton.style.display = 'inline-block';
        } else {
            dateInput.style.display = 'none';
            dateFilterButton.style.display = 'none';

            if (selectedFilter === 'all') {
                showAllTasks();
            } else if (selectedFilter === 'completed') {
                showCompletedTasks();
            } else if (selectedFilter === 'incompleted') {
                showIncompletedTasks();
            }
        }
    }

    function filterTasksByDate() {
        const selectedDate = new Date(dateInput.value);
        if (isNaN(selectedDate)) {
            alert("Please select a valid date.");
            return;
        }

        const tasks = taskList.querySelectorAll('.task');

        tasks.forEach(task => {
            const taskDate = new Date(task.querySelector('.task-date').innerText);
            if (taskDate.toDateString() === selectedDate.toDateString()) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function handleTaskActions(event) {
        const item = event.target;
    
        if (item.classList.contains('complete-btn')) {
            const task = item.parentElement;
            task.classList.toggle('completed');
            saveLocalTasks();
        }
        if (item.classList.contains('edit-btn')) {
            const task = item.parentElement;
            const taskText = task.querySelector('.task-item');
            const editInput = task.querySelector('.edit-input'); // Check if edit input already exists
        
            if (editInput) {
                // If the edit input already exists, finish editing and save changes
                const newText = editInput.value.trim();
                taskText.innerText = newText;
                task.removeChild(editInput);
                saveLocalTasks();
            } else {
                // If the edit input doesn't exist, create and set up the edit input
                const editInput = document.createElement('input');
                editInput.classList.add('edit-input');
                editInput.type = 'text';
                editInput.value = taskText.innerText;
                taskText.innerHTML = ''; // Clear the task text
                taskText.appendChild(editInput);
        
                editInput.focus();
        
                editInput.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        const newText = editInput.value.trim();
                        taskText.innerText = newText;
                        task.removeChild(editInput);
                        saveLocalTasks();
                    }
                });
        
                editInput.addEventListener('blur', () => {
                    const newText = editInput.value.trim();
                    taskText.innerText = newText;
                    task.removeChild(editInput);
                    saveLocalTasks();
                });
            }
        }
        
    
        if (item.classList.contains('trash-btn')) {
            const task = item.parentElement;
            task.classList.add('slide');
            task.addEventListener('transitionend', () => {
                task.remove();
                saveLocalTasks();
            });
        }
    }
    
    

    function filterTasks(event) {
        const tasks = taskList.childNodes;
        const filterValue = event.target.value;

        tasks.forEach(task => {
            switch (filterValue) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                    break;
                case 'incompleted':
                    task.style.display = !task.classList.contains('completed') ? 'flex' : 'none';
                    break;
            }
        });
    }

    function saveLocalTasks() {
        const tasks = [];
        taskList.querySelectorAll('.task').forEach(task => {
            const taskInfo = {
                text: task.querySelector('.task-item').innerText,
                dueDate: task.querySelector('.task-date').innerText,
                category: task.querySelector('.task-category').innerText,
                completed: task.classList.contains('completed')
            };
            tasks.push(taskInfo);
        });
    
        // Store tasks in local storage using the newer localStorage API
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error("Error saving tasks to local storage:", error);
        }
    }
    function getTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const sortedTasks = tasks.sort((taskA, taskB) => {
            const dueDateA = new Date(taskA.dueDate);
            const dueDateB = new Date(taskB.dueDate);
            return dueDateA - dueDateB;
        });

        sortedTasks.forEach(task => {
            const taskDiv = createTaskElement(task.text, task.dueDate, task.category);
            if (task.completed) {
                taskDiv.classList.add('completed');
            }
            taskList.appendChild(taskDiv);
        });
    }
});

