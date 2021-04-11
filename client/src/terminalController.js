import ComponentBuilder from "./components.js";
import { constants } from "./constants.js";

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

  #onLogChanged({ screen, activityLog}){
    return msg => {
      const [userName] = msg.split(/\s/)
      const collor = this.#getUserCollors(userName)
      activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)

      screen.render()
    }
  }

  #onStatusChanged({ screen, status}){
    return users => {
      //pega o primeiro elemento
      const {content} = status.items.shift()
      status.clearItems()
      status.addItem(content)

     users.forEach(userName => {
        const collor = this.#getUserCollors(userName)
        status.addItem(`{${collor}}{bold}${userName}{/}`)
     })

      screen.render()
    }
  }

  #registerEvents(eventEmitter, components){
    eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
    eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components))
    eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components))
  }

  async initializeTables(eventEmitter) {
    const components = new ComponentBuilder()
    .setScreen({ title:'HackerChat - Cleilson José'})
    .setLayoutComponent()
    .setInputComponent(this.#onInputReceived(eventEmitter))
    .setChatComponent()
    .setActivityLogComponent()
    .setStatusComponent()
    .build()

    this.#registerEvents(eventEmitter, components)

    components.input.focus()
    components.screen.render()
/** 
    //teste
    setInterval(() => {
      const users = ['cleilson josé']

      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
      users.push('juliana')
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
      users.push('israel', 'livia')
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
      users.push('philipe', 'guilherme')
      eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
    },1000);
*/  
  }
}