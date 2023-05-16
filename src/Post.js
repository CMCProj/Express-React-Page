import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import API from './API';

function Post(props) {
    const [postElement, setPostElement] = useState(null);

    useEffect(() => {   //현재 등록된 입찰 건 내용을 서버에서 받아옴
        API.get('/post')
        .then((res) => {
            if(res.data){
                setPostElement(res.data);
            }
        });
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>
                        공사명
                    </th>
                    <th>
                        공사 ID
                    </th>
                    <th>
                        링크
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    postElement && postElement.map((value) => { //등록된 입찰 건을 테이블로 뿌려줌
                        return (
                            <tr>
                                <td key={value.bidID}>
                                    {value.constName}
                                </td>
                                <td>
                                    {value.bidID}
                                </td>
                                <td>
                                    <Link to={`/detail/${value.bidID}`}>입찰</Link>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}

export default Post;