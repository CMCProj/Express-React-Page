import React, { useState } from 'react';
import API from './API';
import { Navigate } from 'react-router-dom';

function Register(props) {
    const [id, setID] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);  //회원가입 성공 여부 state

    const submitHandler = (e) => {
        e.preventDefault(); // submit 시 페이지 리로드 막기

        if(!id){
            return alert("아이디를 입력해주세요!");
        }
        else if(!password){
            return alert("비밀번호를 입력해주세요!");
        }
        else if(!password2 || password !== password2){
            return alert("비밀번호가 다릅니다!");
        }
        else{
            let body = {
                id,
                password
            };

            API.post('/auth/register_process', body)
            .then((res) => {
                console.log(res.data);
                if(res.data){
                    alert("회원가입 완료");
                    setIsSuccess(true);
                }
                else{
                    alert("회원가입 실패");
                }
            })
        }
    };

    return( //회원가입 성공시 로그인 페이지로 리다이렉트
        <div>
            {isSuccess ? <Navigate to='/login'></Navigate> : null}
            <form onSubmit={submitHandler}>
                아이디: &nbsp;
                <input type='text' name='ID' value={id} onChange={(e) => setID(e.target.value)}></input>
                <br/>
                비밀번호: &nbsp;
                <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <br/>
                비밀번호 확인: &nbsp;
                <input type='password' name='password2' value={password2} onChange={(e) => setPassword2(e.target.value)}></input>
                <br/>
                <button type='submit'>Register</button>
            </form>
        </div>
    )
}

export default Register