export default class Task {
  constructor(name) {
    this.name = name;
    this.input = document.querySelectorAll('input');
    this.allTasks = document.querySelector('.footer__task');
    this.pinnedTasks = document.querySelector('.main__task');
    this.pinnedTasksText = this.pinnedTasks.querySelector('.clue__pinned');
    this.taskCount = this.allTasks.querySelector('.footer__task-count');
    this.clue = document.querySelector('.clue');
    this.arrToSearch = [];
    this.arrTasks = [];
  }

  searchTask() {
    this.input.forEach(item => {
      if (item.value) {
        const tasks = this.allTasks.querySelectorAll('.main__task_card');
        tasks.forEach(item => item.remove());
        const newArrFilter = this.arrToSearch.filter(word => word.toLowerCase().startsWith(item.value.toLowerCase()));
        if (newArrFilter.length) {
          newArrFilter.forEach(item => {
            this.filter(item);
          })
        } else {
          this.taskCount.classList.remove('pinned');
        }
      }
    })
  }


  filter(header) {
    const newTask = document.createElement('div');
    const heart = document.createElement('div');
    newTask.classList.add('main__task_card');
    this.allTasks.append(newTask);
    this.input.forEach(item => {
      newTask.insertAdjacentHTML('beforeend', `<p>${header}</p>`);
    });
    heart.classList.add('white');
    newTask.append(heart);
  }

  generationTask(block, header, heartColor) {
    const newTask = document.createElement('div');
    const heart = document.createElement('div');
    newTask.classList.add('main__task_card');
    this.clue.style = 'display: none';
    block.append(newTask);
    this.input.forEach(item => {
      newTask.insertAdjacentHTML('beforeend', `<p>${header}</p>`);
      item.value = '';
    });
    heart.classList.add(heartColor);
    newTask.append(heart);
    console.log(this.arrToSearch)
    console.log('arrTask', this.arrTasks)
  }



  addTask() {
    this.input.forEach(item => {
      item.addEventListener('keyup', event => {
        this.searchTask();
        if (event.code === 'Enter') {
          if (item.value) {
            this.taskCount.classList.add('pinned');
            this.arrToSearch.push(item.value);
            this.arrTasks.push((item.value));
            // this.generationTask(this.allTasks, item.value, 'white');
            this.arrToSearch.forEach(word => {
              item.value = '';
              this.filter(word);
            })
          } else this.clue.style = 'display: block';
        }
      });
    })
    this.addTaskStart();
  }

  toggleTask(target, colCurrent, colNew, blockCurrent, blockNew) {
    target.classList.remove(colCurrent);
    target.classList.add(colNew);
    this.generationTask(blockNew, target.previousSibling.textContent, colNew);
    blockCurrent.removeChild(target.parentNode)
  }

  addTaskStart() {
    document.body.addEventListener('click', (e) => {
      if (e.target.classList.contains('white') && e.target.closest('.footer__task')) {
        this.pinnedTasksText.classList.add('pinned');
        this.toggleTask(e.target, 'white', 'red', this.allTasks, this.pinnedTasks);
        let index = this.arrToSearch.indexOf(e.target.previousSibling.textContent);
        this.arrToSearch.splice(index, 1);
      }
    });
    this.removeTaskStar();
  }

  removeTaskStar() {
    document.body.addEventListener('click', (e) => {
      if (e.target.classList.contains('red') && e.target.closest('.main__task')) {
        this.pinnedTasksText.classList.remove('pinned');
        this.toggleTask(e.target, 'red', 'white', this.pinnedTasks, this.allTasks);
        this.arrToSearch.push(e.target.previousSibling.textContent);
      }
    });
  }
}
