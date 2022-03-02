/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact410.js
 * 작성일 : 2021. 04. 02
 * 작성자 : 안영택
 * 설 명 : 상품신청(외환상품신청)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact410 = function(){
	
	return{
		
		// 비밀번호 확인
		acctPwConfirmKeypadClose : function(){
			
			$('#checkItem').val('acctPw1');
			
			//암호화 처리 시 반드시 호출
			mtk.fillEncData();

			if( ibk.csw.untact.common.null2void($('#acctPw1').val()) == "" || ibk.csw.untact.common.null2void($('#acctPw1Confirm').val()) == "") {
				return; // 비밀번호 확인 미입력시 검증안함 
			}
			
			if($('#acctPw1').val().length != 4 || $('#acctPw1Confirm').val().length != 4) {
				return;
			}
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/csUntactPwCheck.do', document.forms["untact410Form"], function(httpRequest, textStatus){
				var data = jQuery.parseJSON(httpRequest.responseText);
				if(data.resultMap.result == 'error'){
		    		$('#acctPw1ConfirmErrorTxt').text(data.resultMap.errorMsg).parent().parent().addClass("error_on");
		    	}else{
		    		$('#acctPw1ErrorTxt').text("").parent().parent().removeClass("error_on");
		    		$('#acctPw1ConfirmErrorTxt').text("").parent().parent().removeClass("error_on");
		    		$("#nextDiv").show();
					setTimeout(function () {
						focusMove.init($('#acctPw1Confirm'))	
					}, 100)
					bottomBtn.init();
		    	}
				
			});	
		},
		
		untact410Submit : function(formObj){
			if(ibk.csw.untact.common.null2void($('#acctPw1').val()) == ""){
				hanaDialog.openAlert({title:"알림", message:"비밀번호는 필수 입력 입니다."});
				return false;
			}
			if(ibk.csw.untact.common.null2void($('#acctPw1Confirm').val()) == "") {
				hanaDialog.openAlert({title:"알림", message:"비밀번호확인은 필수 입력 입니다."});
				return false;				
			}
			if($("#elecFncWdrwAcctChk").is(":checked")){
				if(ibk.csw.untact.common.null2void($('#elecFncUsrMgntNo1').val()) == ""){
					hanaDialog.openAlert({title:"알림", message:"전자금융 출금계좌 등록 선택시 이용자 아이디는 필수 입력 입니다."});
					return false;	
				}
			}
			
			$('#checkItem').val('acctPw1');
			//암호화 처리 시 반드시 호출
			mtk.fillEncData();
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/csUntactPwCheck.do', document.forms["untact410Form"], function(httpRequest, textStatus){
				var data = jQuery.parseJSON(httpRequest.responseText);
				if(data.resultMap.result == 'error'){
		    		hanaDialog.openAlert({title:"알림", message:data.resultMap.errorMsg});
					return false;	
		    	}else{
		    		ibk.csw.untact.untact410.doSubmit(formObj);
		    	}
				
			});	
			
		},
		
		doSubmit : function(formObj){
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/csuntact411.do', formObj, function(httpRequest, textStatus){
				var data = jQuery.parseJSON(httpRequest.responseText);
				if(data.result == 'success'){
					var url = "";
					if($("#elecFncApcYn").val() == "Y"){// 전자금융 페이지이동
						url = "/untact/csuntact420.do";
					}else{
						url = "/untact/csuntact430.do";
					}
					if($("#frcDpPrdApcUpdYn").val() == "Y"){// 수정일경우 신청내역확인 페이지 이동
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

//# sourceURL=ibk-csw-untact-untact410.js