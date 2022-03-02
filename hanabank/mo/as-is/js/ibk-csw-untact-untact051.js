/*****************************************************************************
 * 파일명 : ibk-csw-untact-untact051.js
 * 작성일 : 2021. 05. 24
 * 작성자 : 차진태
 * 설 명 : 상품몰 - 기업자유예금(상세)
 * ===========================================================================
 * 변경이력:
 * DATE				AUTHOR		DESCRIPTION
 * ---------------------------------------------------------------------------
 * 변경 이력은 이곳에 추가 합니다.
 *****************************************************************************/

ibk.csw.untact.untact051 = function(){
	
	return{
		goMain: function(formObj) {
			msb.util.form.sendForm(formObj, '/untact/untact_index.do?nftfChnlKindCd=MW02809A01');
		},
		goPrdDesc : function() {
			// 상품설명서 및 이용약관
			var hanaJQuery = new HanaJQuery(msb.HANA_CONTENT, true);
			hanaJQuery.ajaxSubLoad('/untact/csuntact143.do?index=1', null,function() {
			}, false);
		},
		cswGoBack: function() {
//			ibk.csw.untact.common.notFormSubmit("/untact/csuntact050.do");
			var formObj = document.forms['untact051Form'];
			msb.util.form.sendForm(formObj, '/untact/csuntact050.do');
		},
		pageClose: function() {
			window.history.back();
		},
		dummy: null
	};
	
}();
//# sourceURL=ibk-csw-untact-untact051.js