import React, {useState, useEffect}from "react";
import {FormGroup, FormControl, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import history from "../history";

const ConductTransaction = () => {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState(0);
    const [knownAddresses, setKnownAddresses] = useState([])

    const handleRecipient =(e) =>{
        setRecipient(e.target.value);
    }
    const handleAmount =(e) =>{
        setAmount(Number(e.target.value));
        console.log(recipient, amount);
    }

    const conductTransaction = ()=>{
        fetch(`${document.location.origin}/api/transact`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({recipient, amount})
        }).then(response => response.json())
          .then(json =>{
            alert(json.message || json.type);
            history.push("/transaction-pool");
        });
    }

    useEffect(() => {
        fetch(`${document.location.origin}/api/known-address`)
        .then(response => response.json())
        .then(json => setKnownAddresses(json));
    }, [])

    return (
        <div className="ConductTransaction">
            <Link to="/">ホーム</Link>
            <h3>送金する</h3>
            <br/>
            <h4>送金先候補</h4>
            {
                knownAddresses.map(knownAddress => {
                    return (
                        <div key={knownAddress}>
                            {knownAddress}
                            <br/><br/>
                        </div>
                    )
                })
            }

            <FormGroup>
                <FormControl
                    input="text"
                    placeholder="送金先"
                    value={recipient}
                    onChange={handleRecipient}
                />
                <FormControl
                    input="number"
                    placeholder="送金量"
                    value={amount}
                    onChange={handleAmount}
                />
            </FormGroup>
            <div>
                <Button
                    bsStyle="danger"
                    onClick={conductTransaction}
                >送信</Button>
            </div>


        </div>
    )
}

export default ConductTransaction