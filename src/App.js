import './component/index.css';
import Header from './component/Header';
import Main from './component/Main';
import { useEffect, useReducer } from 'react';
import Loader from './component/Loader'
import Error from './component/Error';
import StartScreen from './component/Startscreen';
import Question from './component/Question';
import NextButton from './component/NextButton';
import Progress from './component/Progress';
import FinishedScreen from './component/FinishedScreen';
import Footer from './component/Footer';
import Timer from './component/Timer';

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  // loading, error, ready, active, finished
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" }
    case "error":
      return { ...state, status: "error" }
    case 'start':
      return { ...state, status: 'active', secondsRemaining: state.questions.length * SECS_PER_QUESTION }
    case 'newAnswer':
      const question = state.questions.at(state.index)
      return {
        ...state, answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points
      }
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null }
    case 'finish':
      return {
        ...state, status: "finished",
        highScore: state.points > state.highScore ? state.points : state.highScore
      }
    case 'restart':
      return { ...initialState, questions: state.questions, status: "ready" }
    case 'tick':
      return {
        ...state, secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status
      }

    default:
      throw new Error("Action unknown")
  }
}

function App() {

  const [{ questions, status, index, answer, points, highScore, secondsRemaining }, dispatch] = useReducer(reducer, initialState)
  const numQuestions = questions.length
  const maxPossiblePoints = questions.reduce((prev, current) => prev + current.points, 0)

  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((error) => dispatch({ type: 'error' }))
  }, [])

  return (
    <>
      <div className="app">
        <Header />
        <Main>
          {status === 'loading' && <Loader />}
          {status === 'error' && <Error />}
          {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
          {status === 'active' &&
            (<>
              <Progress
                index={index}
                numQuestions={numQuestions} points={points}
                maxPossiblePoints={maxPossiblePoints} answer={answer} />
              <Question question={questions[index]} dispatch={dispatch} answer={answer} />
              <Footer />
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions
              } />
            </>)}
          {status === 'finished' &&
            (< FinishedScreen points={points} maxPossiblePoints={maxPossiblePoints} highScore={highScore} dispatch={dispatch} />)}

        </Main>
      </div>
    </>
  );
}

export default App;
