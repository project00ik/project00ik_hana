/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact100.js
 * 작성일 : 2021. 03. 02
 * 작성자 : 김이준
 * 설 명 : 비대면 실명확인 - 자격검증 - 개인정보입력 (실명인증)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact100 = function(){
	
	return{
		validateCustNm : function() {
			var custNm = $("#custNm").val();
			$('input[name=custNm]').val(custNm);
			var patt = /^[가-힣a-zA-Z ]+$/;
			if (custNm == '') {
				$('#custNmDiv').addClass("error_on");
				$("#custNmErrMsg").text("이름을 입력해 주세요");
				return false;
			} 
			if (!patt.test(custNm)) {
				$('#custNmDiv').addClass("error_on");
				$("#custNmErrMsg").text("특수문자를 입력할 수 없습니다");
				return false;					
			}
			$("#custNmErrMsg").text("");
			$('#custNmDiv').removeClass("error_on");
			return true;
		},
		/**
		 * 주민등록번호 포커스 이동   
		 */		
		nextFocus : function(obj){
			ibk.csw.untact.common.onlyNumber(obj);
			
			if(obj.val().length == 6){				
				$('#resRegNo2').focus();
				$('#custRegErrMsg').html('');
				$('#resRegNoDiv').removeClass("error_on");
			}else{
				$('#resRegNoDiv').addClass("error_on");
				$('#custRegErrMsg').text('주민등록번호 앞  6자리로 입력해주세요');
			}
		},
	
		/**
		 * 실명인증 - 유효성검증   
		 */
		resNoEfctvVrfc : function(formObj){
			 
			// 유효값 검증
			if(!msb.util.valid.isNull(formObj.custNm, "성명")) return false;
			var patt = /^[가-힣a-zA-Z ]+$/;
			if (!patt.test($('input[name=custNm]').val())) {
				hanaDialog.openAlert({title:"알림", message:'특수문자 및 숫자를 입력할 수 없습니다'});
				return false;
			}
			if(!msb.util.valid.isNull(formObj.resRegNo1, "주민등록번호") || !msb.util.valid.isNull(formObj.resRegNo2, "주민등록번호")) return false;
			if(formObj.resRegNo1.value.length < 6) {
				hanaDialog.openAlert({title:"알림", message:'주민등록번호는 13자리로 입력해 주세요'});
				return false;
			}
			
			//암호화 처리 시 반드시 호출
			mtk.fillEncData();			
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/csuntact101.do', formObj, function(httpRequest, textStatus){
				
				var data = jQuery.parseJSON(httpRequest.responseText);
				//console.log("return" , JSON.stringify(data));
				var realAge = parseInt(data.realAge);
				
				if(realAge <= 19){
					hanaDialog.openAlert({title:"알림", message:'죄송합니다. 본 서비스는  만 19세 이상의 고객만 가능합니다.'});
					return false;
				}else{
					msb.util.form.sendForm(formObj, '/untact/csuntact110.do');
				}

			});			
			
		}
		
	};
	
}();

//# sourceURL=ibk-csw-untact-untact100.js