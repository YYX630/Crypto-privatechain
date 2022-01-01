import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const App = ()=>{
    const [walletInfo, setWalletInfo] = useState({})

    useEffect(() => {
        //promise
        fetch(`${document.location.origin}/api/wallet-info`)
            .then(response=>response.json())
                .then(json => setWalletInfo(json));
    }, [])


    return(
        <div className="App">
            <img className="logo" src={logo}/>
            <br/>
            <div>YYX Coin Project</div>
            <br/>
            <div><Link to="/blocks">ブロックチェーンデータ</Link></div>
            <div><Link to="/conduct-transaction">送金する</Link></div>
            <div><Link to="/transaction-pool">トランザクションプール</Link></div>
            <br/>
            <div className="WalletInfo">
                <div>アドレス: {walletInfo.address}</div>
                <div>資産: {walletInfo.balance}コイン</div>
            </div>
        </div>
    )
}


export default App;