import React from 'react';


const PriceWarning = ({setSimStage}:any) =>{

    function goBack(){
        setSimStage("boothSelect");
    }

    return(

        <div>
            You cannot afford anything on this booth, click continue
            and select another booth

            <button className="btn" onClick={()=>goBack()}>CONTINUE</button>
        </div>
    );
} 

export default PriceWarning;