const addTask = document.querySelectorAll('.col__add');
const cardEl = document.querySelectorAll('.card');
const cols = document.querySelectorAll('.col');
export default class Trello {
  constructor() {
    this.btnDel = document.querySelectorAll('.col__card');
    this.emptyCardExists = false;
    this.obj = localStorage.getItem('arrCard') ? JSON.parse(localStorage.getItem('arrCard')) : {
      "todo": [],
      "progress": [],
      "done": []
    }
    localStorage.setItem('arrCard', JSON.stringify(this.obj));
  }
  selectionOfCardsRendering(elementName, result, colName) {
    result[elementName].forEach(item => {
      const card = document.createElement('div');
      card.classList.add('col__card');
      this.addCard(card, item);
      cardEl.forEach(key => {
        if (key.parentNode.classList[1] == colName) {
          key.insertAdjacentElement('afterbegin', card);
        }
      });
    });
  }
  renderCard() {
    let result = JSON.parse(localStorage.getItem('arrCard'));
    if(result) {
      this.selectionOfCardsRendering("todo", result, 'col-1')
      this.selectionOfCardsRendering("progress", result, 'col-2')
      this.selectionOfCardsRendering("done", result, 'col-3')
      this.addEditCard();
    }
  }
  addEditCard() {
    addTask.forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.col')) {
          if (!this.emptyCardExists) {
            const card = document.createElement('div');
            const del = document.createElement('div');
            const input = document.createElement('input');
            card.classList.add('col__card');
            del.classList.add('delete');
            del.textContent = 'x';
            item.insertAdjacentElement('beforeBegin', card);
            card.insertAdjacentElement('afterBegin', del);
            card.insertAdjacentElement('afterBegin', input);
            input.addEventListener('keypress', (e) => {
              if (e.which === 13 && input.value) {
                e.preventDefault();
                this.pushArr("col-1", input, e, this.obj.todo);
                this.pushArr("col-2", input, e, this.obj.progress);
                this.pushArr("col-3", input, e, this.obj.done);
                this.addCard(card, input.value);
                input.value = '';
              }
            })
          }
        }
        this.emptyCardExists = true;
        this.deteteCard();
      })
    })
  }
  pushArr(colName, input, e, col) {
    if (e.target.parentNode.parentNode.classList[1] === colName) col.push(input.value);
  }
  addCard(card, input) {
    const cardEls = document.createElement('div');
    const del = document.createElement('div');
    del.textContent = 'x';
    del.classList.add('delete')
    cardEls.textContent = input;
    cardEls.classList.add('col__card-text')
    card.innerHTML = '';
    card.appendChild(cardEls);
    card.appendChild(del);
    this.emptyCardExists = false;
    localStorage.setItem('arrCard', JSON.stringify(this.obj));
    this.dragon();
  }
  deteteCard() {
    const del = document.querySelectorAll('.delete');
    del.forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target === item) {
          item.parentNode.remove();
          return this.emptyCardExists = false;
        }
      })
    })
  }
  dragon = () => {
    let balls = document.querySelectorAll('.col__card');
    const self = this;
    balls.forEach(ball => {
      ball.onmousedown = (e) => {
        if (e.target.classList[0] === "delete") {
          this.deteteCard()
          return e.target.parentNode.remove();
        }
        ball.style.position = 'absolute';
        ball.style.transform = 'rotate(8deg)'
        ball.style.cursor = 'grabbing';

        moveAt(e);
        document.body.appendChild(ball);
        ball.style.zIndex = 1000;
        ball.style.width = 211 + 'px';

        function moveAt(e) {
          ball.style.left = e.pageX - ball.offsetWidth / 2 + 'px';
          ball.style.top = e.pageY - ball.offsetHeight / 2 + 'px';
        }
        document.onmousemove = function(e) {
          moveAt(e);
        }
        ball.onmouseup = function() {
          document.onmousemove = null;
          ball.onmouseup = null;
          const ballRect = this.getBoundingClientRect();
          const ballCenterX = ballRect.x + ballRect.width / 2;
          cols.forEach(col => {
            const colRect = col.getBoundingClientRect();
            if (ballCenterX > colRect.x && ballCenterX < colRect.x + colRect.width) {
              const posit = col.querySelector('.card');
              this.style = '';
              posit.insertAdjacentElement('afterBegin', this);
              for (let key in self.obj) {
                if (self.obj[key].find(item => item == this.querySelector('.col__card-text').innerText)) {
                  self.obj[key] = self.obj[key].filter((number) => number !== this.querySelector('.col__card-text').innerText);

                  if (posit.parentNode.classList[1] == 'col-1') {
                    self.obj.todo.push(this.querySelector('.col__card-text').innerText);
                    localStorage.setItem('arrCard', JSON.stringify(self.obj));
                  }

                  if (posit.parentNode.classList[1] == 'col-2') {
                    self.obj.progress.push(this.querySelector('.col__card-text').innerText);
                    localStorage.setItem('arrCard', JSON.stringify(self.obj));

                  }
                  if (posit.parentNode.classList[1] == 'col-3') {
                    self.obj.done.push(this.querySelector('.col__card-text').innerText);
                    localStorage.setItem('arrCard', JSON.stringify(self.obj));

                  }

                }
              }
            }
          });
        }
      }
    });
  }
}
