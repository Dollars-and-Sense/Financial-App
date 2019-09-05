import React from "react";
import { Card } from "../style/styled";
import { QuestionListButton, QuestionListCard, ListHeading, Line } from "../style/preposttest";

interface Questions {
    id: Number;
    q: string;
}

interface AnswerList {
    id: string;
    value: string;
}

type Props = {
    answerList: AnswerList[];
    questions: Questions[];
    current: number;
    setQuestion: Function;
}

const HorLine = () => (
    <hr style={{
        borderTop: "1px",
        color: "#1f3d7d"
    }} />
);

const QuestionList = ({answerList, questions, current, setQuestion}: Props) => {


    return(
        <QuestionListCard>
            <ListHeading>Questions</ListHeading>
            {questions.map((q, i) =>
                <div> 
                    <Line />
                    <QuestionListButton 
                        onClick={() => setQuestion(i)}
                        key={i}
                        disabled={answerList[i] === undefined}
                        value={answerList[i] === undefined? null : answerList[i].value} >
                        {i+1}. {answerList[i] === undefined? "unanswered": answerList[i].value}
                    </QuestionListButton>    
                </div>
            )}
        </QuestionListCard>
    );
}

export default QuestionList;