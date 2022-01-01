import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {Button} from "react-bootstrap";
import Block from "./Block"

const Blocks = () =>{
    const [blocks, setBlocks] = useState([]);
    const [paginatedId, setPaginatedId] = useState(1);
    const [blocksLength, setBlocksLength] = useState(0);

    useEffect(()=>{
        fetch(`${document.location.origin}/api/blocks/length`)
        .then(response => response.json())
        .then(json => setBlocksLength(json));

        fetchPaginatedBlocks(paginatedId);  
    }, [paginatedId])

    const fetchPaginatedBlocks = (pagenatedId)=>{
        fetch(`${document.location.origin}/api/blocks/${paginatedId}`)
            .then(response => response.json())
                .then(json => {
                    setBlocks(json)
                });
    }

    return (
        <div>
            <div><Link to="/">ホーム</Link></div>
            <h3>Blocks</h3>
            <div>
                {
                    [...Array(Math.ceil(blocksLength/5)).keys()].map(key => {
                        const pageNum = key+1;
                        return (
                            <span key={key} onClick={()=>setPaginatedId(pageNum)}>
                                <Button bsSize="xsmall" bsStyle="danger">{pageNum}</Button>
                            </span>
                        )
                    })
                }
            </div>
            {blocks.map(block => <Block key={block.hash} block={block} />)}
        </div>
    ) 
}

export default Blocks