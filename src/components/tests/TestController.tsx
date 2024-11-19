import React, { useEffect, useRef, useState } from 'react';
import Tests from 'json/Tests.json';
import { TestLayout } from 'components';
import api from 'api';
import useStateCallback from 'utils/useStateCallback';
import TestInfoCard from './TestInfoCard';
import { ConfirmModal } from '../../components/shared-components/Modal'
interface Props {
  stage: string;
  setStage: Function;
}

const useBackendConnection = (stage: string) => {
  const [qNum, setQNum] = useStateCallback(null); //question number
  const [selections, setSelections] = useStateCallback(new Array(11)); //selected answers
  const [loading, setLoading] = useState(true);
  const [showInfoCard, setShowInfoCard] = useState(false);

  let store: any = useRef(); //used to access selections state in componentWillUnmount

  useEffect(() => {
    store.current = { stage, selections };
    retriveTest();

    /**
     * componentWillUnmount
     * Submits the answers to backend before unmounting
     */
    return () => {
      let { stage, selections } = store.current;
      submitAnswers(stage, selections);
    };
  }, []);

  /**
   * Updates the store ref
   */
  useEffect(() => {
    store.current = { ...store.current, selections };
  }, [selections]);

  useEffect(() => {
    if (qNum !== null) setLoading(false);
  }, [qNum, showInfoCard, selections]);

  const changePointer = (answers: Array<number>) => {
    let current = 0;

    if (answers.length > 0) {
      current = answers.length - 1;
    }

    setQNum(current);
  };

  /**
   * Retrive answers from backend
   */
  const retriveTest = () => {
    api
      .retriveTest(stage)
      .then((res: Array<number>) => {
        let x = res.length > 0 ? false : true;
        setShowInfoCard(x);
        setSelections(res);
        changePointer(res);
      })
      .catch((err) => alert(err.message));
  };

  /**
   * Submits the cuurent answers to backend
   * @param testType "pretest" or "posttest"
   * @param answers current answers
   */
  const submitAnswers = (testType: string, answers: any) => {
    api
      .updateTest({
        testType,
        answers,
      })
      .catch((err) => alert(err.message));
  };

  return {
    qNum,
    setQNum,
    selections,
    setSelections,
    loading,
    showInfoCard,
    setShowInfoCard,
  };
};

const TestController = (props: Props): JSX.Element => {
  //get questions & answers
  const questionList = Tests.questions;
  const answerList = Tests.answers;

  const {
    qNum,
    setQNum,
    selections,
    setSelections,
    loading,
    showInfoCard,
    setShowInfoCard,
  } = useBackendConnection(props.stage);

  const [answered, setAnswered] = useState('fade-out'); //for transition
  const [showModal, setShowModal] = useState(false);


  /**
   * Called by Save when answer selected, updates states, saves user selection
   * @param qNumber    question # associated w question
   * @param answer    user's selection
   */
  const storeSel = (qNumber: number, answer: number) => {
    let temp = [...selections];
    temp[qNumber] = answer;

    setSelections(temp);
  };

  /**
   * Called by [TestLayout]'s child component [QuestionCard] when user selects answer to question
   * @param qNumber  question number
   * @param answer  user's selection
   */
  const Save = (qNumber: number, answer: string) => {
    storeSel(qNumber, parseInt(answer));
  };

  const nextStageConfirmation = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (props.stage === 'pretest') props.setStage('simulation');
    else props.setStage('completed');
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  /**
   * Navigate to next or previous question via [TestLayout]
   */
  const next = (withFinish: Boolean) => {
    if (withFinish) nextStageConfirmation();
    else {
      setAnswered('fade-out active');
      setTimeout(() => setAnswered('fade-out'), 300);
      setTimeout(() => setQNum(qNum + 1), 300);
    }
  };

  const back = () => {
    setAnswered('fade-out active');
    setTimeout(() => setAnswered('fade-out'), 300);
    setTimeout(() => setQNum(qNum - 1), 300);
  };

  /**
   * Navigate to specific question number via [TestLayout]'s child component [QuestionList]
   * @param selected number of question user clicked
   */
  const set = (selected: number) => {
    setAnswered('fade-out active');
    setTimeout(() => setAnswered('fade-out'), 300);
    setTimeout(() => setQNum(selected));
  };

  //consolidate props for children
  const nav = { next, back, set };
  const data = {
    current: qNum,
    questions: questionList,
    answers: answerList,
    selections: selections,
    answered: answered,
  };

  if (loading) return null;
  else if (showInfoCard) {
    return (
      <TestInfoCard stage={props.stage} setShowInfoCard={setShowInfoCard} />
    );
  } else {
    return (
      <>
    <TestLayout nav={nav} save={Save} data={data} />
      {showModal && (
        <ConfirmModal
          text="Are you sure you want to move to the next stage? You won't be able to change your answers."
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
       </>
    );
  }
};

export default TestController;
