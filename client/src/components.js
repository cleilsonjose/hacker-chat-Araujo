// responsavel por construir o layout
import blessed from 'blessed'

export default class ComponentBuilder{
  #screen
  #layout
  #input
  constructor() {}

  #baseComponent(){
    return {
      border: 'line',
      mouse: true,
      keys:true,
      scrollboar:{
        ch:'',
        inverse: true
      },
      //habilita colocar cores e tags nos textos
      tags:true
    }
  }

  setScreen({ title }){
      this.#screen = blessed.screen({
        smartCSR: true,
        title
      })

      this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
      return this
  }

  setLayoutComponent(){
    this.#layout = blessed.layout({
      parent: this.#screen,
      width:'100%',
      height:'100%',
    })

    return this
  }

  setInputComponent(onEnterPressed){
    const input = blessed.textarea({
      parent: this.#screen,
      bottom: 0,
      height: '10%',
      inputOnFocus: true,
      padding:{
        top: 1,
        left: 2
      },
      style:{
        fg:'#fcfffe',
        bg:'#353535'
      }
    })

    input.key('enter', onEnterPressed)
    this.#input = input

    return this

  }

  build(){
    const components = {
      screen: this.#screen,
      input: this.#input
    }

    return components
  }

}