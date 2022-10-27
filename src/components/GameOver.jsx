import React from 'react'

import styles from './GameOver.module.css'

const GameOver = ({retry, score}) => {
  return (
    <div className={styles.gameOver}>
        <h1>Fim de jogo</h1>
        <h2>A sua pontuação foi: <span>{score}</span></h2>
        <button onClick={retry}>Resetar Jogo</button>
    </div>
  )
}

export default GameOver