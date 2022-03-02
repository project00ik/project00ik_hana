/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact440.js
 * 작성일 : 2021. 05. 06
 * 작성자 : 
 * 설 명 : 상품신청(신청내역확인)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact440 = function(){
	
	return{
		
		apcPtclUpdate : function(gubun, formObj){
			if(gubun == "1"){// 원화요구불
				msb.util.form.createHiddenField(formObj, 'dpPrdApcUpdYn', "Y");// 수정여부
				msb.util.form.sendForm(formObj, '/untact/csuntact400.do');
			}else if(gubun == "2"){// 외화요구불
				msb.util.form.createHiddenField(formObj, 'frcDpPrdApcUpdYn', "Y");// 수정여부
				msb.util.form.sendForm(formObj, '/untact/csuntact410.do');
			}else if(gubun == "3"){// 전자금융
				msb.util.form.createHiddenField(formObj, 'elecFncApcUpdYn', "Y");// 수정여부
				msb.util.form.sendForm(formObj, '/untact/csuntact420.do');
			}
		},
		
		
		untact440Submit : function(formObj){
			
			var hanaJQuery = new HanaJQuery(null, true);
			hanaJQuery.ajaxSubmit('/untact/csuntact441.do', formObj, function(httpRequest, textStatus){
				var data = jQuery.parseJSON(httpRequest.responseText);
				if(data.result == 'success'){
					msb.util.form.sendForm(formObj, "/untact/csuntact500.do");
		    	}else{
		    		hanaDialog.openAlert({title:"오류", message:"요청하신 서비스가 처리중 오류가 발생하였습니다."});
		    		return false;	
		    	}
			});
			
			
		},
		
		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact440.js