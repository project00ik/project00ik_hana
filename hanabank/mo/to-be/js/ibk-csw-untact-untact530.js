/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact530.js
 * 작성일 : 2021. 03. 22
 * 작성자 : 임재학
 * 설 명 : 추가인증 - 추가인증 안내(타행)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact530 = function(){
	
	return{
		
		doNext : function(formObj){
			msb.util.form.sendForm(formObj, '/untact/csuntact531.do');
//			var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true);
//			hanaJQuery.ajaxLoad("/untact/csuntact531.do", formObj, null);
			
		},
		
		dummy : null
	};
	
}();

//# sourceURL=ibk-csw-untact-untact530.js