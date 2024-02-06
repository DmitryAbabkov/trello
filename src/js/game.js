export default class TaskTracker {
  constructor(name) {
    this.name = name;
    this.input = document.querySelectorAll('input');
    this.allTasks = document.querySelector('.footer__task');
    this.pinnedTasks = document.querySelector('.main__task');
    this.pinnedTasksText = this.pinnedTasks.querySelector('.clue__pinned')
    this.clue = document.querySelector('.clue');
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
  }

  addTask() {
    this.input.forEach(item => {
    item.addEventListener('keyup', event => {
        if (event.code === 'Enter') {
          if (item.value) {
            this.generationTask(this.allTasks, item.value, 'white');
          } else this.clue.style = 'display: block';
        }
    });
    })
    this.addRemoveTask();
  }
  toggleTask(target, colCurrent, colNew, blockCurrent, blockNew) {
    this.pinnedTasksText.classList.toggle('pinned');
    target.classList.remove(colCurrent);
    target.classList.add(colNew);
    this.generationTask(blockNew, target.previousSibling.textContent, colNew);
    blockCurrent.removeChild(target.parentNode)
  }

  addRemoveTask() {
    document.body.addEventListener('click', (e) => {
      if (e.target.classList.contains('white') && e.target.parentNode.parentNode === this.allTasks) {
        this.toggleTask(e.target, 'white', 'red', this.allTasks, this.pinnedTasks);
      }
    });
    this.removeTaskStar();
  }

  removeTaskStar() {
    document.body.addEventListener('click', (e) => {
      if (e.target.classList.contains('red') && e.target.parentNode.parentNode === this.pinnedTasks) {
        this.toggleTask(e.target, 'red', 'white', this.pinnedTasks, this.allTasks);
      }
    });
  }

}
