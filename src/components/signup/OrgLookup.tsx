import React, {
  useEffect,
  useState,
} from 'react';
import api from 'api';
import './style.css';

type props = {
  signUpUser: () => void;
  setSelectedOrganization: any;
  selectedOrganization: string;
};

const OrgConfirmation = ({
  signUpUser,
  setAskConfirmation,
  selectedOrganization,
}: {
  signUpUser: any;
  setAskConfirmation: any;
  selectedOrganization: string;
}): JSX.Element => {
  const [checked, setChecked] = useState([false, false]);
  const [organization, setOrganization] = useState(null);
  const [invalidSubmit, setInvalidSubmit] = useState(false);

  useEffect(() => {
    api
      .getOrganizationDetails(selectedOrganization)
      .then((res) => setOrganization(res))
      .catch((err) => alert(err.message));
  }, []);

  if (!organization) return null;
  return (
    <div className="auth-form">
      <div
        className="desc-title blue-text-dark"
        style={{ marginBottom: '0.25em' }}
      >
        Please confirm your organization
      </div>

      <div>
        Address:{' '}
        {`${organization.address}, ${organization.city}, ${organization.state}, ${organization.zip}`}
      </div>
      <div>Name: {organization.name}</div>

      <div
        style={{ display: 'flex', marginBottom: '0.25em', marginTop: '0.35em' }}
      >
        <input
          type="checkbox"
          id="check1"
          name="check1"
          checked={checked[0]}
          style={{ alignSelf: 'center', marginRight: '0.5em' }}
          onChange={() => setChecked([!checked[0], checked[1]])}
        />
        <label htmlFor="check1">
          <span
            style={{
              color: `${!checked[0] && invalidSubmit ? 'red' : '#9e9e9e'}`,
            }}
          >
            Yes, This is my organization.
          </span>
        </label>
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="checkbox"
          id="check2"
          name="check2"
          checked={checked[1]}
          style={{ alignSelf: 'center', marginRight: '0.5em' }}
          onChange={() => setChecked([checked[0], !checked[1]])}
        />
        <label htmlFor="check2">
          <span
            style={{
              color: `${!checked[1] && invalidSubmit ? 'red' : '#9e9e9e'}`,
            }}
          >
            I understand that I won't be able to change my organization
            afterwards.
          </span>
        </label>
      </div>
      <br />

      <div style={{ display: 'flex' }}>
        <button
          className="blue-button"
          onClick={() => setAskConfirmation(false)}
        >
          Back
        </button>

        <div style={{ flexGrow: 1 }}></div>
        <button
          className="yellow-button"
          // disabled={checked[0] && checked[1] ? false : true}
          onClick={() => {
            if (checked[0] && checked[1]) signUpUser();
            else {
              setInvalidSubmit(true);
            }
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

/**
 * Third part of the submit form. Called by SignupForm.tsx
 * Makes the user select an option from a list of organizations retrieved from the backend
 * @param signUpUser Function to aggregate all entered data and initiate an API call
 * @param setSelectedOrganization Update state of SignupForm.tsx
 */
const OrgLookup = ({
  signUpUser,
  setSelectedOrganization,
  selectedOrganization,
}: props) => {
  /**
   * List of avialable organizations
   */
  const [organizations, setOrganizations] = useState([]);
  /**
   * Form disabled or active flag.
   * set to "false" when an organization is selected
   */
  const [disableSubmit, setdisableSubmit] = useState<boolean>(true);
  const [askConfirmation, setAskConfirmation] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // API call
    api
      .getOrganizationNames()
      .then(
        (res: {
          success: boolean;
          message: string;
          organizations: Array<{ _id: string; name: string; __v: number }>;
        }) => {
          let temp: any = [];

          for (var i = 0; i < res.organizations.length; i++) {
            temp.push(res.organizations[i].name);
          }

          setOrganizations([...temp]);
        }
      )
      .catch((err) => {
        alert(err.message);
        setOrganizations([]);
      });
  }, []);


  const handleOptionClick = (option: any) => {
    setSelectedOrganization(option);
    setIsOpen(false);
  };


  const toggleDropdown = () => setIsOpen(!isOpen);


  if (askConfirmation)
    return (
      <OrgConfirmation
        signUpUser={signUpUser}
        setAskConfirmation={setAskConfirmation}
        selectedOrganization={selectedOrganization}
      />
    );
  else
    return (
      <>
        <form className="auth-form ">
          <div className="desc-title blue-text-dark">
            Enter your school/organization
          </div>

          {/* <input
            autoFocus
            placeholder={'Choose Orgnaization'}
            list="organizations"
            value={selectedOrganization}
            style={{
              border: '1px solid #005395',
              paddingLeft: '2.5%',
              margin: '3% 0 5%',
            }}
            onInput={(e) => {
              let val = (e.target as any).value;

              setdisableSubmit(val != '' ? false : true); // Make the submit button active

              setSelectedOrganization(val); // Update the selected organization
            }}
          />
          <datalist id="organizations">{getOptions()}</datalist> */}
          <div className="dropdown-container">
            <div className="custom-dropdown">
              <div onClick={toggleDropdown} className="dropdown-toggle">
                {selectedOrganization || 'Select an organization'}
                <span className="dropdown-icon">
                    {/* SVG Down Arrow Icon */}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      fill="currentColor" 
                      className="bi bi-caret-down-fill" 
                      viewBox="0 0 16 16"
                    > 
                  <path d="M3.5 6h9l-4.5 4.5L3.5 6z"/>
                </svg>
              </span>
            </div>
      
            {isOpen && (
              <ul className="dropdown-menu">
                {organizations.map((org, index) => (
                  <li key={index} onClick={() => handleOptionClick(org)}>
                    {org}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className="nextButton"
            disabled={disableSubmit}
            onClick={(e) => {
              e.preventDefault();
              if (organizations.includes(selectedOrganization))
                setAskConfirmation(true);
              // API call
              else {
                alert(
                  'Invalid Organization name! \nPlease select an organization from the dropdown list.'
                );
                setSelectedOrganization('');
              }
            }}
          >
            Next
          </button>
          </div>
        </form>
      </>
    );
};

export default OrgLookup;
