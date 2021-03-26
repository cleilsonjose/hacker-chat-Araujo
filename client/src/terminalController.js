import ComponentBuilder from "./components.js";


export default class TerminalController {
  constructor() {}

  #onInputReceived(eventEmitter){
    return function (){
      const message = this.getValue()
      console.log(message)
      this.clearValue()
    }
  }

  async initializeTables(eventEmitter) {
    const components = new ComponentBuilder()
    .setScreen({ title:'HackerChat - Cleilson José'})
    .setLayoutComponent()
    .setInputComponent(this.#onInputReceived(eventEmitter))
    .build()

    components.input.focus()
    components.screen.render()
  }
}