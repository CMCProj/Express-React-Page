import React, { useState } from "react";
import API from './API';
import { Navigate } from 'react-router-dom';

function Login(props) {
    const [ID, setID] = useState("");   //ID state
    const [password, setPassword] = useState("");   //비밀번호 state
    const [isSuccess, setIsSuccess] = useState(false);  //로그인 성공 여부 state

    const submitHandler = (e) => {
        e.preventDefault(); // submit 시 페이지 리로드 막기
        
        if(!ID){
            return alert("아이디를 입력하세요!");   //아이디 입력이 안되면
        }
        else if(!password){
            return alert("비밀번호를 입력하세요!"); //비밀번호 입력이 안되면
        }
        else{   //전부 입력되었으면
            let body = {
                ID,
                password
            };  //정보들을 body에 넣고

            API.post('/auth/login_process', body)   //post로 서버에 전송
            .then((res) => {
                if(res.data){
                    console.log("로그인");
                    alert("로그인 성공");
                    setIsSuccess(true); //로그인 성공시 true
                }
                else{
                    console.log("실패");
                    alert("로그인 실패");   //로그인 실패
                }
            });
        }
    };

    return (    //로그인이 성공하면 메인 페이지로 리다이렉트
        <div>
            {isSuccess ? <Navigate to='/'></Navigate> : null}   
            <form onSubmit={submitHandler}>
                아이디: &nbsp;
                <input type='text' name='ID' value={ID} onChange={(e) => setID(e.target.value)}/>
                <br/>
                비밀번호: &nbsp;
                <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                <br/>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}

export default Login;