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
  const [organizations, setOrganizations] = useState([]);
  //Form disabled or active flag, set to "false" when an organization is selected
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
  const [askConfirmation, setAskConfirmation] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // List of avialable organizations
  useEffect(() => {
    api
      .getOrganizationNames()
      .then(
        (res: {
          success: boolean;
          message: string;
          organizations: Array<{ _id: string; name: string; __v: number }>;
        }) => {
          let temp = res.organizations.map(org => org.name);
          setOrganizations([...temp]);
        }
      )
      .catch((err) => {
        alert(err.message);
        setOrganizations([]);
      });
  }, []);

  const handleOptionClick = (option: string) => {
    setSelectedOrganization(option);
    setSearchTerm(option);
    setDisableSubmit(false);
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Filter organizations based on search term
  const filteredOrganizations = organizations.filter(org =>
    org.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="dropdown-container">
            <div className="custom-dropdown">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                onClick={toggleDropdown}
                placeholder="Select an organization"
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              />
              <span className="dropdown-icon" onClick={toggleDropdown}>
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
      
              {isOpen && (
                <ul className="dropdown-menu">
                  {filteredOrganizations.map((org, index) => (
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
