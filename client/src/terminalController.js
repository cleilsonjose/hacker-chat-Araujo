import ComponentBuilder from "./components.js";


export default class TerminalController {
  #userCollors = new Map()

  constructor() {}

  #pickColor() {
    return `#` + ((1 << 24) * Math.random() | 0).toString(16) + `-fg`;
  }

  #getUserCollors(userName) {
    if (this.#userCollors.has(userName)) 
      return this.#userCollors.get(userName)

    const collor = this.#pickColor()
    this.#userCollors.set(userName, collor)

    return collor
  }

  #onInputReceived(eventEmitter){
    return function (){
      const message = this.getValue()
      console.log(message)
      this.clearValue()
    }
  }

  #onMessageReceived({ screen, chat}){
    return msg => {
      const { userName, message } = msg
      const collor = this.#getUserCollors(userName)

      chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)

      screen.render()
    }
  }

  #registerEvents(eventEmitter, components){
    eventEmitter.on('message:received', this.#onMessageReceived(components))
  }

  async initializeTables(eventEmitter) {
    const components = new ComponentBuilder()
    .setScreen({ title:'HackerChat - Cleilson José'})
    .setLayoutComponent()
    .setInputComponent(this.#onInputReceived(eventEmitter))
    .setChatComponent()
    .build()

    this.#registerEvents(eventEmitter, components)

    components.input.focus()
    components.screen.render()

    //teste
    setInterval(() => {
      eventEmitter.emit('message:received', { message: 'Oii', userName:'cleilson José'})
      eventEmitter.emit('message:received', { message: 'Oii', userName:'juliana'})
      eventEmitter.emit('message:received', { message: 'Olá', userName:'israel'})
      eventEmitter.emit('message:received', { message: 'Opa', userName:'livia'})
    },1000);
  }
}