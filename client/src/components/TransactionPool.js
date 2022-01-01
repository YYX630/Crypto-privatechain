import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import Transaction from "./Transaction";
import history from "../history";

const POOL_INTERVAL_MS = 10000;

const TransactionPool = ()=>{
    const [transactionPoolMap, setTransactionPoolMap] = useState({});
    
    const fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
        .then(response => response.json())
        .then(json => setTransactionPoolMap(json));
    }

    const fetchMineTransactions = () => {
        fetch(`${document.location.origin}/api/mine-transactions`)
        .then(response => {
            if (response.status === 200) {
                alert("success");
                history.push("/blocks");
            } else {
                alert("The mine-transactions request did not complete.")
            }
        })
        .then()
    }
    useEffect(() => {
        fetchTransactionPoolMap();
        const interval = setInterval(()=>fetchTransactionPoolMap(), POOL_INTERVAL_MS);

        return function cleanup(){
            clearInterval(interval);
        }
    },[])




    return (
        <div className="TransactionPool">
            <div><Link to="/">ホーム</Link></div>
            <h3>トランザクション　プール</h3>
            {
                Object.values(transactionPoolMap).map(transaction => {
                    return (
                        <div key={transaction.id}>
                            <hr/>
                            <Transaction transaction={transaction}/>
                        </div>
                    )
                })
            }
            <hr/>
            <Button bsStyle="danger" onClick={fetchMineTransactions}>Mine the Transactions</Button>

        </div>
    )
}


export default TransactionPool