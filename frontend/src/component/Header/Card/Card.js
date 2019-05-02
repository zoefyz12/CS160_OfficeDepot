import React from 'react';
import './Card.scss'
import { withRouter } from "react-router";

const goToCarddetails = (event,props) => {


    props.history.push('/productdetail/'+ props.cardId);
    event.preventDefault();
}
const Card = (props) => {



    return (
        <div onClick = {(event)=>goToCarddetails(event,props)} className='cardContent'>

                <img className="rounded picsize" src= {props.cardUrl} />

            <p className='short-description'>{props.cardName}</p>
        </div>
    );
};

export default withRouter(Card);