import React, { useState } from 'react';
import styled from 'styled-components';
import { career } from '../simulation/RunSimulation';

const Red = styled.span`
  color: red;
  font-size: 16pt;
`;

const Green = styled.span`
  color: green;
  font-size: 16pt;
`;

const Table = styled.table`
`;

const TableRow = styled.tr`
  border-bottom: none;
`;

const TableData = styled.td`
  padding: 0 0;
`

const formatDollars = (dollars: number) => {
  // Display commas in numbers and also show cents (even if 0.00)
  // Resource: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
  const options = {  minimumFractionDigits: 2, maximumFractionDigits: 2}
  const locale = 'en-US';
  return Intl.NumberFormat(locale, options).format(dollars);
}

const JobSummary = ({ career }: { career: career }): JSX.Element => {

  const anSal = formatDollars(career.annual_salary);
  const grossSal = formatDollars(career.annual_salary / 12);
  const fedTax = formatDollars(career.federalTax);
  const socialS = formatDollars(career.socialSecurity);
  const medicare = formatDollars(career.medicare);
  const sTax = formatDollars(career.stateTax);
  const insurance = formatDollars(career.insurance);
  const credit = formatDollars(career.credit);
  const training = formatDollars(career.training);
  const edu = career.education;
  const position = career.position;

  const netMonth = formatDollars(career.afterTaxMontlySalary);

  const vowel = new Set(['A', 'E', 'I', 'O', 'U']);

  const [grammar, setGram] = useState('a');
  const [flag, setFlag] = useState(false);

  if (vowel.has(position.charAt(0)) && flag == false) {
    setGram('an');
    setFlag(true);
  }

  return (
    <div className="generic-card" style={{ minWidth: '60vw' }}>
      <span style={{ fontWeight: 500, fontSize: '1.15em' }}>
        You were hired as {grammar}{' '}
        <span className="blue-text">{position}</span>, which requires an
        education level of at least a {edu}!
      </span>{' '}
      <br />
      <hr />
      <br />
      As {grammar} {position}, you will make <Green>${anSal}</Green> a year.
      <br />
      <br />
      This means your gross monthly salary is{' '}
      <Green>${grossSal}</Green>.
      <br />
      <br />
      You will have to pay the following taxes:
      <Table><tbody>
        <TableRow>
          <TableData>Federal Taxes:</TableData>
          <TableData><Red>${fedTax}</Red></TableData>
        </TableRow>
        <TableRow>
          <TableData>Social Security:</TableData>
          <TableData><Red>${socialS}</Red></TableData>
        </TableRow>
        <TableRow>
          <TableData>Medicare:</TableData>
          <TableData><Red>${medicare}</Red></TableData>
        </TableRow>
        <TableRow>
          <TableData>State Tax:</TableData>
          <TableData><Red>${sTax}</Red></TableData>
        </TableRow>
        <TableRow>
          <TableData>Insurance:</TableData>
          <TableData><Red>${insurance}</Red></TableData>
        </TableRow>
        <TableRow>
          <TableData>Credit Card Debt:</TableData>
          <TableData><Red>${credit}</Red></TableData>
        </TableRow>
        <TableRow>
          <TableData>Continuing Education/Training:</TableData>
          <TableData><Red>${training}</Red></TableData>
        </TableRow>
      </tbody></Table>
      <br />
      Which means your net monthly income is <Green>${netMonth}!</Green>
    </div>
  );
};

export default JobSummary;
