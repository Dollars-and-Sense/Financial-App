import { bannerlogo } from 'assets';
import React from 'react';
import { Wrapper, Desc, DescText, LogoContainer} from 'style/home';

/*
 * Start page of the entire site, where users will get an overview of what this app is about, and where they will
 * login or creat their accounts
 */
const Startpage = ({
  loginUser,
  loggedin,
  logout,
}: {
  loginUser: any;
  loggedin: boolean;
  logout: any;
}): JSX.Element => {
  return (
    <>
      {loggedin ? (
        <Wrapper>
          <LogoContainer>
          <img src={bannerlogo} alt="United Way Logo" style={{ width: '100px', height: 'auto' }} />
          </LogoContainer>
          <Desc>
            <div className="desc-title">Dollars & $ense Reality Fair</div>
            <DescText>
              The United Way of Northeast Louisiana Dollars & $ense Reality Fair is a financial
              education simulation during which high school students actively learn how to make
              better financial decisions and gain knowledge of budgeting, saving, and spending.
            </DescText>
          </Desc>
          {/* Uncomment this to enable logout */}
          {/* <Logoutbutton onClick={() => logout()}> sign out </Logoutbutton> */}
        </Wrapper>
        ) : null
        // <LoginPOS>
        //   {/* Calling the LoginNumberTwo component with two props
        //           @prop login an APi function for logging a user in
        //           @prop loggedin a boolean to check if a user is logged in or not*/}
        //   <Login login={login} loggedin={loggedin} />
        // </LoginPOS>
        // <Login loginUser={loginUser} />
     }
    </>
  );
};

export default Startpage;
