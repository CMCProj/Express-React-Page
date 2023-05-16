import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from './API';
import Post from './Post';

function Main(props) {
    const [isLogin, setIsLogin] = useState(false);  //로그인 여부 확인을 위한 state

    useEffect(() => {   //페이지가 처음 렌더링될 때만 로그인 체크 실행
        console.log('로그인 여부 확인');
        API.get('/auth/authCheck').then((res) => {
            if(res.data){
                setIsLogin(true);
            }
        });
    }, []);

    const buttonHandler = () => {   //로그아웃 헨들러
        API.get('/auth/logout')
        .then((res) => {
            console.log('로그아웃');
            setIsLogin(false);
        });
    };

    if(isLogin){    //로그인되어 있을 때 보여줌
        return (
            <div>
                <Link to='/addFile'>
                    <button>공내역서 추가</button>
                </Link>
                <br/>
                <br/>
                <Post />
                <br/>
                <br/>
                <button onClick={buttonHandler}>로그아웃</button>
            </div>
        );
    }
    else{   //로그인되어있지 않을 때 보여줌
        return (
            <div>
                <Link to='/login'>
                    <button>로그인</button>
                </Link>
                <br/>
                <Link to="/register">
                    <button>회원가입</button>
                </Link>
            </div>
        );
    };
}

export default Main;