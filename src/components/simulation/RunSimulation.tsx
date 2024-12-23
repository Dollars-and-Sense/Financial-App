import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import 'style/simulation.css';

import { Spinner, JobSummary, BoothSelect, Booth } from '../index';
import api from 'api';

const Wrapper = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-columns: 25% 50% 25%;
  place-items: center;
  justify-items: center;
`;

const ScreenCenter = styled.div`
  grid-row: 1 / span 1;
  grid-column: 2 / span 1;
  text-align: center;
`;

const UserInfo = styled.div`
  grid-row: 1 / span 1;
  grid-column: 1 / span 1;
  padding: 4% 0;
  color: white;

  font-size: 1.05em;
  font-weight: 500;
`;

export interface career {
  position: String;
  monthlySalary: number;
  annual_salary: number;
  hourlyRate: number;
  federalTax: number;
  socialSecurity: number;
  medicare: number;
  stateTax: number;
  education: string;
  afterTaxMonthlySalary: number;
  training: number;
  credit: number;
  insurance: number;
}

const tempCareer = {
  annual_salary: 31137.600000000002,
  education: 'High School Diploma',
  federalTax: 389.22,
  hourlyRate: 16.2175,
  medicare: 36.327200000000005,
  monthlySalary: 2594.8,
  position: 'Carpenter',
  socialSecurity: 155.68800000000002,
  stateTax: 85.62840000000001,
  afterTaxMonthlySalary: 1190.235648,
  training: 0,
  credit: 0,
  insurance: 0,
};

interface Props {
  setStage: any;
  setEvaluationVals: any;
}

const RunSimulation = (props: Props): JSX.Element => {
  const [simStage, setSimStage] = useState(null); //Used for switching between the stages of the simulation

  const [myCareer, setMyCareer] = useState<career | undefined>(tempCareer);
  const [boothsInfo, setBoothsInfo] = useState(null);
  const [currentBooth, setCurrentBooth] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [visitedBooths, setVisitedBooths] = useState([]);

  const [notedVals, setNotedVals] = useState<{
    rent: number;
    transport: number;
    food: number;
  }>({ rent: 0, transport: 0, food: 0 });

  /**
   * Check if the user has already performed job selection. If so, don't let them select a new job
   */
  useEffect(() => {
    api
      .getAssignedJob()
      .then((res) => {
        let { jobSelected } = res;
        if (jobSelected) getJobDetail(jobSelected);
        else setSimStage('Job-Selection');
      })
      .catch((err) => alert(err.message));
  }, []);

  /**
   * Update Salary after a career is selected
   */
  useEffect(() => {
    setCurrentBalance(myCareer.afterTaxMonthlySalary);
  }, [myCareer]);

  useEffect(() => {
    if (simStage == 'Booth-Selection' && !boothsInfo) {
      api
        .getBoothsInfo()
        .then((res) => setBoothsInfo(res.booths))
        .catch((err) => alert(err.message));
    }
  }, [simStage]);

  /**
   * Updates the stage of the simulation when all booths are visited
   */
  useEffect(() => {
    if (simStage == 'Booth-Selection' && visitedBooths.length == 6) {
      props.setEvaluationVals({
        ...notedVals,
        balance: currentBalance,
        income: myCareer.monthlySalary,
      });

      // update evaluation vals in backend
      api
        .updateEvalVals({
          ...notedVals,
          balance: currentBalance,
          income: myCareer.monthlySalary,
        })
        .catch((err) => alert(err.message));
      props.setStage('evaluation');
    }
  }, [simStage]);
  /**
   * Gets details of the user selected job from backend and sets simStage to "Job-Selected"
   * @param jobname Name of the job selected by user
   */
  const getJobDetail = (jobname: string, setJobInBackend: boolean = false) => {
    api
      .getJobDetail(jobname.replaceAll('/', '_')) // String needs to be fixed before sending to backend
      .then((occupation) => {
        const { annual_salary, training, credit, ...other_attr } = occupation;
        const y: number = parseFloat((annual_salary / 12).toFixed(2)); // Monthly salary
        const career = {
          position: jobname,
          monthlySalary: y,
          annual_salary,
          hourlyRate: annual_salary / 52 / 40,
          federalTax: y * (other_attr.federal_tax_rate_mo || 0.15),
          socialSecurity: y * (other_attr.social_security_rate_mo || 0.06),
          medicare: y * (other_attr.medicare_rate_mo || 0.014),
          stateTax: y * (other_attr.state_tax_rate_mo || 0.033),
          insurance: y * 0.035,
          education: other_attr.education || "Bachelor's",
          training,
          credit,
          afterTaxMonthlySalary: 0
        };
        career.afterTaxMonthlySalary =
          career.monthlySalary -
          career.federalTax -
          career.socialSecurity -
          career.medicare -
          career.stateTax -
          career.insurance -
          career.training -
          career.credit;
        setMyCareer(career);

        setSimStage('Job-Selected'); // Change the state of "RunSimulation" component when donw
        if (setJobInBackend)
          api.assignJob(jobname).catch((err) => alert(err.message));
      })
      .catch((err) => alert(err.message));
  };

  /**
   * Decreases the value of "currentBalance" after a purchase in "Booth" component
   * @param newExpense The dollar amount of a new expense
   */
  const purchase = (newExpense: number) => {
    // Update notedVals based on current booth
    if (currentBooth == 2) {
      setNotedVals({ ...notedVals, rent: newExpense });
    } else if (currentBooth == 4) {
      setNotedVals({ ...notedVals, food: newExpense });
    } else if (currentBooth == 5) {
      setNotedVals({ ...notedVals, transport: newExpense });
    }
    setCurrentBalance(currentBalance - newExpense);
  };

  return (
    <>
      {simStage === 'Booth-Selected' ? (
        <div>
          <Booth
            setSimStage={setSimStage}
            currentBooth={currentBooth}
            booths={boothsInfo}
            currentBalance={currentBalance}
            increaseExpenses={purchase}
            remainingBalance={currentBalance.toFixed(2)}
          />
          {/* <UserInfo>Remaining Income: {currentBalance.toFixed(2)}</UserInfo> */}
        </div>
      ) : (
        <Wrapper>
          <ScreenCenter>
            {simStage === 'Job-Selection' && (
              <Spinner getJobDetail={getJobDetail} />
            )}
            {simStage === 'Job-Selected' && (
              <>
                <JobSummary career={myCareer} />
                <button
                  className="customButton"
                  style={{ marginTop: '2%' }}
                  onClick={() => setSimStage('Booth-Selection')}
                >
                  Continue
                </button>
              </>
            )}
            {simStage === 'Booth-Selection' && (
              <div>
                <h6 className="instructionsHeading">
                  Click on each category to make choices about how to spend your money.
                </h6>
                <p className="instructionsParagraph">
                  You can only visit each category once.
                </p>
                <UserInfo>
                  Remaining Monthly Income:{' '}
                  ${myCareer.afterTaxMonthlySalary
                    ? currentBalance.toFixed(2)
                    : ''}
                </UserInfo>
                <BoothSelect
                  setSimStage={setSimStage}
                  setCurrentBooth={setCurrentBooth}
                  boothsInfo={boothsInfo}
                  visitedBooths={visitedBooths}
                  setVisitedBooths={setVisitedBooths}
                  currentBalance={currentBalance}
                />
              </div>
            )}
          </ScreenCenter>
        </Wrapper>
      )}
    </>
  );
};

export default RunSimulation;
