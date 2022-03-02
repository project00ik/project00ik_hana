/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact400.js
 * 작성일 : 2021. 03. 29
 * 작성자 : 안영택
 * 설 명 : 상품신청(입출금통장신청)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact400 = function(){
	
	return{
		
		// 비밀번호 확인
		acctPwConfirmKeypadClose : function(){
			
			$('#checkItem').val('acctPw');
			
			//암호화 처리 시 반드시 호출
			mtk.fillEncData();

			if( ibk.csw.untact.common.null2void($('#acctPw').val()) == "" || ibk.csw.untact.common.null2void($('#acctPwConfirm').val()) == "") {
				$("#nextDiv").hide();
				return false; // 비밀번호 확인 미입력시 검증안함 
			}
			
			if($('#acctPw').val().length != 4 || $('#acctPwConfirm').val().length != 4) {
				return false;
			}
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/csUntactPwCheck.do', document.forms["untact400Form"], function(httpRequest, textStatus){
				var data = jQuery.parseJSON(httpRequest.responseText);
				if(data.resultMap.result == 'error'){
		    		$('#acctPwConfirmErrorTxt').text(data.resultMap.errorMsg).parent().parent().addClass("error_on");
		    	}else{
		    		$('#acctPwErrorTxt').text("").parent().parent().removeClass("error_on");
		    		$('#acctPwConfirmErrorTxt').text("").parent().parent().removeClass("error_on");
		    		$("#nextDiv").show();
					setTimeout(function () {
						focusMove.init($('#acctPwConfirm'))	
					}, 100)
					bottomBtn.init();
		    	}
				
			});	
		},
		
		untact400Submit : function(formObj){
			if(ibk.csw.untact.common.null2void($('#acctPw').val()) == ""){
				hanaDialog.openAlert({title:"알림", message:"비밀번호는 필수 입력 입니다."});
				return false;
			}
			if(ibk.csw.untact.common.null2void($('#acctPwConfirm').val()) == "") {
				hanaDialog.openAlert({title:"알림", message:"비밀번호확인은 필수 입력 입니다."});
				return false;				
			}
			if($("#elecFncWdrwAcctChk").is(":checked")){
				if(ibk.csw.untact.common.null2void($('#elecFncUsrMgntNo').val()) == ""){
					hanaDialog.openAlert({title:"알림", message:"전자금융 출금계좌 등록 선택시 이용자 아이디는 필수 입력 입니다."});
					return false;	
				}
			}
			
			$('#checkItem').val('acctPw');
			//암호화 처리 시 반드시 호출
			mtk.fillEncData();
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/csUntactPwCheck.do', document.forms["untact400Form"], function(httpRequest, textStatus){
				var data = jQuery.parseJSON(httpRequest.responseText);
				if(data.resultMap.result == 'error'){
		    		hanaDialog.openAlert({title:"알림", message:data.resultMap.errorMsg});
					return false;	
		    	}else{
		    		ibk.csw.untact.untact400.doSubmit(formObj);
		    	}
				
			});	
			
		},
		
		doSubmit : function(formObj){
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/csuntact401.do', formObj, function(httpRequest, textStatus){
				var data = jQuery.parseJSON(httpRequest.responseText);
				if(data.result == 'success'){
					var url = "";
					if($("#frcDpPrdApcYn").val() == "Y"){// 외화요구불페이지이동
						url = "/untact/csuntact410.do";
					}else if($("#elecFncApcYn").val() == "Y"){// 전자금융페이지이동
						url = "/untact/csuntact420.do";
					}else{
						url = "/untact/csuntact430.do";// 영업점선택
					}
					if($("#dpPrdApcUpdYn").val() == "Y"){// 수정일경우 신청내역확인 페이지 이동
						url = "/untact/csuntact440.do";
					}
					msb.util.form.sendForm(formObj, url);
		    	}else{
		    		hanaDialog.openAlert({title:"오류", message:"요청하신 서비스가 처리중 오류가 발생하였습니다."});
		    		return false;	
		    	}
			});
			
		},
		
		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact400.js