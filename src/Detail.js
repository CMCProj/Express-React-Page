import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from './API';

function Detail(props) {
    const params = useParams(); //url의 id 값 가져오기
    const [floatProcess, setFloatProcess] = useState('1');  //단가 소수처리 state (1 : 소수 1자리 / 2 : 정수)
    const [checkbox, setCheckbox] = useState({  //체크박스의 각 옵션 처리 state (1 : 체크 O / 2 : 체크 X)
        standardPrice: '2',
        weight: '2',
        fixedPrice: '2',
        ceiling: '2',
        laborLimit: '2',
    });
    const [companyName, setCompanyName] = useState(""); //회사 명 state
    const [companyNum, setCompanyNum] = useState("");   //사업자등록번호 state
    const [BalancedRateNum, setBalancedRateNum] = useState(undefined);   //업계 평균 사정율 state
    const [PersonalRateNum, setPersonalRateNum] = useState(undefined);   //내 사정율 state
    const bidName = params.id;  //해당 공종의 번호

    const [bidFileList, setBidFileList] = useState(undefined);  //입찰서 리스트 state

    useEffect(() => {   //사용자가 작성한 해당 입찰 건의 리스트를 받아옴
        API.get("/createdBidList/" + bidName)
        .then((res) => {
            if(res.data)
                setBidFileList(res.data);
        });
    }, [])

    const floatProcessHandler = (e) => {    //단가 소수 처리 헨들러 
        setFloatProcess(e.target.value)
    }

    const checkboxHandler = (name, checked, value) => { //체크박스 헨들러 체크박스의 이름, 체크 여부, 값을 받아 state에 반영한다.
        if(checked){
            setCheckbox({...checkbox, [name]: value});
        }
        else if (!checked){
            setCheckbox({...checkbox, [name]: "2"});
        }
    }

    const submitHandler = (e) => {  //submit 헨들러
        e.preventDefault();

        if(companyName === ""){
            return alert("회사 명을 입력해주세요!");
        }
        else if(companyNum === ""){
            return alert("사업자등록번호를 입력해주세요!");
        }
        else if(companyNum.length !== 10){
            return alert("올바른 사업자등록번호를 입력해주세요! (10자리수)");
        }
        else if(BalancedRateNum === undefined){
            return alert("업계 평균 사정율을 입력해주세요!");
        }
        else if(isNaN(BalancedRateNum)){
            return alert("숫자를 입력해주세요!");
        }
        else if(Number(BalancedRateNum) > 3 || Number(BalancedRateNum) < -3){
            return alert("업계 평균 사정율 범위가 올바르지 않습니다! (-3 ~ +3)");
        }
        else if(PersonalRateNum === undefined){
            return alert("내 사정율을 입력해주세요!");
        }
        else if(isNaN(PersonalRateNum)){
            return alert("숫자를 입력해주세요!");
        }
        else if(Number(PersonalRateNum) > 3 || Number(PersonalRateNum) < -3){
            return alert("내 사정율 범위가 올바르지 않습니다! (-3 ~ +3)");
        }
        else{
            let body = {
                RadioDecimal_Check: floatProcess,
                CheckStandardPrice: checkbox.standardPrice,
                CheckWeightValue: checkbox.weight,
                CheckCAD_Click: checkbox.fixedPrice,
                CheckCeiling_Click: checkbox.ceiling,
                CheckLaborCost_Click: checkbox.laborLimit,
                CompanyRegistrationName: companyName,
                CompanyRegistrationNum: companyNum,
                BalancedRateNum: Number(BalancedRateNum),
                PersonalRateNum: Number(PersonalRateNum),
                bidName,
            };

            API.post('/createBid/revised_test', body)
            .then((res) => {
                console.log(res.data);
                if(res.data){
                    API.get("/createdBidList/" + bidName)
                    .then((res) => {
                        if(res.data)
                            setBidFileList(res.data);
                    });

                    return alert(`업계평균사정율: ${BalancedRateNum}, 내 사정율: ${PersonalRateNum} 입찰서 작성 완료!`); 
                }
                else{
                    return alert("입찰서 작성 도중 문제가 발생했습니다!");
                }
            });
        }
    }

    const downloadButton = (e) => { //다운로드 버튼 헨들러
        API.get("/data/download/" + encodeURIComponent(e.target.value), {responseType: "blob"})
        .then((res) => {
            if(res.data){
                const filename = ((e.target.value).split("\\"))[0]; //파일 경로에서 bid id 추출

                const fileUrl = window.URL.createObjectURL(res.data);   //받은 파일에 대한 URL을 생성
                const link = document.createElement('a');   //엥커 테그 생성
                link.href = fileUrl;    //엥커의 링크로 받은 파일의 URL을 설정
                link.style.display = 'none';    //사용자에게 엥커가 보이지 않게 설정

                link.download = filename + ".BID";   //다운로드받는 파일 이름 설정

                document.body.appendChild(link);    //HTML에 child로 엥커 추가
                link.click();   //엥커 클릭
                link.remove();  //앵커 삭제
            }
        });
    }

    return (
        <>
            <form onSubmit={submitHandler}>
                단가 소수 처리 &nbsp; &nbsp; <input type='radio' value={'1'} onChange={floatProcessHandler} checked={floatProcess === '1'}></input> 소수 1자리 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  원가 법정요율 &nbsp; <input type='checkbox' name="fixedPrice" value={"1"} onChange={e => {checkboxHandler(e.target.name, e.target.checked, e.target.value)}} checked={checkbox.fixedPrice === "1" ? true : false}></input> 0.3% 적용 <br/>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <input type='radio' value={'2'} onChange={floatProcessHandler} checked={floatProcess === '2'}></input> 정수
                <br/>
                표준시장단가 &nbsp; &nbsp; &nbsp; <input type='checkbox' name="standardPrice" value={"1"} onChange={e => {checkboxHandler(e.target.name, e.target.checked, e.target.value)}} checked={checkbox.standardPrice === "1" ? true : false}></input> 0.3% 적용 &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 투찰금액 원단위 &nbsp; <input type='checkbox' name="ceiling" value={"1"} onChange={e => {checkboxHandler(e.target.name, e.target.checked, e.target.value)}} checked={checkbox.ceiling === "1" ? true : false}></input> 천원 절상
                <br/>
                공중가중치 0% &nbsp; &nbsp; <input type='checkbox' name="weight" value={"1"} onChange={e => {checkboxHandler(e.target.name, e.target.checked, e.target.value)}} checked={checkbox.weight === "1" ? true : false}></input> 최소단가&#40;50%&#41; 적용 &nbsp; &nbsp; 노무비 하한율 &nbsp; &nbsp; <input type='checkbox' name="laborLimit" value={"1"} onChange={e => {checkboxHandler(e.target.name, e.target.checked, e.target.value)}} checked={checkbox.laborLimit === "1" ? true : false}></input> 80% 적용
                <br/>
                <br/>
                회사 명 &nbsp; &nbsp; <input type="text" name="companyName" value={companyName} onChange={e => {setCompanyName(e.target.value)}}></input>
                <br/>
                사업자등록번호 &nbsp; &nbsp; <input type="text" name="companyNum" value={companyNum} onChange={e => {setCompanyNum(e.target.value)}}></input>
                <br/>
                <br/>
                업계 평균 사정율 &nbsp; &nbsp; <input type="text" name="BalancedRateNum" value={BalancedRateNum} onChange={e => {setBalancedRateNum(e.target.value)}}></input>
                <br/>
                내 사정율 &nbsp; &nbsp; <input type="text" name="PersonalRateNum" value={PersonalRateNum} onChange={e => {setPersonalRateNum(e.target.value)}}></input>
                <br/>
                <br/>
                <button type='submit'>입찰하기</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>
                            입찰서 리스트
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        bidFileList && bidFileList.map((value) => {
                            return(
                                <tr>
                                    <td key = {value.bidID}>
                                        {value.bidPath} &nbsp; <button value={value.bidPath} onClick={downloadButton}>다운로드</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
        
    );
}

export default Detail;