import React, {useState, useEffect} from "react";
import {Button} from "react-bootstrap";
import Transaction from "./Transaction";

const Block = ({block}) =>{
    const [displayTransaction, setDisplayTransaction] = useState(false);
    const {timestamp, hash, data} = block;
    const hashDisplay = `${hash.substring(0, 15)}...`;
    const stringifiedData = JSON.stringify(data);
    const dataDisplay = stringifiedData.length > 35 ? `${stringifiedData.substring(0, 35)}...`: stringifiedData;


    const toggleTransaction = () =>{
        setDisplayTransaction(!displayTransaction);
    }

    const lessDataBlock = (
        <>
        <Button 
            bsStyle="danger"
            bsSize="small"
            onClick={toggleTransaction}
        >取引データを見る</Button>
        </>
    )

    const fullDataBlock = (
        <>
            <div>
                {
                    data.map(transaction => (
                        <div key={transaction.id}>
                            <hr />
                            <Transaction transaction={transaction}/>
                        </div>
                    ))
                }
            </div>
            <Button 
                bsStyle="danger"
                bsSize="small"
                onClick={toggleTransaction}
            >隠す</Button>
        </>
    )

    return (
        <div className="Block">
            <div>ハッシュ: {hashDisplay}</div>
            <div>時刻:{new Date(timestamp).toLocaleString()} </div>
            {displayTransaction ? fullDataBlock : lessDataBlock }
        </div>
    );
}

export default Block