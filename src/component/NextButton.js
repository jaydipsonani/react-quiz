function NextButton({ dispatch, answer, index, numQuestions }) {
    if (answer === null) return null

    if (index < numQuestions - 1)
        return (
            <div>
                <button className="btn btn-ui" onClick={() => dispatch({ type: 'nextQuestion' })}>NEXT</button>
            </div>
        )

    if (index === numQuestions - 1)
        return (
            <div>
                <button className="btn btn-ui" onClick={() => dispatch({ type: 'finish' })}>FINISH</button>
            </div>
        )
}

export default NextButton
