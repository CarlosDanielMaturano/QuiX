import React, { useState, useLayoutEffect, useEffect } from 'react'
import axios from 'axios'
import { QUIZ_DATA } from '../Statics/QuizData'
import AllQuestions from '../Components/AllQuestions'
import Result from '../Components/Result'
import Timer from '../Components/Timer'
import { useNavigate } from "react-router-dom";


const Quiz = ({ email }) => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [isComplete, setIsComplete] = useState(false)

    const [minutes, setMinutes] = useState(QUIZ_DATA.QUIZ_TIME.MINUTES);
    const [seconds, setSeconds] = useState(QUIZ_DATA.QUIZ_TIME.SECONDS);

    let navigate = useNavigate(); 

    const getQuestions = async () => {
        const API = QUIZ_DATA.QUIZ_API + 'amount=' + QUIZ_DATA.NUMBER_OF_QUESTIONS;

        try {
            setIsLoading(true);
            const questions = await axios.get(API);
            setQuestions(questions.data);
            // console.log(questions.data)
        } catch (error) {
            console.log(error);
            alert("Error getting questions! Please try again");
            navigate('/');
        } finally {
            setIsLoading(false);
        }
    }

    const endQuiz = () => {
        if(minutes === 0 && seconds === 0){
            setIsComplete(true);
        }
    }

    useLayoutEffect(() => {
        // console.log(minutes);
        // console.log(seconds)
        if(!email){
            alert("Please enter your email to get started!");
            navigate('/');
        }

        getQuestions();
    }, [])
    
    useEffect(() => {
        endQuiz();
    }, [minutes , seconds])
    

    const print = () => {
        console.log(questions);
        setIsComplete(true);
    }

    return (
        <>
            {
                !isLoading
                ?
                    !isComplete
                    ?
                        <div>
                            <Timer minutes={minutes} setMinutes={setMinutes} seconds={seconds} setSeconds={setSeconds} />
                            <AllQuestions questions={questions} />
                            <button onClick={print}>Submit</button>
                        </div>

                    :
                        <Result result={questions} />
                :

                <h1>Hang Tight!</h1>
            }
        </>
    )
}

export default Quiz