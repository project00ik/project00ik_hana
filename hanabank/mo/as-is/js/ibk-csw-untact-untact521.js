/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact521.js
 * 작성일 : 2021. 03. 521
 * 작성자 : 임재학
 * 설 명 : 추가인증 - 당행 본인계좌확인
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact521 = function(){
	
	return{
		
		/**
		 * 계좌비밀번호 검증
		 */
		checkAcct : function( frmObj ) {
			//암호화 처리 시 반드시 호출
			mtk.fillEncData();
			
			if($('input[name=paymAcctNo]').val().length == 0){
				hanaDialog.openAlert({title:"알림", message:"계좌번호를 입력해 주세요."});
				return false;
			}
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/csuntact522.do', frmObj, function(httpRequest, textStatus){
				var data = jQuery.parseJSON(httpRequest.responseText);
				if(data.result == 'success'){
					
					$('#wdrwAcctNoChkYn').val('Y');
					$('#wdrwAcctNoCheck').val($('input[name=ourAcctCertAcctNo]').val());
					hanaDialog.openAlert({title:"알림", message:'인증되었습니다.', fCallback1:function(){	
						msb.util.form.sendForm(frmObj, '/untact/csuntact600.do');
					}});
				}else{
					$('#wdrwAcctNoChkYn').val('N');
					$('input[name=paymAcctPw]').val('');
					hanaDialog.openAlert({title:"알림", message:data.errorMsg});
				}
			});
		},
		
		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact521.js