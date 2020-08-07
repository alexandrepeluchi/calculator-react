import React, { Component } from 'react'
import './Calculator.css'

import Button from '../components/Button'
import Display from '../components/Display'

const initialState = {
    displayValue: '0',
    clearDisplay: false,
    operation: null,
    values: [0, 0], // valores digitados para a operação
    current: 0  // qual valor atual está manipulando
}

export default class Calculator extends Component {

    state = { ...initialState } // criamos um clone do objeto e atribuímos a state

    constructor(props) {
        super(props)

        this.clearMemory = this.clearMemory.bind(this)
        this.setOperation = this.setOperation.bind(this)
        this.addDigit = this.addDigit.bind(this)
    }

    clearMemory() {
        this.setState({ ...initialState })
    }

    setOperation(operation) {
        // vamos mexer no segundo valor do array (indice 1)
        // precisamos limpar o display para o dígito do segundo operando
        if (this.state.current === 0) {
            this.setState({ operation, current: 1, clearDisplay: true })
        } else {
            // lógica de concluir a operação
            const equals = operation === '='
            // caso haja uma operação anterior feita ele precisa pegar ela
            const currentOperation = this.state.operation

            const values = [...this.state.values]
            // pego o primeiro valor, a operação e depois o segundo valor
            // e aí através da função eval ele faz a operação
            // executa e armazena no valor [0] de values e o valor de [1] zera
            try {
                values[0] = eval(`${values[0]} ${currentOperation} ${values[1]}`)
            } catch (e) {
                values[0] = this.state.values[0] // pega o valor que está no estado
            }

            // ele vai gerar um warning dizendo que a função eval é perigosa de se usar nesse caso,
            // então se alguem preferir usar alguma estrutura como switch ou if else também pode

            values[1] = 0

            // colocamos isso no estado
            this.setState({
                displayValue: values[0],
                operation: equals ? null : operation,
                current: equals ? 0 : 1,
                clearDisplay: !equals,
                values // valores para serem atribuídos dentro do estado
            })
        }
    }

    addDigit(n) {
        if (n === '.' && this.state.displayValue.includes('.')) {
            return
        }

        // limpa o display caso em duas situações:
        // se o display contém o dígito 0 e vamos limpar ele para receber um novo dígito
        // ou quando a variável clearDisplay estiver true
        const clearDisplay = this.state.displayValue === '0'
            || this.state.clearDisplay
        const currentValue = clearDisplay ? '' : this.state.displayValue
        const displayValue = currentValue + n
        this.setState({ displayValue, clearDisplay: false })

        if (n !== '.') {
            const i = this.state.current
            const newValue = parseFloat(displayValue)
            const values = [...this.state.values]
            values[i] = newValue
            this.setState({ values })
            console.log(values)
        }
    }

    render() {
        return (
            <div className="calculator">
                <Display value={this.state.displayValue} />
                <Button label="AC" click={this.clearMemory} triple />
                <Button label="/" click={this.setOperation} operation />
                <Button label="7" click={this.addDigit} />
                <Button label="8" click={this.addDigit} />
                <Button label="9" click={this.addDigit} />
                <Button label="*" click={this.setOperation} operation />
                <Button label="4" click={this.addDigit} />
                <Button label="5" click={this.addDigit} />
                <Button label="6" click={this.addDigit} />
                <Button label="-" click={this.setOperation} operation />
                <Button label="1" click={this.addDigit} />
                <Button label="2" click={this.addDigit} />
                <Button label="3" click={this.addDigit} />
                <Button label="+" click={this.setOperation} operation />
                <Button label="0" click={this.addDigit} double />
                <Button label="." click={this.addDigit} />
                <Button label="=" click={this.setOperation} operation />
            </div>
        )
    }
}