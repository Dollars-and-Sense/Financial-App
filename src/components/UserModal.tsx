import React from 'react';
import styled from 'styled-components'
import { AddClass } from '../style/styled'
import RedX from '../assets/images/red_x.png';

const Wrapper = styled.div`
position: fixed;
z-index: 1;
left: 0;
top: 0;
width: 100%;
height: 100%;
background-color: rgba(0,0,0,0.4);
`;

const Modall = styled.div`
position: relative;
top: 20%;
background-color: #fefefe;
margin: 2% auto;
border: 1px solid #888;
width: 40%;
padding: 0;
max-width: 800px;
color: black;

@media(max-width: 879px){
  position: absolute;
  bottom: auto;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%)
}`;

const Btn = styled.div`
    color: red;
    background: white;
    border: 0;
    padding: 1em;
    width: 4em;
`;



const XButton = styled.img`
    width: 100%;
    transition: transform 700ms;

    &:hover {
        transform: scale(1.5);
    }
`;




const UserModal = (props: any) =>{

    console.log(props.buttonBackgroundColor);
    if(props.show){
        return (
            <Wrapper>
                <Modall>
                    <Btn style={{float: "right"}}  onClick={props.onClose}><XButton src={RedX}></XButton></Btn>
                    <div style={{margin: "5% 0 5% 5%"}}>
                        <p className="ta-left" style={{fontSize: "175%", margin: "1% 1% 2% 1%"}}>{props.modalTitle}: </p>
                        <div className="ta-left" style={{borderRadius: '0.1em'}}>
                            <input className="add-input" placeholder={props.inputText}></input>
                            {props.accountType === "teacher" ? <input className="add-input" placeholder='School Name'></input> : null}
                        </div>

                        <AddClass style={{
                            position: "relative", 
                            left: "40%", 
                            marginTop: '3%', 
                            backgroundColor: props.backgroundColor
                            }} 
                            onClick={props.onConfirm}>{props.buttonText}</AddClass>
                    </div>
                </Modall>
            </Wrapper>);
    } else{
    return null;
    }
};

export default UserModal;



