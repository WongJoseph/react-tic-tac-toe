import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let className = "square";
    if(props.winLines && props.winLines.indexOf(props.index) > -1)
        className+= " highlight";

    return (
        <button className={className} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            winLines={this.props.winLines}
            index={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    printBoard() {
        let table = [];
        let index = 0;
        for(let i = 0; i < 3; i++) {
            let children = [];
            for(let j = 0; j < 3; j++) {
                children.push(this.renderSquare(index++))
            }
            table.push(<div className="board-row">{children}</div>)
        }
        return table;
    };

    render() {
        return (
            <div>
                {this.printBoard()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: null,
                winLines: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            asc: true,
        };
    }

    getPosition(i) {
        const width = 3;
        const x = i % width + 1;    // % is the "modulo operator", the remainder of i / width;
        const y = Math.floor(i / width) + 1;


        return '('+ x + ',' + y + ')';
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares, current) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                position: this.getPosition(i),
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        let history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares, current);

        let moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' ' + step.position:
                'Go to game start';
            return (
                <li key={move}>
                    <button style={ this.state.stepNumber !== move ? { fontWeight: 'normal' } : { fontWeight: 'bold' } } onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        });

        if(!this.state.asc)
            moves.reverse();

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if(this.state.stepNumber === 9) {
            status = 'Draw!';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winLines={current.winLines}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.setState( {
                        asc: !this.state.asc,
                    })}>{this.state.asc ? 'Toggle Descending' : 'Toggle Ascending'}</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares, current) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            current.winLines = lines[i];
            return squares[a];
        }
    }
    return null;
}
